import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, ScrollView, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomAlert from '../../components/CustomAlert';
import { URL_LINK } from '../../../config';
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer';

const validationSchema = Yup.object().shape({
  code: Yup.string()
    .required('Code is required')
    .length(4, 'Code must be exactly 4 digits'),
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

const Verify = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [userID, setUserID] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgDescription, setMsgDescription] = useState('');

  const { user_id, token, userTypes } = route.params;

  useEffect(() => {
    setUserID(user_id);
  }, [user_id]);

  const handleInputChange = (index: number, value: string, setFieldValue: any, values: any) => {
    if (/^\d*$/.test(value)) {
      const newCodeArray = values.code.split('').concat(Array(4 - values.code.length).fill(''));
      newCodeArray[index] = value;

      const enteredCode = newCodeArray.join('');
      setFieldValue('code', enteredCode);

      if (value !== '' && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
      if (value === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleResendCode = async () => {
    const query = `
      mutation ResendVerificationCode($user: ID!) {
        ResendVerificationCode(user: $user) {
          success { message code }
          errors { message code }
          user { id userType }
        }
      }`;
    const variables = { user: userID };
    const data = JSON.stringify({ query, variables });

    try {
      const response = await fetch(URL_LINK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();

      if (result.data.ResendVerificationCode.success !== null) {
        Alert.alert('Success', result.data.ResendVerificationCode.success.message);
      } else {
        Alert.alert('Failed', 'Unable to resend code, please try again later');
      }
    } catch (error: any) {
      setMsgTitle('Failed');
      setMsgDescription(error.message);
      setModalVisible(true);
    }
  };

  return (
    <Formik
      initialValues={{ code: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        const { code } = values;

        const handleVerifyUser = async () => {
          setLoading(true);
          const query = `
            mutation VerifyAccount($user: String!, $token: Int!) {
              VerifyUserAccount(user: $user, token: $token) {
                success { message code }
                errors { message code }
                user { id userType }
              }
            }`;
          const variables = { user: userID, token: code };
          const data = JSON.stringify({ query, variables });

          try {
            const response = await fetch(URL_LINK, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: data,
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            setLoading(false);

            if (result.data.VerifyUserAccount.success === null) {
              setMsgTitle('Warning');
              setMsgDescription(result.data.VerifyUserAccount.errors.message);
              setModalVisible(true);
            } else {
              Alert.alert('Success', result.data.VerifyUserAccount.success.message, [{
                text: 'OK',
                onPress: () => navigation.navigate('login', { userTypes }),
              }]);
            }
          } catch (err: any) {
            setLoading(false);
            setMsgTitle('Failed');
            setMsgDescription(err.message);
            setModalVisible(true);
          }
        };

        await handleVerifyUser();
      }}
    >
      {({ handleSubmit, values, errors, touched, setFieldValue }) => (
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
                  <Ionicons name="arrow-back" size={18} color="#6C757D" />
                </TouchableOpacity>

                {/* Badge */}
                <View style={{ backgroundColor: '#E6F0F0', alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999, marginBottom: 12 }}>
                  <Text style={{ color: '#006968', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }}>CONFIRM OTP</Text>
                </View>

                <Text style={{ fontSize: 28, fontWeight: '800', color: '#1A1C1E', marginBottom: 8 }}>
                  Verification
                </Text>
                <Text style={{ color: '#6C757D', fontSize: 14, marginBottom: 32, lineHeight: 20 }}>
                  Enter the 4-digit code sent to your email address to complete verification.
                </Text>

                {/* OTP boxes */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  {Array(4).fill('').map((_, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => { inputRefs.current[index] = ref; }}
                      style={{
                        width: 64,
                        height: 64,
                        borderWidth: 1.5,
                        borderRadius: 16,
                        textAlign: 'center',
                        fontSize: 24,
                        fontWeight: '700',
                        color: '#1A1C1E',
                        backgroundColor: 'white',
                        borderColor:
                          errors.code && touched.code
                            ? '#DC3545'
                            : values.code[index]
                            ? '#006968'
                            : '#CED4DA',
                      }}
                      keyboardType="numeric"
                      maxLength={1}
                      value={values.code[index] || ''}
                      onChangeText={(value) => handleInputChange(index, value, setFieldValue, values)}
                    />
                  ))}
                </View>

                {errors.code && touched.code && (
                  <Text style={{ color: '#DC3545', fontSize: 13, marginBottom: 8 }}>{errors.code}</Text>
                )}

                <View style={{ height: 24 }} />

                {/* Submit */}
                <TouchableOpacity
                  onPress={handleSubmit as any}
                  disabled={values.code.length < 4 || loading}
                  style={{
                    height: 50,
                    borderRadius: 14,
                    backgroundColor: values.code.length < 4 || loading ? '#CBD5E1' : '#006968',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#006968',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: loading || values.code.length < 4 ? 0 : 0.2,
                    shadowRadius: 6,
                    elevation: loading || values.code.length < 4 ? 0 : 3,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </Text>
                </TouchableOpacity>

                {/* Resend */}
                <TouchableOpacity onPress={handleResendCode} style={{ marginTop: 20, alignItems: 'center' }}>
                  <Text style={{ color: '#006968', fontSize: 14, fontWeight: '700' }}>
                    Didn't receive a code? Resend
                  </Text>
                </TouchableOpacity>

                {/* Back to login */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('onboarding_screen')}
                  style={{ marginTop: 16, alignItems: 'center' }}
                >
                  <Text style={{ color: '#6C757D', fontSize: 14 }}>
                    Already have an account?{' '}
                    <Text style={{ color: '#006968', fontWeight: '700' }}>Log In</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              <CustomAlert
                title={msgTitle}
                msg={msgDescription}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
              />
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingContainer>
      )}
    </Formik>
  );
};

export default Verify;
