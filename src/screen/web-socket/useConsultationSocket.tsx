import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_URL_WS } from "../../../config";

type Origin = "user" | "system";
type MessageType = "text" | "audio" | "video";
type ActionType = "update_message" | "update_session";
type SessionAction =
  | "end"
  | "end_consultation"
  | "typing"
  | "stop_typing"
  | "read"
  | "start_audio_call"
  | "start_video_call"
  | "error";

interface MessagePayload {
  origin: Origin;
  type?: MessageType;
  message?: string;
  sender_id?: string;
  sender_name?: string;
  action?: SessionAction;
  message_id?: string;
  timestamp?: string;
  reason?: string;
  room_id?: string;
  call_url?: string;
}

interface SocketMessage {
  action_type: ActionType;
  payload: MessagePayload;
}

interface Props {
  consultationId: string;
  token: string;
  onMessage: (data: SocketMessage) => void;
  /**
   * If true (default) the hook will send an `authenticate` message after open.
   * Set to false to test server behavior when only token query param is used.
   */
  authOnOpen?: boolean;
}

export const useConsultationSocket = ({
  consultationId,
  token,
  onMessage,
  authOnOpen = true,
}: Props) => {
  const socketRef = useRef<WebSocket | null>(null);
  const lastMessageRef = useRef<string | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const lastPongRef = useRef<number>(Date.now());
  const reconnectAttemptsRef = useRef(0);
  const pendingMessagesRef = useRef<string[]>([]);
  const manualCloseRef = useRef(false);
  // Track recently sent message_ids to avoid duplicating incoming messages that are server echoes
  const sentMessageIdsRef = useRef<Set<string>>(new Set());

  const [connected, setConnected] = useState(false);

  const connect = useCallback(() => {
    if (!consultationId || !token) return;

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    manualCloseRef.current = false;

    const normalizedBaseUrl = BASE_URL_WS.endsWith("/") ? BASE_URL_WS : `${BASE_URL_WS}/`;
    const wsUrl = `${normalizedBaseUrl}${consultationId}/?token=${encodeURIComponent(token)}`;

    console.log("🌐 WS connecting →", wsUrl);

    // Create socket
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WS Connected", { url: ws.url });
      setConnected(true);
      // reset attempts on successful connect
      reconnectAttemptsRef.current = 0;

      // reset pong tracker and start heartbeat pings
      lastPongRef.current = Date.now();
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      heartbeatRef.current = setInterval(() => {
        try {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
            console.log("💓 Ping sent");
          }
        } catch (e) {
          console.warn("⚠️ Failed to send ping", e);
        }

        // If we haven't received a pong in a while, force a reconnect
        if (Date.now() - lastPongRef.current > 45000) {
          console.warn("⚠️ No pong received in 45s, closing socket to force reconnect");
          try {
            ws.close();
          } catch (e) {
            /* ignore */
          }
        }
      }, 20000);

      // flush any pending outbound messages
      if (pendingMessagesRef.current.length) {
        console.log(`🔁 Flushing ${pendingMessagesRef.current.length} queued messages`);
        const pending = [...pendingMessagesRef.current];
        pendingMessagesRef.current = [];
        for (const m of pending) {
          if (m && ws.readyState === WebSocket.OPEN) {
            try {
              ws.send(m);
              console.log("📤 Flushed WS message");
            } catch (e) {
              console.warn("⚠️ Failed to flush message, re-queueing", e);
              pendingMessagesRef.current.push(m);
            }
          }
        }
      }

      if (authOnOpen) {
        // Send an explicit authenticate message after open. Some servers accept token via query
        // string, others expect an initial auth message — enable this only when needed.
        try {
          const authMsg = JSON.stringify({ action_type: "authenticate", payload: { token } });
          // small delay to avoid racing with server's initial welcome message
          setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(authMsg);
              console.log("🔐 Sent auth message");
            }
          }, 120);
        } catch (err) {
          console.warn("⚠ Failed to send auth message", err);
        }
      } else {
        console.log("ℹ️ authOnOpen disabled — not sending auth message on open");
      }
    };

    ws.onmessage = (event) => {
      // keep raw message for debugging (capture last message before any close)
      try {
        lastMessageRef.current = typeof event.data === "string" ? event.data : JSON.stringify(event.data);
      } catch {}

      console.log("📩 RAW WS message:", event.data);
      try {
        const raw = JSON.parse(event.data);

        // treat ping/pong frames specially to maintain connection health
        if (raw === "pong" || (raw && raw.type === "pong")) {
          lastPongRef.current = Date.now();
          console.log("💬 Received pong");
          return;
        }

        // Early detect: if this is a server echo of a message we sent (by message_id),
        // mark it so ChatScreen can merge with optimistic message instead of showing duplicate
        if (raw && raw.payload && raw.payload.message_id && sentMessageIdsRef.current.has(raw.payload.message_id)) {
          console.log("🔄 Server echo detected for message_id:", raw.payload.message_id);
        }

        // Normalize messages to the SocketMessage shape the app expects
        if (raw && typeof raw === "object") {
          if (raw.action_type && raw.payload) {
            // NOTE: Do NOT add incoming message_ids to sentMessageIdsRef!
            // sentMessageIdsRef should only track messages WE sent (in sendMessage callback)
            // Incoming messages from other users have their own message_ids that should NOT be confused with ours
            onMessageRef.current(raw as SocketMessage);
            return;
          }

          // Some server messages come as plain payloads (origin/type/message...).
          // Convert them into { action_type: 'update_message', payload }
          if (raw.origin && (raw.message || raw.type)) {
            const normalized: SocketMessage = {
              action_type: "update_message",
              payload: {
                origin: raw.origin,
                type: raw.type,
                message: raw.message,
                sender_id: raw.sender_id,
                sender_name: raw.sender_name,
                // ensure we have a stable id for client rendering
                message_id:
                  raw.message_id || raw.id || raw.timestamp || `${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
              },
            };
            onMessageRef.current(normalized);
            return;
          }

          // Fallback: if server sends a generic session update, wrap it
          if (raw.action || raw.session_action) {
            const normalized: SocketMessage = {
              action_type: "update_session",
              payload: {
                origin: raw.origin || "system",
                action: (raw.action || raw.session_action) as any,
              },
            };
            onMessageRef.current(normalized);
            return;
          }
        }

        // If nothing matched, pass raw through and let consumer handle it
        onMessageRef.current(raw as SocketMessage);
      } catch (err) {
        console.warn("⚠️ Invalid WS message", event.data, err);
      }
    };

    ws.onerror = (err) => {
      // err is usually an Event in RN; log whatever we can
      try {
        console.error("❌ WS Error", err);
      } catch (e) {
        console.error("❌ WS Error (unknown)", e);
      }
    };

    ws.onclose = (event) => {
      console.warn("🔌 WS Closed", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
      if (lastMessageRef.current) {
        console.log("📌 Last raw message before close:", lastMessageRef.current);
      }
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

      // Exponential backoff with jitter using a dedicated attempts counter
      const attempt = Math.min(10, reconnectAttemptsRef.current || 1);
      const base = Math.min(1000 * 2 ** attempt, 10000);
      const jitter = Math.floor(Math.random() * 500);
      const delay = base + jitter;
      reconnectAttemptsRef.current = attempt + 1;
      console.log(`🔄 Reconnect scheduled in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
      reconnectTimerRef.current = setTimeout(connect, delay);
    };
  }, [consultationId, token]);

  // Store the onMessage callback in a ref so we can call it without triggering reconnects
  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
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
      sentMessageIdsRef.current.clear();
    };
  }, [connect]);

  const sendMessage = useCallback(
    (payload: MessagePayload, actionType: ActionType) => {
      const message = { action_type: actionType, payload };
      const msgStr = JSON.stringify(message);

      // Track outgoing message_id so we can identify server echoes later
      if (payload.message_id) {
        sentMessageIdsRef.current.add(payload.message_id);
      }

      // If connection is open, send immediately and return true
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        try {
          socketRef.current.send(msgStr);
          console.log("📤 WS Sent:", message);
          return true;
        } catch (e) {
          console.warn("⚠️ Failed to send, queueing message", e);
          pendingMessagesRef.current.push(msgStr);
          return false;
        }
      }

      // Otherwise queue message to be sent when connection is restored
      pendingMessagesRef.current.push(msgStr);
      console.log("🕒 WS not open, queued message. Queue length:", pendingMessagesRef.current.length);
      return false;
    },
    []
  );

  return { sendMessage, connected };
};






// import { useEffect, useRef, useCallback, useState } from "react";
// import { BASE_URL_WS } from "../../../config";

// type Origin = "user" | "system";
// type MessageType = "text" | "audio" | "video";
// type ActionType = "update_message" | "update_session";
// type SessionAction =
//   | "end_consultation"
//   | "typing"
//   | "stop_typing"
//   | "read";

// interface MessagePayload {
//   origin: Origin;
//   type?: MessageType;
//   message?: string;
//   sender_id?: string;
//   sender_name?: string;
//   action?: SessionAction;
//   message_id?: string;
// }

// interface SocketMessage {
//   action_type: ActionType;
//   payload: MessagePayload;
// }

// interface Props {
//   consultationId: string;
//   token: string;
//   onMessage: (data: SocketMessage) => void;
// }

// export const useConsultationSocket = ({
//   consultationId,
//   token,
//   onMessage,
// }: Props) => {
//   const socketRef = useRef<WebSocket | null>(null);
//   const heartbeatRef = useRef<number | null>(null);
//   const reconnectRef = useRef<number | null>(null);
//   const reconnectAttempts = useRef(0);

//   const [connected, setConnected] = useState(false);
//   const [connecting, setConnecting] = useState(false);
//   const [reconnecting, setReconnecting] = useState(false);

//   const connect = useCallback(() => {
//     if (!consultationId || !token) return;

//     console.log("🌐 Connecting WS:", token);

//     setConnecting(true);

//     // const wsUrl = `${BASE_URL_WS}${consultationId}/?token=${encodeURIComponent(
//     //   token
//     // )}`;
//     // const ws = new WebSocket(`${BASE_URL_WS}${consultationId}/`, {
//     //     headers: {
//     //         Authorization: `Bearer ${token}`,
//     //     },
//     // });

//     // const wsUrl = `${BASE_URL_WS.replace(/\/$/, "")}/${consultationId}/?token=${encodeURIComponent(token)}`;

//     // Use Authorization header to send token instead of putting it in the query string.
//     // Note: browser WebSocket does not support headers; this approach is intended for React Native's WebSocket implementation.
//     const ws = new (WebSocket as any)(
//       `${BASE_URL_WS}${consultationId}/`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     // const ws = new WebSocket(wsUrl);
//     console.log('WS URL:', ws.url);
//     socketRef.current = ws;

//     ws.onopen = () => {
//       // console.log('DLSKKSKK ::::: ',token);
//         // ws.send(JSON.stringify({ action: "authenticate", Authorization: `Bearer ${token}` }));
//       console.log("✅ WS Connected");
//       setConnected(true);
//       setConnecting(false);
//       setReconnecting(false);
//       reconnectAttempts.current = 0;

//       // Heartbeat / ping every 20 seconds
//       heartbeatRef.current = setInterval(() => {
//         if (ws.readyState === WebSocket.OPEN) {
//           ws.send(JSON.stringify({ type: "ping" }));
//           console.log("💓 Ping sent");
//         }
//       }, 20000) as unknown as number;
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data: SocketMessage = JSON.parse(event.data);
//         console.log("📩 Incoming WS message:", data);
//         onMessage(data);

//         // Auto-send read receipt for user messages
//         if (
//           data.action_type === "update_message" &&
//           data.payload.origin === "user" &&
//           data.payload.message_id
//         ) {
//           sendMessage(
//             {
//               origin: "system",
//               action: "read",
//               message_id: data.payload.message_id,
//             },
//             "update_message"
//           );
//         }
//       } catch (err) {
//         console.warn("⚠ Invalid WS message:", event.data);
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("❌ WS Error:", err);
//     };

//     ws.onclose = () => {
//       console.log("🔌 WS Closed");
//       setConnected(false);
//       if (heartbeatRef.current) clearInterval(heartbeatRef.current);

//       // Reconnect with exponential backoff
//       const timeout = Math.min(1000 * 2 ** reconnectAttempts.current, 10000);
//       reconnectAttempts.current += 1;
//       setReconnecting(true);
//       console.log(`🔄 Attempting reconnect in ${timeout}ms`);

//       reconnectRef.current = setTimeout(connect, timeout) as unknown as number;
//     };
//   }, [consultationId, token, onMessage]);

//   useEffect(() => {
//     connect();
//     return () => {
//       if (heartbeatRef.current) clearInterval(heartbeatRef.current);
//       if (reconnectRef.current) clearTimeout(reconnectRef.current);
//       socketRef.current?.close();
//     };
//   }, [connect]);

//   const sendMessage = useCallback(
//     (payload: MessagePayload, actionType: ActionType) => {
//       if (socketRef.current?.readyState !== WebSocket.OPEN) {
//         console.warn("⚠ Cannot send, WS not connected");
//         return;
//       }
//       const message = { action_type: actionType, payload };
//       socketRef.current.send(JSON.stringify(message));
//       console.log("📤 WS Sent:", message);
//     },
//     []
//   );

//   return {
//     sendMessage,
//     connected,
//     connecting,
//     reconnecting,
//   };
// };
// import { useEffect, useRef, useCallback, useState } from "react";
// import { BASE_URL_WS } from "../../../config";

// type Origin = "user" | "system";
// type MessageType = "text" | "audio" | "video";
// type ActionType = "update_message" | "update_session";
// type SessionAction = "end_consultation" | "typing" | "stop_typing" | "read";

// interface MessagePayload {
//   origin: Origin;
//   type?: MessageType;
//   message?: string;
//   sender_id?: string;
//   sender_name?: string;
//   action?: SessionAction;
//   message_id?: string;
// }

// interface SocketMessage {
//   action_type: ActionType;
//   payload: MessagePayload;
// }

// interface Props {
//   consultationId: string;
//   token: string;
//   onMessage: (data: SocketMessage) => void;
// }

// export const useConsultationSocket = ({
//   consultationId,
//   token,
//   onMessage,
// }: Props) => {
//   const socketRef = useRef<WebSocket | null>(null);
//   const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
//   const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
//   const reconnectAttempts = useRef(0);
//   const manualCloseRef = useRef(false);

//   const [connected, setConnected] = useState(false);
//   const [connecting, setConnecting] = useState(false);
//   const [reconnecting, setReconnecting] = useState(false);

//   const connect = useCallback(() => {
//     if (!consultationId || !token) return;

//     // 🚫 Prevent duplicate connections
//     if (
//       socketRef.current &&
//       [WebSocket.OPEN, WebSocket.CONNECTING].includes(
//         socketRef.current.readyState
//       )
//     ) {
//       console.log("⚠️ WS already connected/connecting — skip");
//       return;
//     }

//     manualCloseRef.current = false;
//     setConnecting(true);

//     // const wsUrl = `wss://api.labtraca.com/ws/consultation/${consultationId}/`;
//     const wsUrl = `wss://api.labtraca.com/ws/consultation/${consultationId}/?token=${encodeURIComponent(token)}`;
//     // const wsUrl = `wss://api.labtraca.com/ws/consultation/${consultationId}/?Authorization=Bearer%20${encodeURIComponent(token)}`;
//   //   const wsUrl =
//   // `wss://api.labtraca.com/ws/consultation/${consultationId}/` +
//   // `?token=${encodeURIComponent(token)}`;

// const ws = new WebSocket(wsUrl);
//     console.log("🌐 WS connecting →", wsUrl);

//     // const ws = new WebSocket(wsUrl);
//     socketRef.current = ws;

//     ws.onopen = () => {
//       console.log("✅ WS Connected");

//       setConnected(true);
//       setConnecting(false);
//       setReconnecting(false);
//       reconnectAttempts.current = 0;

//       // 🔐 Authenticate AFTER connection (RN-safe)
//   //     ws.send(
//   //   JSON.stringify({
//   //   action_type: "authenticate",
//   //   token: token  // or try "payload": { token }
//   // })
//         // JSON.stringify({
//         //   action_type: "authenticate",
//         //   // token,
//         //   // Authorization: `Bearer ${token}`
//         //   "payload": { Authorization: `Bearer ${token}` }
//         // })
//       // );

//       // 💓 OPTIONAL heartbeat — remove if backend doesn't expect it
//       heartbeatRef.current = setInterval(() => {
//         if (ws.readyState === WebSocket.OPEN) {
//           ws.send(
//             JSON.stringify({
//               action_type: "update_session",
//               payload: { action: "ping" },
//             })
//           );
//         }
//       }, 20000);
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data: SocketMessage = JSON.parse(event.data);
//         onMessage(data);
//       } catch {
//         console.warn("⚠ Invalid WS message:", event.data);
//       }
//     };

//     ws.onerror = (err) => {
//       console.error("❌ WS Error:", err);
//     };

//     ws.onclose = (event) => {
//       console.warn("🔌 WS Closed", event.code, event.reason);

//       setConnected(false);
//       setConnecting(false);

//       if (heartbeatRef.current) {
//         clearInterval(heartbeatRef.current);
//         heartbeatRef.current = null;
//       }

//       // 🛑 Do not reconnect if closed intentionally
//       if (manualCloseRef.current) {
//         console.log("🛑 Manual close — no reconnect");
//         return;
//       }

//       setReconnecting(true);

//       const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 10000);
//       reconnectAttempts.current += 1;

//       console.log(`🔄 Reconnecting in ${delay}ms`);

//       reconnectTimerRef.current = setTimeout(connect, delay);
//     };
//   }, [consultationId, token, onMessage]);

//   useEffect(() => {
//     connect();

//     return () => {
//       manualCloseRef.current = true;

//       if (heartbeatRef.current) clearInterval(heartbeatRef.current);
//       if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);

//       socketRef.current?.close();
//       socketRef.current = null;
//     };
//   }, [connect]);

//   const sendMessage = useCallback(
//     (payload: MessagePayload, actionType: ActionType) => {
//       if (socketRef.current?.readyState !== WebSocket.OPEN) {
//         console.warn("⚠ WS not connected");
//         return;
//       }

//       socketRef.current.send(
//         JSON.stringify({
//           action_type: actionType,
//           payload,
//         })
//       );
//     },
//     []
//   );

//   return {
//     sendMessage,
//     connected,
//     connecting,
//     reconnecting,
//   };
// };






/////////////////////////////////////////////
// import { useEffect, useRef, useCallback } from "react";
// import { BASE_URL_WS } from "../../../config";

// type Origin = "user" | "system";
// type MessageType = "text" | "audio" | "video";
// type ActionType = "update_message" | "update_session";
// type SessionAction = "end_consultation" | "typing" | "stop_typing" | "read";

// interface MessagePayload {
//   origin: Origin;
//   type?: MessageType;
//   message?: string;
//   sender_id?: string;
//   sender_name?: string;
//   action?: SessionAction;
//   message_id?: string;
// }

// interface SocketMessage {
//   action_type: ActionType;
//   payload: MessagePayload;
// }

// interface Props {
//   consultationId: string;
//   token: string;
//   onMessage: (data: SocketMessage) => void;
// }

// export const useConsultationSocket = ({
//   consultationId,
//   token,
//   onMessage,
// }: Props) => {
//   const socketRef = useRef<WebSocket | null>(null);
//   const heartbeatRef = useRef<number | null>(null);
//   const reconnectRef = useRef<number | null>(null);
//   const reconnectAttempts = useRef(0);

//   const connect = useCallback(() => {
//     if (!consultationId || !token) return;
// console.warn('CONSUL ID::: ', consultationId, ' TOKEN ::::: ', token);
//     const wsUrl = `${BASE_URL_WS}${consultationId}/?token=${encodeURIComponent(
//       token
//     )}`;
//     console.warn('WS URL::: ', wsUrl, );
//     const ws = new WebSocket(wsUrl);
//     socketRef.current = ws;

//     ws.onopen = () => {
//       reconnectAttempts.current = 0;

//       heartbeatRef.current = setInterval(() => {
//         if (ws.readyState === WebSocket.OPEN) {
//           ws.send(JSON.stringify({ type: "ping" }));
//         }
//       }, 20000) as unknown as number;
//     };

//     ws.onmessage = (event) => {
//       try {
//         onMessage(JSON.parse(event.data));
//       } catch {
//         console.warn("Invalid WS message:", event.data);
//       }
//     };

//     ws.onclose = () => {
//       if (heartbeatRef.current) clearInterval(heartbeatRef.current);

//       const timeout = Math.min(1000 * 2 ** reconnectAttempts.current, 10000);
//       reconnectAttempts.current += 1;

//       reconnectRef.current = setTimeout(connect, timeout) as unknown as number;
//     };
//   }, [consultationId, token, onMessage]);

//   useEffect(() => {
//     connect();
//     return () => {
//       if (heartbeatRef.current) clearInterval(heartbeatRef.current);
//       if (reconnectRef.current) clearTimeout(reconnectRef.current);
//       socketRef.current?.close();
//     };
//   }, [connect]);

//   const sendMessage = useCallback(
//     (payload: MessagePayload, actionType: ActionType) => {
//       if (socketRef.current?.readyState !== WebSocket.OPEN) return;

//       socketRef.current.send(
//         JSON.stringify({
//           action_type: actionType,
//           payload,
//         })
//       );
//     },
//     []
//   );

//   return { sendMessage };
// };





// import { useEffect, useRef, useCallback } from "react";
// import { BASE_URL_WS } from "../../../config";

// type Origin = "user" | "system";
// type MessageType = "text" | "audio" | "video";
// type ActionType = "update_message" | "update_session";
// type SessionAction = "end_consultation" | "typing" | "stop_typing" | "read";

// interface MessagePayload {
//   origin: Origin;
//   type?: MessageType;
//   message?: string;
//   sender_id?: string;
//   sender_name?: string;
//   action?: SessionAction;
//   message_id?: string;
// }

// interface SocketMessage {
//   action_type: ActionType;
//   payload: MessagePayload;
// }

// export const useConsultationSocket = (
//   consultationId: string,
//   onMessage: (data: SocketMessage) => void
// ) => {
//   const socketRef = useRef<WebSocket | null>(null);
//   const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
//   const reconnectRef = useRef<NodeJS.Timeout | null>(null);
//   const reconnectAttempts = useRef(0);

//   const connect = useCallback(() => {
//     if (!consultationId) return;

//     const ws = new WebSocket(
//         `${BASE_URL_WS}${consultationId}/`
//     );

//     socketRef.current = ws;

//     ws.onopen = () => {
//       reconnectAttempts.current = 0;

//       heartbeatRef.current = setInterval(() => {
//         if (ws.readyState === WebSocket.OPEN) {
//           ws.send(JSON.stringify({ type: "ping" }));
//         }
//       }, 20000);
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         onMessage(data);
//       } catch {}
//     };

//     ws.onclose = () => {
//       clearInterval(heartbeatRef.current!);

//       const timeout = Math.min(1000 * 2 ** reconnectAttempts.current, 10000);
//       reconnectAttempts.current += 1;

//       reconnectRef.current = setTimeout(connect, timeout);
//     };
//   }, [consultationId, onMessage]);

//   useEffect(() => {
//     connect();
//     return () => {
//       clearInterval(heartbeatRef.current!);
//       clearTimeout(reconnectRef.current!);
//       socketRef.current?.close();
//     };
//   }, [connect]);

//   const sendMessage = useCallback(
//     (payload: MessagePayload, actionType: ActionType) => {
//       if (socketRef.current?.readyState !== WebSocket.OPEN) return;

//       socketRef.current.send(
//         JSON.stringify({
//           action_type: actionType,
//           payload,
//         })
//       );
//     },
//     []
//   );

//   return { sendMessage };
// };

