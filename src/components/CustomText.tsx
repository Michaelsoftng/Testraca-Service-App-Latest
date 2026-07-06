import React from 'react';
import { Text, StyleSheet } from 'react-native';
import styles from './utils/styles'; // Import your centralized styles
const CustomText = ({ content, color, fontSize, fontWeight }) => {
  return (
    <Text style={[styles.text, { color, fontSize, fontWeight }]}>
      {content}
    </Text>
  );
};

export default CustomText;
