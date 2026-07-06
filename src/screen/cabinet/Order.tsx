import { View, Text } from 'react-native'
import React from 'react'
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer'
import styles from '../../components/utils/styles'
import OrderTab from '../order/OrderTab'

const Order = ({ navigation }: { navigation: any }) => {
  return (
    <KeyboardAvoidingContainer style={styles.containerBackGround}>
      <Text style={styles.titleText}>Orders</Text>
      <View style={styles.sizeSpaceBottom}></View>
        <OrderTab/>
    </KeyboardAvoidingContainer>
  )
}

export default Order