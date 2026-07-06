import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles_ from '../../../components/utils/styles';
import KeyboardAvoidingContainer from '../../../components/utils/KeyboardAvoidingContainer';
import CustomButton from '../../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';


export default function ListOfPriceConsutation() {
    const navigation = useNavigation();
    const datas = [
        { id: 1, availbeTime: '8am - 12pm'},
        { id: 2, availbeTime: '1pm - 7pm' },
        
    ];
    const datas_time_amount = [
        { id: 1, duration: '15mins', amount:2000},
        { id: 2, duration: '30mins', amount:4000},
        { id: 3, duration: '45mins', amount:6000},
        { id: 4, duration: '1hr', amount:8000},
        { id: 5, duration: '1hr30mins', amount:12000},
        
        
    ];
    const [packageType, setPackageType] = useState(null); 
    const [quantity, setQuantity] = useState(1); 

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);


    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');

    const getTomorrow = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); 
    
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
        
        const formattedDate = tomorrow.toISOString().split('T')[0]; 
    
        
        const dayName = daysOfWeek[tomorrow.getDay()];
    
        return { formattedDate, dayName };
      };
    
      const handleContinue = () => {
        
        navigation.navigate('summary_page', {
            selectedDoctor,
            selectedDuration,
            selectedDate,
            selectedAmount
          });
            
          
        };
      const { formattedDate, dayName } = getTomorrow();

  return (
    <KeyboardAvoidingContainer style={styles_.containerBackGround}>
          <View style={[styles.container]}>
      
          <View style={[styles_.cardAccountRequestInner, styles_.cardElevatedOrder, {borderWidth:0}]}>
            <Text style={[styles.label, styles_.labelText]}>Please select period?</Text>
            <View style={styles.row}>
            {/* Doctor Selection */}
            
            {datas.map((data) => (
                <View style={styles.column} key={data.id}>
                <TouchableOpacity
                    key={data.id}
                    style={[styles.doctorButton, selectedDoctor === data.availbeTime && styles.selectedDoctor]}
                    onPress={() =>{ setSelectedDoctor(data.availbeTime);
                        setSelectedDate(formattedDate+"("+dayName+")");
                    }
                    }
                >
                    <Text style={[styles_.labelText, {fontSize:12}, selectedDoctor === data.availbeTime && {color:'#fff',fontSize:12, fontWeight:'bold'} ]}>{formattedDate} ({dayName})</Text>
                    <Text style={[styles_.labelText, {fontSize:12}, selectedDoctor === data.availbeTime && {color:'#fff', fontSize:12, fontWeight:'bold'} ]}>{data.availbeTime}</Text>
                </TouchableOpacity>
                </View>
            ))}

            </View>

            <Text style={[styles.label, styles_.labelText]}>List of price and duration for Consultation</Text>

            <View style={styles.column}>
            {/* Doctor Selection */}
            
            {datas_time_amount.map((data) => (
                <View style={styles.column} key={data.id}>
                <TouchableOpacity
                    key={data.id}
                    style={[styles.doctorButton, selectedDuration === data.duration && styles.selectedDuration]}
                    onPress={() => {setSelectedDuration(data.duration);
                        setSelectedAmount(data.amount);

                    }}
                >
                    
                    <View style={styles.row}>
                        <View style={styles.column}>
                        <Text style={[styles_.labelText, {fontSize:12}, selectedDuration === data.duration && {color:'#fff', fontSize:12, fontWeight:'bold'} ]}>{data.duration}</Text>
                        </View>
                        <View style={styles.column}>
                        <Text style={[styles_.labelText, {fontSize:12, textAlign: 'right', }, selectedDuration === data.duration && {color:'#fff', fontSize:12, fontWeight:'bold', alignSelf: 'flex-end',} ]}>{data.amount}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                </View>
            ))}

            </View>
            {/* {selectedDoctor === 'Medical Consultation' ?(
                <ConsultDoctor />):null

            }
            {selectedDoctor === 'Review Test Result' ?(
                <ReviewTest />):null

            } */}
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

    </View>
    </KeyboardAvoidingContainer>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
        backgroundColor: '#059669',
        color:'#fff'
    },
    selectedDuration: {
        backgroundColor: '#059669',
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
        justifyContent: 'space-between',
      },
      column: {
        flex: 1,
        marginHorizontal: 5,
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
})