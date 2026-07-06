import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Shield, LayoutGrid, BarChart3, User2, Truck } from 'lucide-react-native';

interface BottomTabsProps {
  activeTab: 'Ward' | 'Activities' | 'Earnings' | 'Account' | 'Drop-off';
}

export default function BottomTabs({ activeTab }: BottomTabsProps) {
  const navigation = useNavigation<any>();

  const tabs = activeTab === 'Drop-off'
    ? [
        { name: 'Ward', icon: Shield, target: 'Ward' },
        { name: 'Activities', icon: LayoutGrid, target: 'Activities' },
        { name: 'Drop-off', icon: Truck, target: null as string | null },
        { name: 'Account', icon: User2, target: 'Account' },
      ]
    : [
        { name: 'Ward', icon: Shield, target: 'Ward' },
        { name: 'Activities', icon: LayoutGrid, target: 'Activities' },
        { name: 'Earnings', icon: BarChart3, target: 'earning' },
        { name: 'Account', icon: User2, target: 'Account' },
      ];

  return (
    <View className="flex-row bg-white border-t border-gray-200 py-3 px-4 justify-between items-center pb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            disabled={!tab.target}
            onPress={() => tab.target && navigation.navigate('cabinet_page', { screen: tab.target })}
            className={`items-center justify-center flex-1 py-1 rounded-xl ${isActive ? 'bg-teal-50' : ''}`}
          >
            <Icon size={22} color={isActive ? '#006666' : '#64748B'} />
            <Text className={`text-xs mt-1 font-medium ${isActive ? 'text-teal-900 font-bold' : 'text-slate-500'}`}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
