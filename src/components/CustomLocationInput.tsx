import React from 'react';
import { TextInput, View, StyleSheet, Text } from 'react-native';
import Ionicons  from '@expo/vector-icons/Ionicons'; // For search icon, or use other icon libraries
import styles from './utils/styles'; // Import your centralized styles
const CustomLocationInput = ({editable, useImage, leftIcon, rightIcon, placeholder, onChangeText, value }) => {
  return (
    <View style={styles.searchContainerSearch}>
      {useImage === "" ?
      <Ionicons name={leftIcon} size={20} color="#B2B7C2" style={styles.iconSearch} />
      : <Text>{leftIcon}</Text>}
      <TextInput
        editable={editable} 
        style={styles.inputSearch}
        placeholder={placeholder || 'Search...'} 
        onChangeText={onChangeText}
        value={value}
        clearButtonMode="while-editing" // iOS only feature
        placeholderTextColor="#B2B7C2"
      />
      <Text>{rightIcon}</Text>
      {/* <Ionicons name={rightIcon} size={20} color="#B2B7C2" style={styles.iconSearch} /> */}
    </View>
  );
};

export default CustomLocationInput;
