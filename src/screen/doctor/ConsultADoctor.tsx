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
import SpecialtPage from './SpecialtPage'


const ConsultADoctor = () => {
  const navigation = useNavigation();  // Get navigation object from the hook
  return (

     <KeyboardAvoidingContainer style={styles.containerBackGround}>
        
        <View style={styles.containerBackGround}>
      <Text style={[styles.titleText, {fontSize:20}]}>Consult a doctor</Text>
    </View>
    <View style={styles.sizeSpaceBottom}></View>

    <View style={{backgroundColor:''}}>
    <View style={[styles.containerBackGround,{backgroundColor:''}]}>
        <HOT_Card width={Dimensions.get('window').width  - 2 * 20} height={200}/>
        <SpecialtPage />
    </View>
           </View>
    




    </KeyboardAvoidingContainer>
  )
}

export default ConsultADoctor;