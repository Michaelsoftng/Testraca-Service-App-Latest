import React from 'react';
import { View, Text, Linking, TouchableOpacity, StyleSheet } from 'react-native';

const HelpAndSupport = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:info@labtraca.com');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Help and Support</Text>
      <Text style={styles.text}>Need help or have questions? Contact us at:</Text>
      <TouchableOpacity onPress={handleEmailPress}>
        <Text style={styles.email}>info@labtraca.com</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default HelpAndSupport;