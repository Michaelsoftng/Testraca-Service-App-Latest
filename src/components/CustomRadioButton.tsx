import React from 'react';
import { RadioButton } from 'react-native-paper';
import { View, Text, StyleSheet } from 'react-native';
import styles from './utils/styles'; // Import your centralized styles
const CustomRadioButton = ({ value, status, onPress }) => {
  return (
    <View style={styles.containerRadioButton}>
      <RadioButton
        value={value}
        status={status === value ? 'checked' : 'unchecked'}
        onPress={onPress}
        color="#059669" // Customize checked color
      />
      <Text style={styles.labelRadioButton}>{value}</Text>
    </View>
  );
};


export default CustomRadioButton;
