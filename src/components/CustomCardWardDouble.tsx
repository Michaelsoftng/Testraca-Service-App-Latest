// CustomCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Use if you have icons like Ionicons
// You can also import other icons like from 'react-native-vector-icons' if not using Expo.

const CustomCardWardDouble = ({ assignment, leftIcon, centerText_, centerText, rightIcon, onPress, tittle, colorBack, timeContent }) => {
  return (
    <TouchableOpacity style={[styles.cardContainer, {backgroundColor:colorBack}]} onPress={onPress}>
      {/* Left Icon or Image */}
     

      {/* Center Text */}
      <View style={styles.textContainer}>
        {/* <Text style={[styles.titleText, {fontSize:13, fontWeight:'800', color:'#0F1D40'}]}>{tittle}</Text> */}
        <View style={styles.row}>
        {assignment ? (<View style={styles.column}>
                <Text style={styles.timeText}>
                    {/* {assignment} */}
                    Assignment
                </Text>
            </View>):null}
            {timeContent ? (<View style={styles.column}>
                <Text style={styles.timeText}>
                    {timeContent}
                </Text>
            </View>):null}
        </View>




        <View style={styles.row}>
        {assignment ? (<View style={styles.column}>
                <Text style={styles.centerText}>
                    {assignment}
                </Text>
            </View>):null}
            {centerText ? (<View style={styles.column}>
                <Text style={styles.centerText}>
                    {centerText}
                </Text>
            </View>):null}
        </View>

        {/* <Text style={[styles.centerText, {color:'#0F1D40'}]}>{centerText || "Subscribe to your preferred Insurance package"}</Text> */}
      </View>

      {/* Right Icon or Image */}
      <View style={styles.arrowContainer}>
        {rightIcon 
          ? <Image source={rightIcon} style={styles.iconImage} />
          : ''}
          {/* <Ionicons name="chevron-forward-outline" size={24} color="#000" /> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',          // Aligns items in a row
    alignItems: 'center',          // Vertically center-align items
    justifyContent: 'space-between', // Space between elements
    backgroundColor: '#FFF',       // White background for the card
    padding: 15,                   // Padding inside the card
    borderRadius: 10,              // Rounded corners
    elevation: 3,                  // Elevation for shadow (Android)
    shadowColor: '#000',
    borderColor:'#E2E4E8',           // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.2,            // iOS shadow opacity
    shadowRadius: 3,               // iOS shadow blur radius
    marginVertical: 10,            // Space between cards
  },
  iconContainer: {
    width: 20,                     // Set fixed width for the left icon
    justifyContent: 'center',      // Vertically center-align icon
    paddingRight:50,
  },
  iconImage: {
    width: 24,                     // Image width
    height: 24,                    // Image height
    resizeMode: 'contain',         // Ensure icon fits in bounds
  },
  textContainer: {
    flex: 1,                       // Take up remaining space in the center
    paddingHorizontal: 10,         // Horizontal padding around the text
  },
  centerText: {
    fontSize: 12,                  // Font size for the center text
    fontWeight: '700',             // Medium weight
    color: '#333',                 // Text color
    textAlign: 'left',           // Center-align text
  },
  arrowContainer: {
    width: 30,                     // Fixed width for right arrow
    justifyContent: 'center',      // Vertically center-align icon
  },row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    textAlign:'left',

    padding:4,
  },
  column: {
    
    // flex: 1,
    // marginHorizontal: 5,
  },
  titleText:{

  },
  timeText:{
    color:'#8C93A3',
    fontSize:12,
    fontWeight:'600',
    lineHeight:19.2,
  }
});

export default CustomCardWardDouble;
