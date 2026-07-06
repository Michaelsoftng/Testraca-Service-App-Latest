import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'

export default function Notification() {
  return (
    <View style={styles.notificationBox}>
    <Image
      source={require('../../../assets/images/png/notification.png')}
      style={{width: 20, height: 20}}
    />

    <Text>
      Items are supplied ones every month. except emergency shortage
    </Text>
  </View>
  )
}
const styles = StyleSheet.create({
notificationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#D3E5FE',
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderColor: '#1B4ACB',
    borderWidth: 1,
    borderRadius: 3,
  },
});