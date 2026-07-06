import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type ButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  name: string;
};

export default function Button({ onPress, disabled = false, className = '', textClassName = '', name }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`${className} ${disabled ? 'opacity-50' : ''}`.trim()}
      activeOpacity={0.8}
    >
      <Text className={textClassName}>{name}</Text>
    </TouchableOpacity>
  );
}
