import { View, Text } from 'react-native'
import React from 'react'
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomePage from './HomePage';

const MapPage = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HomePage />
    </GestureHandlerRootView>
  )
}

export default MapPage