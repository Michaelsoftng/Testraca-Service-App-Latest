import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';






import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer';
import styles_ from '../../components/utils/styles';
import CustomButton from '../../components/CustomButton';


const BankCardPage = ({ route, navigation }) => {
  
  const { Data, data_title } = route.params;
  const publicKey = 'pk_live_a323948dba28a3e6300be27b847d92c6e657fe47';

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [pin, setPin] = useState('');
  const [amount, setAmount] = useState('');

  const handleChargeCard = async() => {
      
      
      
      
      
      
      
      
      
      
      
      

      
      

      
      
      
      
      

      
      
      
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
  
  
  
  
  
  };

  useEffect(() => {
    if (data_title) {
      
      navigation.setOptions({ title: data_title });
    }
  }, [navigation, data_title]);

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setFocused] = useState(false);

  

  const [activeField, setActiveField] = useState('cardNumber'); 

  
  const handleKeyPress = (value) => {
    const maxLengths = {
      cardNumber: 16,
      expiryDate: 5,
      cvv: 3,
      pin: 4,
    };

    const updateField = (field, setter) => {
      setter((prev) => {
        if (value === 'delete') {
          return prev.slice(0, -1); 
        } else if (prev.length < maxLengths[field]) {
          if (field === 'expiryDate') {
            
            if (prev.length === 1 && value !== '/') {
              return prev + value + '/'; 
            }
          }
          return prev + value; 
        }
        return prev;
      });
    };

    switch (activeField) {
      case 'cardNumber':
        updateField('cardNumber', setCardNumber);
        break;
      case 'expiryDate':
        updateField('expiryDate', setExpiryDate);
        break;
      case 'cvv':
        updateField('cvv', setCvv);
        break;
      case 'pin':
        updateField('pin', setPin);
        break;
      default:
        break;
    }
  };



  
  return (
    <Formik
      initialValues={{ cardNumber: '', expiryDate: '', cvv: '', pin: '' }}
      validationSchema={''} 
      onSubmit={(values) => {
        navigation.navigate('cabinet_page');
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <KeyboardAvoidingContainer style={styles_.containerBackGround}>
          <View style={[styles.container]}>
            {/* Card Number Field */}
            <Text>Amount:</Text>
            <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} />
            <Text style={styles.label}>Card Number</Text>
            <TouchableOpacity onPress={() => setActiveField('cardNumber')}>
              <TextInput
                style={[
                  styles.input,
                  activeField === 'cardNumber' && styles.activeInput, 
                ]}
                value={cardNumber}
                editable={false} 
                placeholder="Enter Card Number"
                onFocus={() => setFocused(true)} 
                onBlur={() => setFocused(false)} 
              />
            </TouchableOpacity>

            {/* Expiry Date and CVV Fields (in the same row) */}
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Expiry Date</Text>
                <TouchableOpacity onPress={() => setActiveField('expiryDate')}>
                  <TextInput
                    style={[
                      styles.input,
                      activeField === 'expiryDate' && styles.activeInput, 
                    ]}
                    value={expiryDate}
                    editable={false} 
                    placeholder="MM/YY"
                    onFocus={() => setFocused(true)} 
                    onBlur={() => setFocused(false)} 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>CVV</Text>
                <TouchableOpacity onPress={() => setActiveField('cvv')}>
                  <TextInput
                    style={[
                      styles.input,
                      activeField === 'cvv' && styles.activeInput, 
                    ]}
                    value={cvv}
                    editable={false} 
                    placeholder="CVV"
                    onFocus={() => setFocused(true)} 
                    onBlur={() => setFocused(false)} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* PIN Field */}
            <Text style={styles.label}>PIN</Text>
            <TouchableOpacity onPress={() => setActiveField('pin')}>
            <TextInput
              style={[
                styles.input,
                activeField === 'pin' && styles.activeInput, 
              ]}
              value={pin}
              editable={false} 
              placeholder="Enter PIN"
              secureTextEntry={true}
              onFocus={() => setFocused(true)} 
              onBlur={() => setFocused(false)} 
            />
            </TouchableOpacity>            

            {/* Confirm Button */}
            <CustomButton
              backgroundColor={
                values.cardNumber.trim().length === 16
                  ? styles_.loginScreenButtonDisable
                  : styles_.loginScreenButtonEnable
              }
              children={
                <Text
                  style={
                    values.cardNumber.trim().length === 16
                      ? styles_.loginTextDisable
                      : styles_.loginTextEnable
                  }
                >
                  Next
                </Text>
              }
              handlePress={handleChargeCard} 
            />

            {/* Custom Keypad */}
            <View style={styles.keypadContainer}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.keyButton}
                  onPress={() => handleKeyPress(key)}
                >
                  <Text style={styles.keyButtonText}>{key}</Text>
                </TouchableOpacity>
              ))}

              {/* Custom key style for "0" */}
              <TouchableOpacity
                style={[styles.keyButton, styles.keyButtonZero]}
                onPress={() => handleKeyPress('0')}
              >
                <Text style={styles.keyButtonText}>0</Text>
              </TouchableOpacity>

              {/* Delete button */}
              <TouchableOpacity
                style={styles.keyButton}
                onPress={() => handleKeyPress('delete')}
              >
                <Text style={styles.keyButtonText}>⌫</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingContainer>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 0,
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

export default BankCardPage;


