import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../../components/utils/styles'
import formatNaira from '../../components/FormatNaira'
import { PieChart } from 'react-native-gifted-charts'
import CustomAccountMenuCard from '../../components/CustomAccountMenuCard'
import ArrowRight from './../../assets/images/svg-icon/arrow-right.svg';
import Support from './../../assets/images/svg-icon/support.svg';
import PasswordSvg from './../../assets/images/svg-icon/password.svg';
import Audit from './../../assets/images/svg-icon/record.svg';
import PaymentRec from './../../assets/images/svg-icon/cash.svg';
import LogoutSvg from './../../assets/images/svg-icon/logout.svg';
import CardSvg from './../../assets/images/svg-icon/navigate.svg';
import CustomButton from '../../components/CustomButton'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../../schema/UseAuth'
import GetUserDetails from '../../schema/GetUserDetails'
import GetInactiveActivePay from '../../schema/GetInactiveActivePay'

const PaymentRecord = () => {
  const navigation = useNavigation();  
    const [activePay, setActivePay] = useState(0);

  const { token,
    refreshToken,
    patientId,
    email_1,
    userType,    
    verifyTokenFun,} = useAuth(navigation);
    
    
    const {   email,
      firstName,
      lastName,
      streetAddress,
      city,
      state,
      country, 
      postal,
      latitude_,
      longitude_,
      dateOfBirth,    
    pId,
    bankInfomation,
    online,
    phlebotomistEarning_} = GetUserDetails(navigation);

    const {   
      inActive,
      fetchDataInactiveDetails} = GetInactiveActivePay(navigation);

 useEffect(() => {
        if(inActive){

        }
        
      }, [token, patientId, inActive, phlebotomistEarning_]);
    
  const pieData = [
    {value: 54, color: '#177AD5'},
    {value: 40, color: '#79D2DE'},
    {value: 20, color: '#ED6665'},
  ];
  const pieData_ = [

    {
  
      value: inActive,  
      color: '#FF9783',  
      gradientCenterColor: '#006DFF',  
      focused: true,  
    },
  
    {value: phlebotomistEarning_, color: '#2561ED', gradientCenterColor: '#2561ED'},   
   
  ];
  const renderDot = color => {

    return (  
      <View  
        style={{
            height: 10,  
          width: 10,  
          borderRadius: 5,  
          backgroundColor: color,  
          marginRight: 10,  
        }}
  
      />
  
    );
  
  };
  
  
  const renderLegendComponent = () => {
  
    return (
  
      <>
  
        <View  
          style={{  
            flexDirection: 'row',  
            justifyContent: 'center',  
            marginBottom: 10,  
          }}>
  
          <View  
            style={{  
              flexDirection: 'row',  
              alignItems: 'center',  
              width: 120,  
              marginRight: 20,  
            }}>
  
            {renderDot('#FF9783')}  
            <Text style={{color: 'black'}}>Inactive <Text style={styles.titleText}>{formatNaira(inActive)}</Text></Text>  
          </View>
  
          {/* <View  
            style={{flexDirection: 'row', alignItems: 'center', width: 120}}>  
            {renderDot('#8F80F3')}  
            <Text style={{color: 'red'}}>Okay: 16%</Text>
  
          </View> */}
  
        </View>
  
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>  
          <View  
            style={{  
              flexDirection: 'row',  
              alignItems: 'center',  
              width: 120,  
              marginRight: 20,  
            }}>
  
            {renderDot('#2561ED')}
            <Text style={{color: 'black'}}>Active <Text style={styles.titleText}>{formatNaira(phlebotomistEarning_)}</Text></Text>  
            
  
          </View>
  
  
        </View>
  
      </>
  
    );
  
  };


  
  const handleSubmit = async () => {
    console.log('Remit cash');
    navigation.navigate('remit_payment', {});
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <KeyboardAvoidingContainer style={styles.containerBackGround}>
    <SafeAreaView style={styles.containerOrder}>
    <Text style={[styles_.timeText, {fontSize:12}]}>Total payment received</Text>
    <Text style={styles.titleText}>{formatNaira(phlebotomistEarning_+inActive)}</Text>

    <View style={{padding: 20, alignItems: 'center'}}>

        <View style={styles.row}>
          <View >
          
          </View>
          <View>
          {renderLegendComponent()}
          </View>
        </View>

      </View>

      {/*  */}
<View style={styles.card}>
<CustomAccountMenuCard       
          
          title={"View payment history"}                    
          rightIcon={<ArrowRight width={20} height={20}/>}    
          onPress={() => navigation.navigate('payment_history', { Data: '', data_tittle:'Change password'})}  
          
          
          />
</View>
    </SafeAreaView>
    </KeyboardAvoidingContainer>
    </GestureHandlerRootView>
  )
}

export default PaymentRecord

const styles_ = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  chart: {
    alignSelf: 'center',
  },
  
  
  
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth:0,
    elevation: 1,
    marginVertical: 8,
    padding: 10,
  },
  cardSection: {
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: '#059669',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    flex: 0.48,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailsCard: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  detailsText: {
    color: '#333',
  },
  column: {
    
    
    
  },
  timeText:{
    color:'#8C93A3',
    fontSize:13,
    fontWeight:'600',
    lineHeight:19.2,
  }
});