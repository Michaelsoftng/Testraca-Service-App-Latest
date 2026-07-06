import React from 'react';
import { View, StyleSheet } from 'react-native';
import styles from './utils/styles'; // Import your centralized styles
const CustomContainer = ({ children, padding, backgroundColor }) => {
  return (
    <View style={[styles.containerCustomize, { padding: padding || 20, backgroundColor }]}>
      {children}
    </View>
  );
};

export default CustomContainer;
