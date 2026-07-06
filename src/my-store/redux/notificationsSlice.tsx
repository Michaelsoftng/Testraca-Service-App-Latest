import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationItem {
  id: string;
  title?: string;
  body?: string;
  read?: boolean;
  createdAt?: string;
  meta?: Record<string, any> | null;
}

interface NotificationsState {
  items: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotificationsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = !!action.payload;
    },

    setNotificationsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload || null;
      state.loading = false;
    },

    // Replace the full list (initial load / refresh)
    setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
      const list = action.payload || [];
      state.items = list;
      state.unreadCount = list.filter((n) => !n.read).length;
      state.loading = false;
      state.error = null;
    },

    // Push a real-time notification received over the WebSocket
    prependNotification: (state, action: PayloadAction<NotificationItem>) => {
      const notification = action.payload;
      if (!notification) return;
      state.items = [notification, ...state.items];
      if (!notification.read) {
        state.unreadCount += 1;
      }
    },

    markOneReadLocal: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const item = state.items.find((n) => n.id === id);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllReadLocal: (state) => {
      state.items = state.items.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
    },

    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = Math.max(0, Number(action.payload) || 0);
    },

    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setNotificationsLoading,
  setNotificationsError,
  setNotifications,
  prependNotification,
  markOneReadLocal,
  markAllReadLocal,
  setUnreadCount,
  clearNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
