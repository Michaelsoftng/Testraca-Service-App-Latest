import { View, Text, TouchableOpacity, Alert, SafeAreaView, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from '../../components/utils/styles';
import CustomLabtracaInputText from '../../components/CustomLabtracaInputText';
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer';
import CustomAlert from '../../components/CustomAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL_LINK } from '../../../config';
import { useNavigation, useRoute } from '@react-navigation/native';
import CheckForNewUpdates from '../../components/utils/checkForUpdate';
import { registerFCMToken } from '../../core/fcmNotifications';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// Inline logo component
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

const roleLabel = (userTypes: string) => {
  if (userTypes === 'DOCTOR') return 'Doctor · Access your patient dashboard';
  if (userTypes === 'PHLEBOTOMIST') return 'Phlebotomist · Manage your collections';
  if (userTypes === 'DISPATCHER' || userTypes === 'dispatcher') return 'Dispatcher · Track your deliveries';
  if (userTypes === 'pharmacist') return 'Pharmacist · Manage prescriptions';
  return 'Access your clinical reports and consultations';
};

const Login = () => {
  const route = useRoute<any>();
  const { userTypes = '' } = (route.params ?? {}) as any;
  const navigation = useNavigation<any>();

  CheckForNewUpdates();

  const [modalVisible, setModalVisible] = useState(false);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgDescription, setMsgDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgetPasswordPress = () => {
    navigation.navigate('forget_password');
  };

  const storeTokens = async (
    token: string,
    refreshToken: string,
    userType: string,
    id: string
  ) => {
    try {
      await AsyncStorage.setItem('userToken_', token);
      await AsyncStorage.setItem('refreshToken_', refreshToken);
      await AsyncStorage.setItem('userType_', userType);
      await AsyncStorage.setItem('id_', id);
      registerFCMToken().catch(() => {});
      navigation.navigate('cabinet_page', { screen: 'Ward' });
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={loginSchema}
      onSubmit={async (values) => {
        const { email, password } = values;

        const handleLogin = async () => {
          setLoading(true);
          const query = `mutation Login($email: String!, $password: String!) {
    TokenAuth(email: $email, password: $password) {
      success
      errors
      token
      refreshToken
      unarchiving
      user {
        id
        userType
      }
    }
  }`;
          const variables = { email: email.toLowerCase(), password };
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

            if (result.data && result.data.TokenAuth) {
              if (result.data.TokenAuth.success === true) {
                const { token, refreshToken } = result.data.TokenAuth;
                const { id, userType } = result.data.TokenAuth.user;
                if (
                  userType.toUpperCase() === 'PHLEBOTOMIST' ||
                  userType.toUpperCase() === 'DOCTOR' ||
                  userType.toUpperCase() === 'DISPATCHER'
                ) {
                  storeTokens(token, refreshToken, userType, id);
                } else {
                  setMsgTitle('Failed');
                  setMsgDescription('Incorrect username or password.');
                  setModalVisible(true);
                }
              } else if (result.data.TokenAuth.success === false) {
                if (result.data.TokenAuth.errors && result.data.TokenAuth.errors.nonFieldErrors) {
                  const errorCode = result.data.TokenAuth.errors.nonFieldErrors[0].code;
                  if (errorCode === 'not_verified') {
                    Alert.alert('Contact Admin for Approval', result.data.TokenAuth.errors.nonFieldErrors[0].message);
                  } else if (errorCode === 'invalid_credentials') {
                    Alert.alert('Invalid Credentials', result.data.TokenAuth.errors.nonFieldErrors[0].message);
                  } else {
                    setMsgTitle('Failed');
                    setMsgDescription('Incorrect username or password.');
                    setModalVisible(true);
                  }
                } else {
                  Alert.alert(
                    'Action Required',
                    result.data.TokenAuth.errors?.error?.message?.[0]?.message ?? 'Please verify your account.',
                    [{
                      text: 'OK',
                      onPress: async () => {
                        const resendQuery = `mutation ResendVerificationCode($user: String!) {
                              ResendVerificationCode(user: $user) {
                                success { message code }
                                errors { message code }
                                user { id userType }
                              }
                            }`;
                        const resendVariables = { user: result.data.TokenAuth.errors.user };
                        const resendData = JSON.stringify({ query: resendQuery, variables: resendVariables });
                        try {
                          const resendResponse = await fetch(URL_LINK, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: resendData,
                          });
                          if (!resendResponse.ok) throw new Error(`HTTP error! Status: ${resendResponse.status}`);
                          const resendResult = await resendResponse.json();
                          if (resendResult.data && resendResult.data.ResendVerificationCode) {
                            if (resendResult.data.ResendVerificationCode.user?.id) {
                              const user_id = resendResult.data.ResendVerificationCode.user.id;
                              const token = '';
                              Alert.alert('Success', resendResult.data.ResendVerificationCode.success.message, [{
                                text: 'OK',
                                onPress: () => navigation.navigate('verify_page', { user_id, token }),
                              }]);
                            } else if (resendResult.data.ResendVerificationCode.errors) {
                              Alert.alert('Fail', resendResult.data.ResendVerificationCode.errors[0].message);
                            } else {
                              Alert.alert('Fail', 'Unknown error');
                            }
                          } else {
                            Alert.alert('Fail', 'Invalid response');
                          }
                        } catch (error: any) {
                          Alert.alert('Error', error.message);
                        }
                      },
                    }]
                  );
                }
              } else {
                setMsgTitle('Failed');
                setMsgDescription('Incorrect username or password.');
                setModalVisible(true);
              }
            } else {
              setMsgTitle('Failed');
              setMsgDescription('Something went wrong.');
              setModalVisible(true);
            }
          } catch (err: any) {
            setLoading(false);
            if (err.message?.includes('does not exist')) {
              setMsgTitle('Warning');
              setMsgDescription(`${email} does not exist.\nPlease sign up to continue.`);
              setModalVisible(true);
            } else if (err.message?.includes('Received status code 404')) {
              setMsgTitle('Warning');
              setMsgDescription('Something went wrong,\n please try again later.');
              setModalVisible(true);
            } else {
              setMsgTitle('Failed');
              setMsgDescription('Incorrect username or password.');
              setModalVisible(true);
            }
          }
        };

        await handleLogin();
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

              {/* Title & Subtitle */}
              <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <Text style={{ color: '#1A1C1E', fontSize: 30, fontWeight: '800', marginBottom: 8 }}>
                  Log In
                </Text>
                <Text style={{ color: '#6C757D', fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
                  {roleLabel(userTypes)}
                </Text>
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
                {/* Email */}
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

                <View style={{ height: 8 }} />

                {/* Password row — label + forgot link */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ color: '#343A40', fontSize: 14, fontWeight: '600' }}>Password</Text>
                  <TouchableOpacity onPress={handleForgetPasswordPress} activeOpacity={0.7}>
                    <Text style={{ color: '#006968', fontSize: 13, fontWeight: '600' }}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                <CustomLabtracaInputText
                  title=""
                  placeholder="••••••••"
                  keyboardType="default"
                  onChangeText={handleChange('password')}
                  value={values.password}
                  isPassword={true}
                  leftIcon="key-outline"
                  passwordIconVisible="eye-off-outline"
                  passwordIconHidden="eye-outline"
                  backStyle={styles.containerBackGround}
                  errorMessage={touched.password && errors.password ? errors.password : ''}
                />

                <View style={{ height: 20 }} />

                {/* Submit */}
                <TouchableOpacity
                  onPress={handleSubmit as any}
                  disabled={values.email.trim() === '' || values.password.trim() === '' || loading}
                  style={{
                    height: 50,
                    borderRadius: 14,
                    backgroundColor:
                      values.email.trim() === '' || values.password.trim() === '' || loading
                        ? '#CBD5E1'
                        : '#006968',
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
                    {loading ? 'Processing...' : 'Log In'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sign Up Link */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 28, paddingBottom: 32 }}>
                <Text style={{ color: '#6C757D', fontSize: 14 }}>Don't have an account? </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    console.log("SASSSHSJSJHJS ::::: ", userTypes);
                    if (userTypes === 'DOCTOR') navigation.navigate('sign_up', { userTypes: 'DOCTOR' });
                    else if (userTypes === 'PHLEBOTOMIST') navigation.navigate('sign_up', { userTypes: 'PHLEBOTOMIST' });
                    else if (userTypes === 'pharmacist') navigation.navigate('sign_up', { userTypes: 'pharmacist' });
                    else if (userTypes.toLowerCase() === 'dispatcher') navigation.navigate('sign_up', { userTypes: 'dispatcher' });
                  }}
                >
                  <Text style={{ color: '#006968', fontSize: 14, fontWeight: '700' }}>Sign Up</Text>
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

export default Login;
