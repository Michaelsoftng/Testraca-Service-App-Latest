import { useCallback, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { URL_LINK } from "../../config";
import {
  GET_MY_REQUEST_NOTIFICATIONS,
  GET_MY_UNREAD_REQUEST_NOTIFICATION_COUNT,
  MARK_REQUEST_NOTIFICATION_READ,
} from "../schema/ApiSchema";
import {
  setNotifications,
  setNotificationsError,
  setNotificationsLoading,
  setUnreadCount,
  markOneReadLocal,
  markAllReadLocal,
} from "../my-store/redux/notificationsSlice";

const authHeaders = (token: string) => ({
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
    Authorization: `Bearer ${token}`,
  },
});

export const useNotifications = (token: string | null) => {
  const dispatch = useDispatch();
  const { items, unreadCount, loading } = useSelector((state: any) => state.notifications);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      dispatch(setNotificationsLoading(true));
      const response = await axios.post(
        URL_LINK,
        { query: GET_MY_REQUEST_NOTIFICATIONS },
        authHeaders(token)
      );

      const gqlError = response?.data?.errors?.[0]?.message;
      if (gqlError) throw new Error(gqlError);

      const list = response?.data?.data?.getMyRequestNotifications || [];
      dispatch(setNotifications(list));
    } catch (error: any) {
      dispatch(setNotificationsError(error?.message || "Failed to load notifications"));
    }
  }, [token, dispatch]);

  const refreshUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        URL_LINK,
        { query: GET_MY_UNREAD_REQUEST_NOTIFICATION_COUNT },
        authHeaders(token)
      );
      const count = response?.data?.data?.getMyUnreadRequestNotificationCount;
      if (typeof count === "number") {
        dispatch(setUnreadCount(count));
      }
    } catch {
      // best-effort — badge just stays at its last known value
    }
  }, [token, dispatch]);

  const markOneRead = useCallback(
    async (notificationId: string) => {
      dispatch(markOneReadLocal(notificationId));
      if (!token) return;
      try {
        await axios.post(
          URL_LINK,
          { query: MARK_REQUEST_NOTIFICATION_READ, variables: { notificationId } },
          authHeaders(token)
        );
      } catch {
        // local state already optimistically updated; next refresh will reconcile
      }
    },
    [token, dispatch]
  );

  const markAllRead = useCallback(async () => {
    dispatch(markAllReadLocal());
    if (!token) return;
    try {
      await axios.post(URL_LINK, { query: MARK_REQUEST_NOTIFICATION_READ }, authHeaders(token));
    } catch {
      // local state already optimistically updated; next refresh will reconcile
    }
  }, [token, dispatch]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  return {
    notifications: items,
    unreadCount,
    loading,
    refreshing,
    refresh,
    handleRefresh,
    refreshUnreadCount,
    markOneRead,
    markAllRead,
  };
};
