import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin, Clock, Syringe, TestTube, Layers, ClipboardList } from 'lucide-react-native';

export interface WorkloadItem {
  id: string;
  name: string;
  type: string;
  status: 'STAT' | 'Routine' | 'Pending';
  distance: string;
  address: string;
  timeWindow?: string;
  iconType: 'blood' | 'lipid' | 'cbc' | 'immuno' | 'drug';
}

interface RequestCardProps {
  item: WorkloadItem;
  actionLabel: string;
  onAction: (id: string) => void;
  onCancel?: (id: string) => void;
  showCancel?: boolean;
}

export default function RequestCard({ item, actionLabel, onAction, onCancel, showCancel = false }: RequestCardProps) {
  const getStatusStyles = () => {
    switch (item.status) {
      case 'STAT': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' };
      case 'Routine': return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' };
      default: return { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' };
    }
  };

  const getIcon = () => {
    switch (item.iconType) {
      case 'blood': return <Syringe size={18} color="#006666" />;
      case 'lipid': return <TestTube size={18} color="#475569" />;
      case 'cbc': return <Layers size={18} color="#475569" />;
      default: return <ClipboardList size={18} color="#475569" />;
    }
  };

  const statusStyle = getStatusStyles();

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xs font-mono text-slate-400 uppercase tracking-wider">{item.id}</Text>
        <View className={`px-2 py-0.5 rounded-md ${statusStyle.bg} border ${statusStyle.border}`}>
          <Text className={`text-[10px] font-bold tracking-tight ${statusStyle.text}`}>
            {item.status === 'STAT' ? '! STAT' : item.status}
          </Text>
        </View>
      </View>

      <Text className="text-xl font-semibold text-slate-900 mb-1">{item.name}</Text>

      <View className="flex-row items-center mb-3">
        {getIcon()}
        <Text className="text-sm font-medium text-teal-800 ml-1.5">{item.type}</Text>
      </View>

      <View className="space-y-1.5 border-b border-dashed border-slate-100 pb-3 mb-3">
        <View className="flex-row items-center">
          <MapPin size={14} color="#64748B" />
          <Text className="text-xs text-slate-500 ml-1.5" numberOfLines={1}>
            {item.distance} away • {item.address}
          </Text>
        </View>
        {item.timeWindow && (
          <View className="flex-row items-center">
            <Clock size={14} color="#64748B" />
            <Text className="text-xs text-slate-500 ml-1.5">
              {item.timeWindow}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row space-x-2">
        <TouchableOpacity
          onPress={() => onAction(item.id)}
          className="flex-1 bg-teal-800 py-3 rounded-xl flex-row justify-center items-center"
        >
          {actionLabel === 'Collect Sample' && <Syringe size={16} color="#fff" className="mr-2" />}
          <Text className="text-white font-semibold text-center text-sm">{actionLabel}</Text>
        </TouchableOpacity>

        {showCancel && (
          <TouchableOpacity
            onPress={() => onCancel && onCancel(item.id)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl justify-center"
          >
            <Text className="text-slate-600 font-medium text-sm">Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
