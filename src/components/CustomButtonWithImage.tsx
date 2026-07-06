import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import styles from './utils/styles'; // Import your centralized styles
const CustomButtonWithImage = ({ backgroundColor, handlePress, children, shape, imageSrc, imageSrc_, textStyle }) => {
  const dynamicStyles = {
    button: {
      backgroundColor: backgroundColor || 'white',
      borderRadius: shape === 'rounded' ? 50 : 5, // Change shape based on prop
      padding: 10,
      alignItems: 'center',
      flexDirection: imageSrc ? 'row' : 'column', // Layout adjustment if image is present
    },
    image: {
      width: 15,
      height: 15,
      marginRight: 10, // Adds some space between the image and text
      paddingTop:10,
      paddingBottom:10,
      // justifyContent:'center',
      // alignItems: 'center',

    },
  };

  return (
    <TouchableOpacity style={[styles.labtracaBackBorderTextButton, dynamicStyles.button, textStyle === 'add'?styles.buttonWithLabtracaColor:styles.labelEmpty]} onPress={handlePress}>
      
      <Text style={[styles.centerText, textStyle === 'add'?styles.labelButtonText:styles.labelEmpty]}>{children} </Text>
      {imageSrc && <Image source={imageSrc} style={dynamicStyles.image} />}
      {/* {imageSrc_ && <Image source={imageSrc_} style={dynamicStyles.image} />} */}
    </TouchableOpacity>
  );
};


export default CustomButtonWithImage;
