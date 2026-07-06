import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer'
import styles from '../../components/utils/styles'
import CustomCardPackage from '../../components/CustomCardPackage'
import { useNavigation } from '@react-navigation/native'
import HeartTick from './../../assets/images/svg-icon/heart-tick.svg';
import CallCalling from './../../assets/images/svg-icon/call-calling.svg';
import Health from './../../assets/images/svg-icon/health.svg';
import HOT_Card from './../../assets/images/svg-icon/HOT Card.svg';
import ConsultADoctor from '../doctor/ConsultADoctor'
import BookAppointment from '../ward/BookAppointment'
import { GestureHandlerRootView } from 'react-native-gesture-handler'


const Doctor = () => {
  const navigation = useNavigation();  
  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
        <ConsultADoctor />
        {/* <BookAppointment /> */}
    </GestureHandlerRootView>
    
        
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    

    
    
    

    
    
    
    
    
    
    
    
          
    
    
    

    
    
    
    
    
    
    
    
    
    



    
    




    
  )
}

export default Doctor;