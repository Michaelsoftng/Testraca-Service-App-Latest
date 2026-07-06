import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import styles from './utils/styles'; // Import your centralized styles
const CustomCard = ({ title, description, imageSrc }) => {
  
  
  
  return (

    
    <View style={styles.cardCustom}>
      {imageSrc && <Image source={imageSrc} style={styles.imageCustom} />}
      <View style={styles.textContainerCustom}>
        <Text style={styles.titleCustom}>{title}</Text>
        <Text style={styles.descriptionCustom}>{description}</Text>
      </View>
    </View>
  );
};

export default CustomCard;
