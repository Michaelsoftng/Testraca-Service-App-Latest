import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const CustomCheckbox = ({ isChecked, onValueChange }) => {
  return (
    <CheckBox
      value={isChecked}
      onValueChange={onValueChange}
      tintColors={{ true: 'green', false: 'gray' }} // Customize colors
    />
  );
};

export default CustomCheckbox;
