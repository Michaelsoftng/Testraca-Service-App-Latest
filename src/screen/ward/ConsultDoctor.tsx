import { StyleSheet, Text, View, ScrollView, TextInput, Dimensions, Alert } from 'react-native'
import React, { useState } from 'react'
import styles_ from '../../components/utils/styles';
import CustomInputText from '../../components/CustomInputText';
import CustomLabtracaInputText from '../../components/CustomLabtracaInputText';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

export default function ConsultDoctor() {
  const navigation = useNavigation();
  const [name, setName] = useState('');


  const handleSubmit = () => {
    
    Alert.alert(
      'Success',
      'Your symptoms and medical history will be reviewed by a doctor. Would you like to proceed with Consultation with a doctor?',
      [
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => navigation.navigate('list_of_price_consutation', { Data: 'Dad', data_title:'Consultaion Price(s)'})
            
            
        },
      ],
      { cancelable: false }
    );
      
    
};
  return (
    <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={styles.container}>

    <View style={[styles.cardAccountRequest, styles_.cardElevatedOrder, {borderWidth:0}]}>
    <Text style={styles.label}>Consult Doctor</Text>

 
      <CustomLabtracaInputText
            title="Please tell us the reason for seeking medical consultation?"        
            placeholder="Reason?"
            
            
            
            
            
          />
<View style={styles_.sizeSpaceBottom}></View>
<CustomLabtracaInputText
            title="Kindly state your symptoms"        
            placeholder="Kindly state your symptoms"
            
            
            
            
            
          />
<View style={styles_.sizeSpaceBottom}></View>
<CustomLabtracaInputText
            title="Kindly state your medical history"        
            placeholder="Kindly state your medical history"
            
            
            
            
            
          />
<View style={styles_.sizeSpaceBottom}></View>
<CustomLabtracaInputText
            title="Kindly state pre-existing conditions"        
            placeholder="Kindly state pre-existing conditions"
            
            
            
            
            
          />
<View style={styles_.sizeSpaceBottom}></View>
<CustomLabtracaInputText
            title="Kindly state your allergies"        
            placeholder="Kindly state your allergies"
            
            
            
            
            
          />
<View style={styles_.sizeSpaceBottom}></View>
<CustomLabtracaInputText
            title="Medications"        
            placeholder="Medications"
            
            
            
            
            
          />

<View style={styles_.sizeSpaceBottom}></View>
<CustomLabtracaInputText
            title="Others"        
            placeholder="Others"
            
            
            
            
            
          />
<View style={styles_.sizeSpaceBottom}></View>
<CustomButton
            backgroundColor={ styles_.loginScreenButtonEnable}
            children={
              <Text style={styles_.loginTextEnable}>Continue</Text>
            }
            handlePress={
              
              handleSubmit
            
            } 
          />

    </View>


    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: '#FFFFFF', 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    doctorButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    selectedDoctor: {
        backgroundColor: '#10B981',
        color:'#fff'
    },
    doctorButtonText: {
        fontSize: 16,
        
    },
    datePickerButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    datePickerText: {
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#059669',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      },
      column: {
        flex: 1,
        marginHorizontal: 5,
      },
      cardAccountRequest: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        
        padding: 2,
        
        
      },
});