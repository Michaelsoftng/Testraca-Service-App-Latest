import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../../schema/UseAuth';
import { useNotifications } from '../../hook/useNotifications';

interface NotificationItem {
  id: string;
  title?: string;
  body?: string;
  read?: boolean;
  createdAt?: string;
  meta?: {
    request_id?: string;
    consultation_id?: string;
    result_review_id?: string;
  } | null;
}

function formatRelativeTime(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function NotificationIcon({ meta }: { meta?: NotificationItem['meta'] }) {
  if (meta?.consultation_id) {
    return <MaterialCommunityIcons name="chat-processing-outline" size={18} color="#007A78" />;
  }
  if (meta?.result_review_id) {
    return <FontAwesome5 name="file-medical-alt" size={16} color="#007A78" />;
  }
  return <MaterialCommunityIcons name="truck-delivery-outline" size={18} color="#007A78" />;
}

const EmptyState = ({ message }: { message: string }) => (
  <View className="bg-white p-6 rounded-2xl border border-gray-100 items-center mt-6 mx-4">
    <View className="bg-gray-100 p-3 rounded-xl mb-3">
      <Ionicons name="notifications-off-outline" size={22} color="#9CA3AF" />
    </View>
    <Text className="text-gray-400 font-bold text-sm">{message}</Text>
  </View>
);

export default function NotificationInboxScreen() {
  const navigation = useNavigation<any>();
  const { token } = useAuth(navigation);
  const {
    notifications,
    unreadCount,
    loading,
    refreshing,
    refresh,
    handleRefresh,
    markOneRead,
    markAllRead,
  } = useNotifications(token);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleItemPress = (item: NotificationItem) => {
    setExpandedId(expandedId === item.id ? null : item.id);
    if (!item.read) {
      markOneRead(item.id);
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#F8FAFC]">
      <StatusBar style="light" backgroundColor="#101828" />

      <View className="bg-[#101828] px-4 pt-3 pb-4 flex-row justify-between items-center">
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white tracking-wide">Notifications</Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text className="text-xs font-bold text-[#00D2C4]">Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && notifications.length === 0 ? (
        <View className="items-center justify-center py-16">
          <ActivityIndicator size="large" color="#007A78" />
          <Text className="text-gray-400 mt-2 text-sm">Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item: NotificationItem) => item.id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 40, paddingHorizontal: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#00A89C" />
          }
          ListEmptyComponent={<EmptyState message="You're all caught up — no notifications yet" />}
          renderItem={({ item }: { item: NotificationItem }) => {
            const expanded = expandedId === item.id;
            return (
              <TouchableOpacity
                onPress={() => handleItemPress(item)}
                className={`bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm ${
                  !item.read ? 'border-l-4 border-l-[#007A78]' : ''
                }`}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-row items-start flex-1 pr-2">
                    <View className="w-9 h-9 bg-teal-50 rounded-xl justify-center items-center mr-3">
                      <NotificationIcon meta={item.meta} />
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`text-sm ${!item.read ? 'font-bold text-gray-900' : 'font-semibold text-gray-600'}`}
                      >
                        {item.title || 'Notification'}
                      </Text>
                      <Text
                        className="text-xs text-gray-500 mt-1"
                        numberOfLines={expanded ? undefined : 2}
                      >
                        {item.body}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    {!item.read && <View className="w-2 h-2 bg-red-500 rounded-full mb-1" />}
                    <Text className="text-[10px] text-gray-400 font-mono">
                      {formatRelativeTime(item.createdAt)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
