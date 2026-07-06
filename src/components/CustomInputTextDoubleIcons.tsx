import React, { useState } from 'react';
import { TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Or use react-native-vector-icons
import styles from './utils/styles';
const CustomInputTextDoubleIcons = ({
  placeholder,
  isPassword,
  onChangeText,
  value,
  leftIcon,      // Left icon for input
  rightIcon,     // Optional right icon for normal input
  passwordVisibleIcon,  // Icon when the password is visible
  passwordHiddenIcon,   // Icon when the password is hidden
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.inputContainerDoubleIcons}>
      {/* Dynamic Left Icon */}
      {leftIcon && (
        <Ionicons
          name={leftIcon}
          size={20}
          color="#666"
          style={styles.iconDoubleIcons}
        />
      )}

      {/* Text Input */}
      <TextInput
        style={styles.inputDoubleIcons}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={isPassword && !isPasswordVisible} // Toggle password visibility
        placeholderTextColor="#999"
      />

      {/* Right Icon (For passwords, hide/show toggle) */}
      {isPassword ? (
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.toggleIconDoubleIcons}>
          <Ionicons
            name={isPasswordVisible ? passwordVisibleIcon : passwordHiddenIcon}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      ) : (
        rightIcon && (
          <Ionicons
            name={rightIcon}
            size={20}
            color="#666"
            style={styles.iconDoubleIcons}
          />
        )
      )}
    </View>
  );
};

export default CustomInputTextDoubleIcons;
