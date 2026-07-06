import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import styles_ from '../../components/utils/styles'
import CustomLabtracaInputText from '../../components/CustomLabtracaInputText'
import { ScrollView } from 'react-native-gesture-handler'
import CustomButton from '../../components/CustomButton'

export default function ReviewTest() {

    const handleSubmit = () => {
        
        Alert.alert('Success', 'You will get a response from our Pathologist on your result review shortly.')
          
        
    };
  return (
    <ScrollView showsHorizontalScrollIndicator={false}>
    <View style={styles.container}>

<View style={[styles.cardAccountRequest, styles_.cardElevatedOrder, {borderWidth:0}]}>
<Text style={styles.label}>Consult Doctor</Text>


<CustomLabtracaInputText
      title="Please state your Medical Result ID number?"        
      placeholder="Medical Result ID number?"
      
      
      
      
      
    />
<View style={styles_.sizeSpaceBottom}></View>

<CustomButton
            backgroundColor={ styles_.loginScreenButtonEnable}
            children={
              <Text style={styles_.loginTextEnable}>Submit</Text>
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