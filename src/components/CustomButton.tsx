import React from 'react';

import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import styles from './utils/styles'; // Import your centralized styles
const CustomButton = ({ backgroundColor, handlePress, children, enable_disable }) => {
  return (
    <TouchableOpacity
      style={backgroundColor}
      onPress={handlePress}
      disabled={enable_disable}
    >
      <Text style={enable_disable === true?styles.loginTextEnable:styles.loginTextDisable}>{children}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
