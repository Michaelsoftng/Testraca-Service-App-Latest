import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert, BackHandler } from 'react-native';

import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer'
import styles from '../../components/utils/styles'
import CustomButtonWithImage from '../../components/CustomButtonWithImage';
import CustomButton from '../../components/CustomButton';
import CustomAccountMenuCard from '../../components/CustomAccountMenuCard';

import Health from './../../assets/images/svg-icon/health.svg';
import ArrowRight from './../../assets/images/svg-icon/arrow-right.svg';
import Support from './../../assets/images/svg-icon/support.svg';
import PasswordSvg from './../../assets/images/svg-icon/password.svg';
import Audit from './../../assets/images/svg-icon/record.svg';
import PaymentRec from './../../assets/images/svg-icon/cash.svg';
import LogoutSvg from './../../assets/images/svg-icon/logout.svg';
import CardSvg from './../../assets/images/svg-icon/navigate.svg';
import { useNavigation } from '@react-navigation/native';
import useBackHandler from '../../components/utils/UseBackHandler';
import useAuth from '../../schema/UseAuth';
import GetUserDetails from '../../schema/GetUserDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { useGetUserDetails } from '../../hook/useGetUserDetails';
import { clearUserDetails } from '../../my-store/redux/userDetailsSlice';
// import client from "../schema/apolloClient";
import { useDispatch } from 'react-redux';
import { unregisterFCMToken } from '../../core/fcmNotifications';



export default function MyAccount() {
  const dispatch = useDispatch();
  const navigation = useNavigation();  
    const handleEditProfile = () => {
      navigation.navigate('edit_profile', { Data: '', data_tittle:'Edit Profile'})
          
        
      };
const [loading, setLoading] = useState(true);
     const { token,
        refreshToken,
        patientId,
        email_1,
        userType,    
        verifyTokenFun,} = useAuth(navigation);
        
        // const {   email,
        //   firstName,
        //   lastName,
        //   streetAddress,
        //   city,
        //   state,
        //   country, 
        //   postal,
        //   // latitude_,
        //   // longitude_,
        //   dateOfBirth,    
        // pId,
        // bankInfomation,
        // online,phlebotomistEarning_} = GetUserDetails(navigation);

       const {
             userData,
             loadingUserDetails,
             errorUserDetails,
             patientIdPay,
             reloadUserDetails,
           } = useGetUserDetails();
    
const [role, setRole] = useState();
      // useBackHandler();
      const clearToken = async () => {
    await unregisterFCMToken();
    await AsyncStorage.setItem('userToken_', '');
    await AsyncStorage.setItem('refreshToken_', '');
    await AsyncStorage.setItem('userType_', '');
    await AsyncStorage.setItem('id_', '');
    logout();
    }

      useEffect(() => {
        setRole(userType?.toLowerCase() || '');
        if (role && userData) {
          setLoading(false);
        }
      }, [token, patientId, role, userType, userData]);
      
const logout = async () => {
  // await AsyncStorage.removeItem("id_");

  dispatch(clearUserDetails());
  navigation.navigate('onboarding_screen');

  // 🚨 CLEAR APOLLO CACHE
  // await client.clearStore();
};
  return (


    <KeyboardAvoidingContainer style={styles.containerBackGround}>
    <View style={[styles.containerProfile]}>

{loading || loadingUserDetails ? (
      <Spinner
        visible={loading || loadingUserDetails}
        color="#059669"
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
    ) : (
      <>
    <Image
      source={
        require('./../../assets/images/png/starting.png')
     
    } 
      style={styles.profileImageProfile}
    />
    <Text style={styles.profileNameProfile}>{userData?.lastName} {userData?.firstName}</Text>
    <Text style={styles.emailProfile}>{userData?.email}</Text>.

    <CustomButton
            backgroundColor={styles.loginScreenButtonEnable}
            children={
              <Text style={styles.loginTextEnable}>Edit Profile</Text>
            }
            handlePress={handleEditProfile} 
          />
          <View style={styles.sizeSpaceBottom}></View>
          <View style={[styles.cardAccountUser, styles.cardElevatedOrder]}>


          <CustomAccountMenuCard       
          leftIcon={<Support width={50} height={50}/>} 
          title={"Help and Support"}                    
          rightIcon={<ArrowRight width={40} height={40}/>}    
          onPress={() => navigation.navigate('help_and_support_screen', { Data: '', data_tittle:'Help and Support'})}       
          />

          {/* <CustomAccountMenuCard       
          leftIcon={<CardSvg width={40} height={40}/>} 
          title={"Navigation"}               
          
          rightIcon={<ArrowRight width={40} height={40}/>}    
          onPress={() => navigation.navigate('bank_card', { Data: '', data_tittle:'Add a Bank Card'})}       
          />           */}
          <CustomAccountMenuCard       
          leftIcon={<PasswordSvg width={50} height={50}/>} 
          title={"Change password"}               
          
          rightIcon={<ArrowRight width={40} height={40}/>}    
          onPress={() => navigation.navigate('change_password', { Data: '', data_tittle:'Change password'})}       
          />

        {role === 'phlebotomist'?(<CustomAccountMenuCard       
          leftIcon={<Audit width={50} height={50}/>} 
          title={"Audit"}                    
          rightIcon={<ArrowRight width={40} height={40}/>}    
          onPress={() => navigation.navigate('audit_screen', { Data: '', data_tittle:'Edit'})}       
                   
          />):null}

{/* <CustomAccountMenuCard       
          leftIcon={<PaymentRec width={50} height={50}/>} 
          title={"Payment record"}                    
          rightIcon={<ArrowRight width={40} height={40}/>}    
          onPress={() => navigation.navigate('payment_record', { Data: '', data_tittle:'Change password'})}  
          
          
          /> */}
        <CustomAccountMenuCard       
          leftIcon={<LogoutSvg width={50} height={50}/>} 
          title={"Logout"}                    
          rightIcon={<ArrowRight width={40} height={40}/>}    
          onPress={() => {
            

            clearToken();
          
          }}       
          />
                

          </View>
          </>
      )}
  </View>
  </KeyboardAvoidingContainer>
  )
}

