import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import useAuth from '../../schema/UseAuth';

const ConsultForm = () => {
    const navigation = useNavigation();

    const {
        selectedSpecialty
      } = route.params || {};

    const { token, patientId } = useAuth(navigation);


    // selectedSpecialty
  return (
    <View>
      <Text>ConsultForm</Text>
    </View>
  )
}

export default ConsultForm

const styles = StyleSheet.create({})