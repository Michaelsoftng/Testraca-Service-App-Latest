import React from 'react';
// import  { Paystack }  from 'react-native-paystack-webview';
import { View } from 'react-native';

export default function Pays() {
  return (
    <View style={{ flex: 1 }}>
      {/* <Paystack  
        paystackKey= "pk_live_a323948dba28a3e6300be27b847d92c6e657fe47"  
        amount={'1.00'}
        billingEmail="paystackwebview@something.com"
        activityIndicatorColor="green"
        
        onCancel={(e) => {
          console.log(e);
          console.log(e.status+"  YEEEEP");
          if(e.status === 'cancelled'){

          }
          
        }}
        onSuccess={(res) => {
          console.log(res);
          
        }}
        autoStart={true}
      /> */}
    </View>
  );
}