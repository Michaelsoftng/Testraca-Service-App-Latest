import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_URL_WS_NOTIFICATIONS } from "../../../config";

type NotificationEvent =
  | "REQUEST_ACCEPTED"
  | "CONSULTATION_ACCEPTED"
  | "RESULT_REVIEW_ACCEPTED"
  | "SAMPLE_RECEIVED_AT_LAB"
  | "DISPATCHER_ASSIGNED"
  | "NEW_DISPATCH_TASK"
  | "NEW_PHLEB_TASK"
  | "NEW_CONSULTATION_REQUEST";

export interface RequestNotificationMessage {
  type: "new_request_notification";
  event: NotificationEvent;
  title: string;
  message: string;
  request_id?: string;
  consultation_id?: string;
  result_review_id?: string;
}

interface Props {
  token: string | null;
  enabled?: boolean;
  onNotification: (data: RequestNotificationMessage) => void;
}

export const useNotificationSocket = ({ token, enabled = true, onNotification }: Props) => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const manualCloseRef = useRef(false);

  const [connected, setConnected] = useState(false);

  const onNotificationRef = useRef(onNotification);
  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);

  const connect = useCallback(() => {
    if (!token || !enabled) return;

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    manualCloseRef.current = false;

    const normalizedBaseUrl = BASE_URL_WS_NOTIFICATIONS.endsWith("/")
      ? BASE_URL_WS_NOTIFICATIONS
      : `${BASE_URL_WS_NOTIFICATIONS}/`;
    const wsUrl = `${normalizedBaseUrl}?token=${encodeURIComponent(token)}`;

    console.log("🔔 Notification WS connecting →", wsUrl);

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Notification WS Connected");
      setConnected(true);
      reconnectAttemptsRef.current = 0;

      // Keep-alive ping only — RequestNotificationConsumer has no receive()
      // handler and never replies with "pong", so there is nothing to watch
      // for here. (A previous version force-closed the socket if no pong
      // arrived within 45s, which meant it reconnected every ~45s forever
      // on an otherwise-healthy connection.)
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      heartbeatRef.current = setInterval(() => {
        try {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        } catch (e) {
          console.warn("⚠️ Failed to send notification ping", e);
        }
      }, 20000);
    };

    ws.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);

        if (raw === "pong" || raw?.type === "pong") {
          return;
        }

        if (raw?.type === "new_request_notification") {
          onNotificationRef.current(raw as RequestNotificationMessage);
        }
      } catch (err) {
        console.warn("⚠️ Invalid notification WS message", event.data, err);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ Notification WS Error", err);
    };

    ws.onclose = (event) => {
      console.warn("🔌 Notification WS Closed", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
      setConnected(false);
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
      socketRef.current = null;

      if (manualCloseRef.current) return;

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }

      const attempt = Math.min(10, reconnectAttemptsRef.current || 1);
      const base = Math.min(1000 * 2 ** attempt, 10000);
      const jitter = Math.floor(Math.random() * 500);
      const delay = base + jitter;
      reconnectAttemptsRef.current = attempt + 1;
      console.log(`🔄 Notification WS reconnect scheduled in ${delay}ms`);
      reconnectTimerRef.current = setTimeout(connect, delay);
    };
  }, [token, enabled]);

  useEffect(() => {
    if (!enabled || !token) {
      manualCloseRef.current = true;
      socketRef.current?.close();
      socketRef.current = null;
      return;
    }

    connect();

    return () => {
      manualCloseRef.current = true;

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }

      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [connect, enabled, token]);

  return { connected };
};
