import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CustomAccountMenuCard = ({ leftIcon, rightIcon, onPress, title, centerText }) => {
  return (
    <TouchableOpacity  onPress={onPress}>
    <View style={styles.row}>
      {/* Left Icon */}
      <View style={styles.leftIconContainer}>
        {leftIcon}
      </View>

      {/* Text in the Middle */}
      {/* <View style={styles.textContainer}> */}
      <Text style={styles.text}>{title}</Text>
      {/* <Text style={[styles.centerText, {color:'#8C93A3'}]}>{centerText || ""}</Text> */}
{/* </View> */}
      {/* Right Icon */}
      <View style={styles.rightIconContainer}>
        {rightIcon}
      </View>
    </View>
    </TouchableOpacity>
  );
};

// Help and Support
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures icons are pushed to both edges
    paddingHorizontal: 0,
    paddingVertical: 5,
    // backgroundColor: '#f9f9f9', // Optional: Add background color if needed
  },
  textContainer: {
    flex: 1,                       // Take up remaining space in the center
    paddingHorizontal: 0,         // Horizontal padding around the text
  },
  leftIconContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 50, // Fixed width for icon container to align consistently
    padding: 5,
    paddingLeft:0,
  },
  rightIconContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: 50, // Fixed width for icon container to align consistently
    padding: 5,
    paddingRight:0,
  },
  text: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'left',
    color: '#2D3047',
    lineHeight: 22.4,
    alignContent: 'flex-start',
    justifyContent:'flex-start',
    flex: 1, // Takes the space between the two icons
    paddingLeft:15,
  },
  centerText: {
    fontSize: 14,                  // Font size for the center text
    fontWeight: '700',             // Medium weight
    color: '#333',                 // Text color
    textAlign: 'left',           // Center-align text
  },
});

export default CustomAccountMenuCard;
