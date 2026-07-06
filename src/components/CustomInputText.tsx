import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

import styles from './utils/styles'; // Import your centralized styles

const CustomInputText = ({ placeholder, value, onChangeText, backgroundColor }) => {
  return (
    <View style={[styles.containerInputText, { backgroundColor }]}>
      <TextInput
        style={styles.inputText}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="gray" // Customize placeholder color
      />
    </View>
  );
};


export default CustomInputText;
