import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';

const CustomLabtracaDropdown = ({
  title,
  data,
  onValueChange,
  value,
  placeholder = 'Select an option',
  setChange = false,
  errorMessage,
  leftIcon,
  backStyle,
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(data);

  const getBorderColor = () => {
    if (errorMessage) return styles.borderRed;
    return open
      ? styles.borderGreen
      : value
      ? styles.borderGray
      : styles.borderGreen;
  };

  return (
    <View
      style={[
        { zIndex: open ? 10000 : 1 },
        // styles.container,
        backStyle,
      ]}
    >
      {title && (
        <Text style={styles.title}>{title}</Text>
      )}

      <View style={[styles.inputContainer, 
        // getBorderColor()
        ]}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={12}
            color="#0F1D40"
            style={styles.leftIcon}
          />
        )}

        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={(callback) => {
            const val = typeof callback === 'function' ? callback(value) : callback;
            onValueChange(val);
          }}
          setItems={setItems}
          placeholder={placeholder}
          style={styles.dropdown}
          dropDownContainerStyle={{
            borderColor: '#ccc',
            zIndex: 99999,
            elevation: 99999,
          }}
          labelStyle={styles.label}
          arrowIconStyle={{}}
          tickIconStyle={{}}
        />
      </View>

      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

export default CustomLabtracaDropdown;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  leftIcon: {
    marginRight: 8,
  },
  dropdown: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F1D40',
  },
  errorText: {
    color: '#f87171',
    fontSize: 13,
    marginTop: 4,
  },
  borderRed: {
    borderColor: '#f87171',
  },
  borderGreen: {
    borderColor: '#059669',
  },
  borderGray: {
    borderColor: '#d1d5db',
  },
});
