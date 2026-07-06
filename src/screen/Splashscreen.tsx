import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import useAuth from '../schema/UseAuth';

const Splashscreen = () => {
  const navigation = useNavigation<any>();
  const { token, isVerifying } = useAuth(navigation);
  const [verificationTimedOut, setVerificationTimedOut] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  useEffect(() => {
    if (!isVerifying) {
      setVerificationTimedOut(false);
      return;
    }
    const timeout = setTimeout(() => setVerificationTimedOut(true), 8000);
    return () => clearTimeout(timeout);
  }, [isVerifying]);

  useEffect(() => {
    if (isVerifying && !verificationTimedOut) return;
    const timer = setTimeout(() => {
      if (token) {
        navigation.navigate('cabinet_page');
      } else {
        navigation.navigate('onboarding_screen');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigation, token, isVerifying, verificationTimedOut]);

  return (
    <View style={{ flex: 1, backgroundColor: '#006968', alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar style="light" backgroundColor="#006968" />
      <View style={{ alignItems: 'center' }}>
        {/* Medical cross logo */}
        <View style={{ width: 84, height: 84, 
          backgroundColor: 'rgb(255, 255, 255)', 
          borderRadius: 26, alignItems: 'center', justifyContent: 'center', 
          // marginBottom: 24 
          }}>

  <View style={{ width: 84, height: 84, 
        // backgroundColor: '#006968',
         borderRadius: 26, 
         alignItems: 'center', 
         justifyContent: 'center', 
        //  marginBottom: 24 
         }}>
        <Image 
  source={require('../assets/images/Labtraca_Logo.png')} 
  style={{
    width: 90,              // Image width
    height: 90,             // Image height
    resizeMode: 'contain',   // Ensure icon fits in bounds
    alignSelf: 'center',      // Center the image
  }} 
/>
        {/* <View style={{ position: 'absolute', width: 16, height: 5, backgroundColor: 'white', borderRadius: 1 }} />
        <View style={{ position: 'absolute', width: 5, height: 16, backgroundColor: 'white', borderRadius: 1 }} /> */}
      </View>

          {/* <View style={{ position: 'absolute', width: 42, height: 11, backgroundColor: 'white', borderRadius: 3 }} />
          <View style={{ position: 'absolute', width: 11, height: 42, backgroundColor: 'white', borderRadius: 3 }} /> */}
        </View>
        <Text style={{ color: 'white', fontSize: 38, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8 }}>
          Labtraca
        </Text>
        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15 }}>
          Clinical Care Platform
        </Text>
      </View>
    </View>
  );
};

export default Splashscreen;
