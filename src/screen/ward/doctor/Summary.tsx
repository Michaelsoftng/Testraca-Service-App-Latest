import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
// import  { Paystack }  from 'react-native-paystack-webview';
import KeyboardAvoidingContainer from '../../../components/utils/KeyboardAvoidingContainer';
import styles_ from '../../../components/utils/styles';
import CustomButton from '../../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { PAYSTACK_KEY } from '../../../../config';


const Summary = ({ route }) =>{
    const navigation = useNavigation();
    // const paystackWebViewRef = useRef<paystackProps.PayStackRef>();
    const { selectedDoctor,
        selectedDuration,
        selectedDate,
        selectedAmount } = route.params;

        const handleContinue = () => {
            
            
            // paystackWebViewRef.current.startTransaction();
            
        };
  return (
    <KeyboardAvoidingContainer style={styles_.containerBackGround}>
          <View style={[styles.container]}>
          {/* <Paystack
        paystackKey={PAYSTACK_KEY}
        billingEmail="lexdesaint@gmail.com"
        amount={selectedAmount*100}
        onCancel={(e) => {
          
          navigation.navigate('failed_page', { Data: 'Dad', data_title:''});

        }}
        onSuccess={(res) => {
          navigation.navigate('successfull_page', { Data: 'Dad', data_title:''});
        }}
        ref={paystackWebViewRef}
      /> */}
          <View style={[styles_.cardAccountRequest, styles_.cardElevatedOrder, {borderWidth:0}]}>
      <Text style={[styles_.labelText, {fontSize:18, fontWeight:'bold'}]}>Summary</Text>
      <View style={[styles_.cardAccountRequestInner, styles_.cardElevatedOrder, {backgroundColor:'#3A4662'}]}>

      <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.payMent}>
                        Time Range
                        </Text>
                    </View>
                    <View 
                    
                    >
                        <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5}]}>
                             {selectedDoctor}
                            </Text>
                    </View>
    </View>
    <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.payMent}>
                        Date/Day
                        </Text>
                    </View>
                    <View 
                    
                    >
                        <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5}]}>
                             {selectedDate}
                            </Text>
                    </View>
    </View>
    <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.payMent}>
                        Duration
                        </Text>
                    </View>
                    <View 
                    
                    >
                        <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5}]}>
                             {selectedDuration}
                            </Text>
                    </View>
    </View>
      <View style={[{paddingLeft:5, paddingRight:5}]}>
    <View style={styles_.line} />
    </View>     
<View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.payMent}>
                        Consult price
                        </Text>
                    </View>
                    <View 
                    
                    >
                        <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5}]}>
                            NGN {selectedAmount}
                            </Text>
                    </View>
    </View>
    <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.payMent}>
                        Service charge
                        </Text>
                    </View>
                    <View 
                    
                    >
                        <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5}]}>
                            NGN 1,000
                            </Text>
                    </View>
    </View>
    <View style={[{paddingLeft:5, paddingRight:5}]}>
    <View style={styles_.line} />
    </View>
    <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={[styles.payMent, {fontSize:15, fontWeight:'800', lineHeight:23.4}]}>
                        Total
                        </Text>
                    </View>
                    <View 
                    
                    >
                        <Text style={[styles.payMent, {alignItems:'flex-end', justifyContent:'flex-end', alignContent:'flex-end', paddingRight:5,fontSize:15, fontWeight:'800', lineHeight:23.4}]}>NGN ({selectedAmount +1000})</Text>
                    </View>
    </View>
</View>
    </View>



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
                  Continue
                </Text>
              }
              handlePress={handleContinue} 
            />
    </View>
    </KeyboardAvoidingContainer>
  )
}

export default Summary

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingRight:5,
        backgroundColor: '#FFFFFF', 
        justifyContent:'center'
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
    color:'#FAFAFB',
    fontSize:14,
    fontWeight:'700',
    lineHeight:23.4,
},
datePickerButton: {
    padding: 5,
    borderWidth: 0,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
},
datePickerText: {
    fontSize: 16,
},
    
})