import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer'
import styles from '../../components/utils/styles'
import CustomCardPackage from '../../components/CustomCardPackage'
import { useNavigation } from '@react-navigation/native'
import HeartTick from './../../assets/images/svg-icon/heart-tick.svg';
import CallCalling from './../../assets/images/svg-icon/call-calling.svg';
import Health from './../../assets/images/svg-icon/health.svg';
const Packages = () => {
  const navigation = useNavigation();  
  return (

     <KeyboardAvoidingContainer style={styles.containerBackGround}>
        
        <View style={styles.containerBackGround}>
      <Text style={[styles.titleText, {fontSize:20}]}>Packages</Text>
    </View>
    <View style={styles.sizeSpaceBottom}></View>

    <View style={{backgroundColor:''}}>
    <View style={[styles.containerBackGround,{backgroundColor:''}]}>

      <CustomCardPackage 
        
        colorBack=
        {'#D1FAE5'}
        leftIcon={<HeartTick width={50} height={50}/>} 
        tittle="Health insurance"
        centerText="Subscribe to your preferred Insurance package"
        rightIcon={require('./../../assets/images/png/arrow-right.png')}    
        onPress={() => console.log('Card Pressed')}       
      />
    </View>
    <View style={[styles.containerBackGround,{backgroundColor:''}]}>
      <CustomCardPackage 
        colorBack={'#A7C9FD'}
        leftIcon={<CallCalling width={50} height={50}/>} 
        tittle="Consultation"
        centerText="Book sessions with pathologist to review and prescribe drugs."
        rightIcon={require('./../../assets/images/png/arrow-right.png')}    
        onPress={() => console.log('Card Pressed')}       

        
      />
    </View>

    <View style={[styles.containerBackGround,{backgroundColor:''}]}>
      <CustomCardPackage 
        colorBack={'#FFE89E'}
        leftIcon={<Health width={50} height={50}/>} 
        tittle="Prescription"
        centerText="View and manage all your prescriptions here."
        rightIcon={require('./../../assets/images/png/arrow-right.png')}    
        onPress={() => navigation.navigate('subscribtion_order', { Data: '', data_tittle:'Prescription'})} 
          
          
      />
    </View> 

    <View style={styles.sizeSpaceBottom}></View>
    <View>
      <Text style={{fontSize:14, fontWeight:'800'}}>Current subscription</Text>
    </View>
    <View style={styles.sizeSpaceBottom}></View>
    <View>
      <Text style={{color:'#8C93A3'}}>
        No action plan
      </Text>
    </View>



        </View>
    




    </KeyboardAvoidingContainer>
  )
}

export default Packages