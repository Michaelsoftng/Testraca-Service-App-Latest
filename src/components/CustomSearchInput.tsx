import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For search icon, or use other icon libraries
import styles from './utils/styles'; // Import your centralized styles
const CustomSearchInput = ({ placeholder, onChangeText, value }) => {
  return (
    <View style={styles.searchContainerSearch}>
      
      <TextInput
        style={styles.inputSearch}
        placeholder={placeholder || 'Search...'}
        onChangeText={onChangeText}
        value={value}
        clearButtonMode="while-editing" // iOS only feature
        placeholderTextColor="#B2B7C2"
      />
      <Ionicons name="search" size={20} color="#B2B7C2" style={styles.iconSearch} />
    </View>
  );
};

export default CustomSearchInput;
