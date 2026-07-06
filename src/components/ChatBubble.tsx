import { View, Text, ActivityIndicator } from 'react-native';

export function ChatBubble({
  text,
  me,
  status,
  time,
}: {
  text: string;
  me?: boolean;
  status?: 'sending' | 'sent' | 'read';
  time?: string;
}) {
  return (
    <View className={`mb-4 max-w-[85%] ${me ? "items-end ml-auto" : "items-start"}`}>
      <View
        className={
          me
            ? "bg-[#008b8b] p-4 rounded-2xl rounded-tr-none shadow-sm"
            : "bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100"
        }
      >
        <Text className={`text-[15px] leading-relaxed ${me ? "text-white" : "text-gray-800"}`}>{text}</Text>
      </View>
      <View className="flex-row items-center mt-1">
        {status === 'sending' && <ActivityIndicator size="small" color="#94A3B8" style={{ marginRight: 6 }} />}
        <Text className={`text-gray-400 text-[11px] font-medium ${me ? "text-right" : ""}`}>
          {time ?? 'Just now'}
          {me && status === 'read' ? ' • SEEN' : ''}
        </Text>
      </View>
    </View>
  );
}
