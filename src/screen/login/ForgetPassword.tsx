import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from '../../components/utils/styles';
import CustomLabtracaInputText from '../../components/CustomLabtracaInputText';
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer';
import { SEND_PASSWORD_RESET_EMAIL } from '../../schema/ApiSchema';
import { URL_LINK } from '../../../config';
import axios from 'axios';
import CustomAlert from '../../components/CustomAlert';
import { MaterialIcons } from '@expo/vector-icons';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
});

// Inline logo
function BrandLogo() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 30, height: 30, 
        // backgroundColor: '#006968', 
        
        borderRadius: 7, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
          <Image 
  source={require('../../assets/images/Labtraca_Logo.png')} 
  style={{
    width: 24,              // Image width
    height: 24,             // Image height
    resizeMode: 'contain'   // Ensure icon fits in bounds
  }} 
/>
        {/* <View style={{ position: 'absolute', width: 16, height: 5, backgroundColor: 'white', borderRadius: 1 }} />
        <View style={{ position: 'absolute', width: 5, height: 16, backgroundColor: 'white', borderRadius: 1 }} /> */}
      </View>
      <Text style={{ color: '#006968', fontWeight: '800', fontSize: 20, letterSpacing: 0.5 }}>Labtraca</Text>
    </View>
  );
}

const ForgetPassword = ({ navigation }: { navigation: any }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgDescription, setMsgDescription] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={loginSchema}
      onSubmit={async (values) => {
        const { email } = values;

        const handleCreateUser = async () => {
          setLoading(true);

          const variables_ = { email: email.toLowerCase() };
          const data = JSON.stringify({ query: SEND_PASSWORD_RESET_EMAIL, variables: variables_ });

          const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: URL_LINK,
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer token' },
            data,
          };

          axios.request(config)
            .then((response) => {
              const result = response.data;
              setLoading(false);
              if (result.data.SendPasswordResetEmail.success) {
                setMsgTitle('Successful');
                setMsgDescription('Reset password link has been sent to your email.');
                setModalVisible(true);
              } else {
                setMsgTitle('Warning');
                setMsgDescription('Something went wrong, try again.');
                setModalVisible(true);
              }
            })
            .catch((error) => {
              setLoading(false);
              setMsgTitle('Failed');
              setMsgDescription(error.message);
              setModalVisible(true);
            });
        };

        await handleCreateUser();
      }}
    >
      {({ handleChange, handleSubmit, values, errors, touched }) => (
        <KeyboardAvoidingContainer style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F8FA' }}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Logo Header */}
              <View style={{ marginTop: 32, marginBottom: 40 }}>
                <BrandLogo />
              </View>

              {/* Form Card */}
              <View style={{
                backgroundColor: 'white',
                borderRadius: 20,
                padding: 24,
                borderWidth: 1,
                borderColor: '#E9ECEF',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}>
                {/* Back button */}
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{
                    borderWidth: 1,
                    borderColor: '#E9ECEF',
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                  }}
                >
                  <MaterialIcons name="arrow-back" size={18} color="#6C757D" />
                </TouchableOpacity>

                {/* Badge */}
                <View style={{ backgroundColor: '#E6F0F0', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999, marginBottom: 12 }}>
                  <Text style={{ color: '#006968', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }}>FORGOT PASSWORD</Text>
                </View>

                <Text style={{ fontSize: 28, fontWeight: '800', color: '#1A1C1E', marginBottom: 8 }}>
                  Forgot Password?
                </Text>
                <Text style={{ color: '#6C757D', fontSize: 14, marginBottom: 24, lineHeight: 20 }}>
                  Enter the email address associated with your account and we'll send you a reset link.
                </Text>

                <CustomLabtracaInputText
                  title="Email Address"
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  onChangeText={handleChange('email')}
                  value={values.email}
                  leftIcon="mail-outline"
                  passwordIconVisible=""
                  passwordIconHidden=""
                  backStyle={styles.containerBackGround}
                  errorMessage={touched.email && errors.email ? errors.email : ''}
                />

                <View style={{ height: 20 }} />

                {/* Submit */}
                <TouchableOpacity
                  onPress={handleSubmit as any}
                  disabled={values.email.trim() === '' || loading}
                  style={{
                    height: 50,
                    borderRadius: 14,
                    backgroundColor: values.email.trim() === '' || loading ? '#CBD5E1' : '#006968',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#006968',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: loading ? 0 : 0.2,
                    shadowRadius: 6,
                    elevation: loading ? 0 : 3,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>
                    {loading ? 'Processing...' : 'Send Reset Link'}
                  </Text>
                </TouchableOpacity>

                {/* Back to login */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('login')}
                  style={{ marginTop: 24, alignItems: 'center' }}
                >
                  <Text style={{ color: '#6C757D', fontSize: 14, fontWeight: '500' }}>
                    Remember your password?{' '}
                    <Text style={{ color: '#006968', fontWeight: '700' }}>Log In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <CustomAlert
              title={msgTitle}
              msg={msgDescription}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
            />
          </SafeAreaView>
        </KeyboardAvoidingContainer>
      )}
    </Formik>
  );
};

export default ForgetPassword;
