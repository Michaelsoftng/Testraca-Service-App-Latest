import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer';
import styles_ from '../../components/utils/styles';
import Success from '../../assets/images/svg-icon/successful';
import { useNavigation } from '@react-navigation/native';
export default function Successful() {
    const navigation = useNavigation();
  return (
    <KeyboardAvoidingContainer style={styles_.containerBackGround}>
          <View style={styles.container}>
            {/* Card Container */}
            <View style={styles.card}>
                {/* Three Columns */}
                <View style={styles.row}>
                    {/* First Column: Image */}
                    <Success width={50} height={50}/>

                    {/* Second Column: Payment Status */}
                    <View style={styles.textContainer}>
                    <View style={styles_.sizeSpaceBottom}></View>
                    <View style={styles_.sizeSpaceBottom}></View>
                        <Text style={styles.paymentText}>Payment Successful</Text>
                        {/* <View style={styles_.sizeSpaceBottom}></View> */}
                        {/* <View style={styles_.sizeSpaceBottom}></View> */}
                        <Text style={styles.descriptionText}>
                            Payment for your test has been completed successfully.
                        </Text>
                    </View>
                </View>
                <View style={styles_.sizeSpaceBottom}></View>
                <View style={styles_.sizeSpaceBottom}></View>
                <View style={styles_.sizeSpaceBottom}></View>
                {/* Button below the card */}
                <View style={styles.buttonContainer}>
                    <Button title="Continue" color="#059669" onPress={() => { navigation.navigate('cabinet_page'); }} />
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
        elevation: 3, // For shadow on Android
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
});