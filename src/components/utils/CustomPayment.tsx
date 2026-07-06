import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import CreditCardInput from 'react-native-credit-card-input';
import { PAYSTACK_KEY } from '../../../config';

const CustomPayment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  const handlePayment = async () => {
    try {
      const response = await axios.post('(link unavailable)', {
        'card': {
          'number': cardNumber,
          'expiry_month': expiryDate.split('/')[0],
          'expiry_year': expiryDate.split('/')[1],
          'cvv': cvv,
        },
        'email': email,
        'amount': amount * 100, // Convert to kobo
        'key': PAYSTACK_KEY,
      });

      if (response.data.status === 'success') {
        console.log('Payment successful!');
        // Handle success response
        console.warn(response.data);
      } else {
        console.log('Payment failed!');
        // Handle failure response
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      {/* <CreditCardInput
        onChange={(formData) => {
          setCardNumber(formData.number);
          setExpiryDate(formData.expiry);
          setCvv(formData.cvv);
        }}
      /> */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />
      <TouchableOpacity onPress={handlePayment}>
        <Text>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomPayment;