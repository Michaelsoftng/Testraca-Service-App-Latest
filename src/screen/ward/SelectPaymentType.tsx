
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// import  { Paystack }  from 'react-native-paystack-webview';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';


import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer';
import styles_ from '../../components/utils/styles';
import CustomButton from '../../components/CustomButton';
import { Formik } from 'formik';
import CustomCardWard from '../../components/CustomCardWard';
import SuccessSvg from '../../assets/images/svg-icon/Success';
import Edit_Svg from '../../assets/images/svg-icon/edit-2';
import CardList from '../../components/CardList';
import AddIcon from '../../assets/images/svg-icon/add';
import TimerStart from '../../assets/images/svg-icon/timer-start';
import Location from '../../assets/images/svg-icon/location';
import CustomLocationInput from '../../components/CustomLocationInput';
import { PAYSTACK_KEY, URL_LINK } from '../../../config';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { VERIFY_TOKEN_MUTATION } from '../../schema/ApiSchema';
import { useMutation } from '@apollo/client';
import formatNaira from '../../components/FormatNaira';
import useAuth from '../../schema/UseAuth';
import useBackHandler from '../../components/utils/UseBackHandler';
import useGetAllCharges from '../../schema/GetAllCharges';

const SelectPaymentType  = () => {
  const navigation = useNavigation();
  const { token,
    refreshToken,
    patientId,
    email_1,    
    verifyTokenFun,} = useAuth(navigation);
    useBackHandler();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(false); 
  const [data_, setData] = useState([]);
  const [errors, setErrors] = useState(null);
  
  const {    distanceChargePerDistance,
    phlebotomistCharge,
    serviceCharge  } = useGetAllCharges(navigation);
  const {
    testID, testName, currentAddress, patientId_, token_, facilityId, facilityName, facilityType, price, distance, quantity, serviceFee, request_id
  } = route.params || {};
  console.info('REQUEST ID::: ',request_id);
  // const paystackWebViewRef = useRef<paystackProps.PayStackRef>();
    
    
    
    
    






















































        

















    const handleTransactionError = (syntheticEvent) => {
      const { nativeEvent } = syntheticEvent;
      console.warn('WebView error: ', nativeEvent);
      Alert.alert("Transaction Error", "An error occurred during the transaction. Going back to the previous page.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    };
  
    const handleNavigationStateChange = (event) => {
      if (!event.url.includes("paystack") && event.loading) {
        Alert.alert("Payment Issue", "The payment page is not loading. Going back to the previous page.", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    };

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setFocused] = useState(false);

  // const [packageType, setPackageType] = useState('Online'); 
    

    
    
    

    
    
    
  
  
    const handleContinue =() =>{
      // paystackWebViewRef.current.startTransaction();
      
      
      
    }
  
  return (
    <Formik
      initialValues={{ cardNumber: '', expiryDate: '', cvv: '', pin: '' }}
      validationSchema={''} 
      onSubmit={(values) => {
        
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingContainer style={styles_.containerBackGround}>
          <View style={[styles_.containerProfile]}>
          {/* <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }}> */}
                 
          {/* <Paystack */}
        {/* // paystackKey={PAYSTACK_KEY}
        // billingEmail={email_1}
      //   amount={'1'}
      //   metadata={{
      //     custom_fields: [
      //       {
      //         display_name: "Request ID",
      //         variable_name: "requestId",
      //         value: request_id, 
      //       },
      //     ],
      //   }}
      //   onCancel={(e) => {
      //   }}
      //   onNavigationStateChange={handleNavigationStateChange}
      //   onSuccess={(res) => {
      //     console.log(res);
      //     navigation.navigate('successfull_page', { Data: 'Dad', data_title:''});
      //   }}
      //   ref={paystackWebViewRef}
      // /> */}


             
          <Image
      source={
        require('./../../assets/images/png/starting.png')
     
    } 
      style={styles_.profileImageProfile}
    />
    <Text style={styles_.profileNameProfile}>John Doe</Text>
    
    <View style={[styles_.cardAccountRequestInner, styles_.cardElevatedOrder, {backgroundColor:'#F5F6F7'}]}>
        <Text style={{color:'#0F1D40', fontSize:15, fontWeight:'700', lineHeight:23.4}}>{testName}</Text>
<View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.payMent}>
                        Package
                        </Text>
                    </View>
                    <View 
                    
                    >
                        <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5}]}>Single</Text>
                    </View>
    </View>
    <View style={styles.row}>
                    <View style={styles.column}>
                    <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5}]}>For {quantity} persons</Text>
                        
                    </View>
                    <View 
                    
                    >
                        <Text style={styles.payMent}>
                        {formatNaira(price*quantity)}
                        </Text>
                    </View>
    </View>
    <View style={styles.row}>
                    <View style={styles.column}>
                    <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5}]}>Service Charge</Text>
                    </View>
                    <View 
                    
                    >
                      <Text style={styles.payMent}>
                        {formatNaira(serviceCharge)}
                        </Text>
                        
                    </View>
    </View>
    <View style={styles.row}>
                    <View style={styles.column}>
                    <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5}]}>Dist. charge <Text style={[{fontSize:9, fontWeight:'500'}]}>{distance ? `(${distance.toFixed(2)} KM)` : '(N/A)'}</Text></Text>
                    </View>
                    <View 
                    
                    >
                      <Text style={styles.payMent}>
                        {formatNaira(distance * distanceChargePerDistance)}
                        </Text>
                        
                    </View>
    </View>
    <View style={styles.row}>
                    <View style={styles.column}>
                    <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5}]}>Phlebotomist charge</Text>
                    </View>
                    <View 
                    
                    >
                      <Text style={styles.payMent}>
                        {formatNaira(phlebotomistCharge)}
                        </Text>
                        
                    </View>
    </View>
    {/* price*quantity + serviceFee */}
    <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={[styles.payMent, {fontSize:15, fontWeight:'800', lineHeight:23.4}]}>
                        Total cost
                        </Text>
                    </View>
                    <View 
                    
                    >
                        <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5,fontSize:15, fontWeight:'800', lineHeight:23.4}]}>{formatNaira(price*quantity + serviceCharge + phlebotomistCharge + (distance * distanceChargePerDistance))}</Text>
                    </View>
    </View>
</View>      
                 
      <View style={[styles_.cardAccountRequestInner, styles_.cardElevatedOrder, {borderWidth:0}]}>
      <View style={styles.row}>
    <View style={styles.column}>
    <TouchableOpacity 
                    style={styles.radioButton} 
                    onPress={() => setPackageType('Cash')}
                >
                    <Icon 
                        name={packageType === 'Cash' ? 'radio-button-checked' : 'radio-button-unchecked'} 
                        size={20} 
                        color={packageType === 'Cash' ?"#059669" :"#A4A9B6"} 
                        weight={600}
                    />
                    <Text style={styles.radioText}>Cash payment</Text>
                </TouchableOpacity>
</View>
<View style={[
    
    ]}>

                <TouchableOpacity 
                    style={styles.radioButton} 
                    onPress={() => setPackageType('Online')}
                >
                    <Icon 
                        name={packageType === 'Online' ? 'radio-button-checked' : 'radio-button-unchecked'} 
                        size={20} 
                        color={packageType === 'Online' ?"#059669" :"#A4A9B6"} 
                        weight={600}
                    />
                    <Text style={styles.radioText}>Online payment<Text style={[{color:'#525C76', fontSize:12, fontWeight:'700'}]}> - 10% discount</Text></Text>
                </TouchableOpacity>
                </View>
        </View>
        </View>            


            <View style={[styles_.cardAccountRequestInner, styles_.cardElevatedOrder, {borderWidth:0}]}>
            <CustomButton
              backgroundColor={
                
                
                
                  styles_.loginScreenButtonEnable
              }
              children={
                <Text
                  style={
                    
                    
                    
                    
                      styles_.loginTextEnable
                  }
                >
                  Book test now
                </Text>
              }
              handlePress={handleContinue} 
            />
            </View>
                {/* </View>   */}
  

            
            {/* Schedule test */}
   

            {/* <TouchableOpacity onPress={()=> paystackWebViewRef.current.startTransaction()}>
          <Text>Pay Now</Text>
        </TouchableOpacity> */}

          </View>
        </KeyboardAvoidingContainer>
        </GestureHandlerRootView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  butt:{
      color:'#059669',
      backgroundColor:'#FFFFFF',
  borderWidth:1,
  borderColor:'#5C657D',
  justifyContent:'center',
  borderRadius:4,
  alignItems:'center'
  },
  centerText:{
      justifyContent:'center',
      textAlign:'center',        
      color:'#525C76',
      fontWeight:'800',
      fontSize:16,
      
      paddingTop:10,
      paddingBottom:10,
      alignItems:'center'
    },
container: {
  flex: 1,
  padding: 10,
  paddingTop: 0,
  backgroundColor: '#FFFFFF',
},
row: {
  flexDirection: 'row',
  justifyContent: 'space-evenly',
},
column: {
  flex: 1,
  marginHorizontal: 5,
},
label: {
  fontSize: 13,
  fontWeight: '700',
  marginVertical: 8,
  lineHeight: 20.2,
  color: '#525C76',
},
input: {
  borderWidth: 1,
  borderColor: '#E2E4E8',
  height: 48,
  padding: 10,
  borderRadius: 5,
  marginBottom: 12,
  fontSize: 18,
  fontWeight: '800',
  backgroundColor: '#fff',
  textAlign: 'center',
  letterSpacing: 2,
},
activeInput: {
  borderColor: 'green', 
},
confirmButton: {
  backgroundColor: '#3498db',
  padding: 15,
  borderRadius: 5,
  alignItems: 'center',
  marginVertical: 20,
},
confirmButtonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
},
keypadContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
},
keyButton: {
  width: '30%',
  margin: 5,
  paddingVertical: 10,
  backgroundColor: '#e0e0e0',
  alignItems: 'center',
  borderRadius: 5,
},
keyButtonZero: {
  width: '63%', 
},
keyButtonText: {
  fontSize: 20,
  fontWeight: '600',
},
cardInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#D3E5FE',
  borderColor: '#1B4ACB',
  borderWidth: 1,
  borderRadius: 4,
  padding: 10,
  marginVertical: 10,
},
icon: {
  marginRight: 10, 
},
cardText: {
  color: '#1B4ACB',
  fontSize: 12,
  fontWeight:'400',
  flex: 1, 
},


card: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 15,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  marginBottom: 10,
  backgroundColor: '#fff',
  justifyContent: 'space-between',
},
column_: {
  flex: 1,
  justifyContent: 'center',
},
columnQuantity: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
label_: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
},
radioButton: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginVertical: 5,
},
radioText: {
  fontSize: 14,
  color: '#000000',
  marginLeft: 0,
  fontWeight:'700',
},
quantityInput: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 5,
  width: 220,
  paddingVertical: 5,
  marginHorizontal: 5,
  fontSize: 16,
  color: '#333',
},
payMent:{
  color:'#525C76',
  fontSize:13,
  fontWeight:'600',
  lineHeight:20.2,
}
});

export default SelectPaymentType;
















































































































































        





























































































