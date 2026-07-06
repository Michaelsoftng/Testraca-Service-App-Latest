import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Make sure to install this package
import { ScrollView } from 'react-native-gesture-handler';
import styles_ from '../../components/utils/styles';
import ConsultDoctor from './ConsultDoctor';
import ReviewTest from './ReviewTest';
import CustomizeCard from './doctor/CustomizeCard';
import FileUploadCard from './doctor/FileUploadCard';

const doctors = [
    { id: 1, name: 'Review Test Result' },
    { id: 2, name: 'Medical Consultation' },
    
];

const BookAppointment = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');

    const handleSubmit = () => {
        // Perform appointment booking logic here (e.g., API call)
        if (!selectedDoctor || !name || !contact) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        // Here you can send the appointment data to your server
        console.log({
            doctor: selectedDoctor,
            date,
            time,
            name,
            contact,
        });

        Alert.alert('Success', 'Your appointment has been booked successfully!');
        resetForm();
    };

    const resetForm = () => {
        setSelectedDoctor(null);
        setDate(new Date());
        setTime(new Date());
        setName('');
        setContact('');
    };

    return (
      <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.title}>Talk to a Doctor</Text>
            <View style={[styles_.cardAccountRequestInner, styles_.cardElevatedOrder, {borderWidth:0}]}>
            <Text style={[styles.label, styles_.labelText]}>Would you like to Review your test result or Consult a Doctor?</Text>
            <View style={styles.row}>
            {/* Doctor Selection */}
            
            {doctors.map((doctor) => (
                <View style={styles.column} key={doctor.id}>
                <TouchableOpacity
                    key={doctor.id}
                    style={[styles.doctorButton, selectedDoctor === doctor.name && styles.selectedDoctor]}
                    onPress={() => setSelectedDoctor(doctor.name)}
                >
                    <Text style={[styles_.labelText, {fontSize:12}, selectedDoctor === doctor.name && {color:'#fff'} ]}>{doctor.name}</Text>
                </TouchableOpacity>
                </View>
            ))}

            </View>

            {selectedDoctor === 'Medical Consultation' ?(
                <ConsultDoctor />):null

            }
            {selectedDoctor === 'Review Test Result' ?(
                <FileUploadCard />):null

            }

            </View>
        </View>
      </ScrollView>
    );
};

export default BookAppointment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF', //f9f9f9
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
});
