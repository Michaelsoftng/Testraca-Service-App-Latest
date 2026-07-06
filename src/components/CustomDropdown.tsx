import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from './utils/styles';
const CustomDropdown = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange' },
  ]);

  return (
    <View style={styles.containerDropdown}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Select a fruit"
        style={styles.dropdownDropdown}
        dropDownContainerStyle={styles.dropdownContainerDropdown}
        labelStyle={styles.labelDropdown}
        arrowIconStyle={styles.arrowIconDropdown}
        tickIconStyle={styles.tickIconDropdown}
      />
    </View>
  );
};


export default CustomDropdown;
