import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer';
import styles_ from '../../components/utils/styles';
import Failed_svg from '../../assets/images/svg-icon/failed';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Failed() {
    const navigation = useNavigation();
  return (
    <KeyboardAvoidingContainer style={styles_.containerBackGround}>
          <View style={styles.container}>
            {/* Card Container */}
            <View style={styles.card}>
                {/* Three Columns */}
                <View style={styles.row}>
                    {/* First Column: Image */}
                    <Failed_svg width={50} height={50}/>

                    {/* Second Column: Payment Status */}
                    <View style={styles.textContainer}>
                    <View style={styles_.sizeSpaceBottom}></View>
                    <View style={styles_.sizeSpaceBottom}></View>
                        <Text style={styles.paymentText}>Payment Failed</Text>
                        {/* <View style={styles_.sizeSpaceBottom}></View> */}
                        {/* <View style={styles_.sizeSpaceBottom}></View> */}
                        <Text style={styles.descriptionText}>
                        Payment for your test was unsuccessful, retry or  continue
                        </Text>
                    </View>
                </View>
                <View style={styles_.sizeSpaceBottom}></View>
                <View style={styles_.sizeSpaceBottom}></View>
                <View style={styles_.sizeSpaceBottom}></View>
                {/* Button below the card */}
                <View style={styles.buttonContainer}>
                    <Button title="Retry" color="#059669" onPress={() => { navigation.goBack(); }} />
                </View>
                <View style={styles_.sizeSpaceBottom}></View>
                {/* Button below the card */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { navigation.navigate('cabinet_page'); }}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
            </View>
        </View>
        </View>
    </KeyboardAvoidingContainer>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    card: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        elevation: 3, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    row: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
        alignContent:'center'
    },
    paymentText: {
        color: '#0F1D40',
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 5,
        alignContent:'center',
        justifyContent:'center',
        alignItems:'center'

    },
    descriptionText: {
        color: '#525C76',
        fontSize: 12,
        fontWeight: '500',
    },
    buttonContainer: {
        marginTop: 20,
    },


    
    
    
    button: {
        borderWidth: 1,
        borderColor: '#059669',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#059669',
        fontSize: 16,
        fontWeight: '600',
    },
});