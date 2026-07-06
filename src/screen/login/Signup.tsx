import { View, Text, TouchableOpacity, Modal, ScrollView, SafeAreaView, Image } from 'react-native';
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import styles from '../../components/utils/styles';
import CustomLabtracaInputText from '../../components/CustomLabtracaInputText';
import KeyboardAvoidingContainer from '../../components/utils/KeyboardAvoidingContainer';
import { NEW_USER_DOCTOR, NEW_USER_PHLEB } from '../../schema/ApiSchema';
import CustomAlert from '../../components/CustomAlert';
import { URL_LINK } from '../../../config';
import { useNavigation, useRoute } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import { getTermsAndConditions } from '../../schema/GetTermsAndConditions';

const loginSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  phoneNumber: Yup.number().required().positive().integer(),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
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

const Signup = () => {
  const route = useRoute<any>();
  const { userTypes } = route.params;
  const navigation = useNavigation<any>();

  const { width } = useWindowDimensions();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgDescription, setMsgDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const [userType, setUserType] = useState('Select user type');
  const [isPickerFocused, setIsPickerFocused] = useState(false);

  const getPickerBorderColor = () => {
    if (userType !== 'Select user type' && !isPickerFocused) return '#006968';
    return isPickerFocused ? '#006968' : '#CED4DA';
  };

  return (
    <Formik
      initialValues={{ firstName: '', lastName: '', email: '', password: '', phoneNumber: '', userType: '' }}
      validationSchema={loginSchema}
      onSubmit={async (values) => {
        const { firstName, lastName, email, phoneNumber, password } = values;

        const handleCreateUser = async () => {
          if (!termsAccepted) {
            setMsgTitle('Warning');
            setMsgDescription('You must accept the terms and conditions to sign up.');
            setModalVisible(true);
            return;
          }

          setLoading(true);

          const variables = {
            email: email.toLowerCase().trim(),
            phone_number: phoneNumber.trim(),
            password: password.trim(),
            user_type: userTypes === 'PHLEBOTOMIST' ? 'phlebotomist' : userTypes.toLowerCase().trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          };
          const variables_doctor = {
            email: email.toLowerCase().trim(),
            phone_number: phoneNumber.trim(),
            password: password.trim(),
            user_type: 'doctor',
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            specialization: userType.trim(),
          };

          const data = JSON.stringify({
            query: userTypes === 'DOCTOR' ? NEW_USER_DOCTOR : NEW_USER_PHLEB,
            variables: userTypes === 'DOCTOR' ? variables_doctor : variables,
          });

          try {
            const response = await fetch(URL_LINK, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: data,
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            setLoading(false);

            if (result.errors && result.errors[0].message.includes('A user with this email already exists.')) {
              setMsgTitle('Warning');
              setMsgDescription(result.errors[0].message);
              setModalVisible(true);
            } else {
              const user_id = result.data.CreateUser.user.id;
              const token = result.data.CreateUser.accessToken;
              navigation.navigate('verify_page', { user_id, token, userTypes });
            }
          } catch (error: any) {
            setLoading(false);
            setMsgTitle('Failed');
            setMsgDescription(error.message);
            setModalVisible(true);
          }
        };

        await handleCreateUser();
      }}
    >
      {({ handleChange, handleSubmit, values, errors, touched }) => (
        <KeyboardAvoidingContainer style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6FA' }}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Logo Header */}
              <View style={{ marginTop: 32, marginBottom: 32 }}>
                <BrandLogo />
              </View>

              {/* Title */}
              <View style={{ alignItems: 'center', marginBottom: 28 }}>
                <Text style={{ fontSize: 30, fontWeight: '800', color: '#1A1C1E', marginBottom: 8 }}>
                  Create Account
                </Text>
                <Text style={{ fontSize: 14, color: '#6C757D', textAlign: 'center', lineHeight: 20, paddingHorizontal: 16 }}>
                  {userTypes === 'DOCTOR'
                    ? 'Join Labtraca as a Doctor and manage your clinical practice.'
                    : userTypes === 'PHLEBOTOMIST'
                    ? 'Join Labtraca as a Phlebotomist and manage your collections.'
                    : 'Join Labtraca for seamless medical diagnostics and healthcare management.'}
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
                {/* First Name */}
                <CustomLabtracaInputText
                  title="First Name"
                  placeholder="Enter your first name"
                  keyboardType="default"
                  onChangeText={handleChange('firstName')}
                  value={values.firstName}
                  leftIcon="person-circle-outline"
                  passwordIconVisible=""
                  passwordIconHidden=""
                  backStyle={styles.containerBackGround}
                  errorMessage={touched.firstName && errors.firstName ? errors.firstName : ''}
                />

                {/* Last Name */}
                <CustomLabtracaInputText
                  title="Last Name"
                  placeholder="Enter your last name"
                  keyboardType="default"
                  onChangeText={handleChange('lastName')}
                  value={values.lastName}
                  leftIcon="person-circle-outline"
                  passwordIconVisible=""
                  passwordIconHidden=""
                  backStyle={styles.containerBackGround}
                  errorMessage={touched.lastName && errors.lastName ? errors.lastName : ''}
                />

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

                {/* Phone */}
                <CustomLabtracaInputText
                  title="Phone Number"
                  placeholder="+234 000 000 0000"
                  onChangeText={handleChange('phoneNumber')}
                  value={values.phoneNumber}
                  keyboardType="numeric"
                  leftIcon="call"
                  passwordIconVisible=""
                  passwordIconHidden=""
                  backStyle={styles.containerBackGround}
                  errorMessage={touched.phoneNumber && errors.phoneNumber ? String(errors.phoneNumber) : ''}
                />

                {/* Doctor specialty picker */}
                {userTypes === 'DOCTOR' && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ color: '#343A40', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                      Select a Specialty
                    </Text>
                    <View style={{
                      borderWidth: 1,
                      borderColor: getPickerBorderColor(),
                      borderRadius: 12,
                      backgroundColor: 'white',
                      overflow: 'hidden',
                    }}>
                      <Picker
                        selectedValue={userType}
                        style={{ color: '#1A1C1E', height: 50 }}
                        onValueChange={(itemValue) => {
                          setUserType(itemValue);
                          handleChange('userType')(itemValue);
                        }}
                        onFocus={() => setIsPickerFocused(true)}
                        onBlur={() => setIsPickerFocused(false)}
                      >
                        <Picker.Item label="Select a specialty" value="Select a specialty" />
                        <Picker.Item label="General Practice" value="General Practice" />
                        <Picker.Item label="Pathology" value="Pathology" />
                        <Picker.Item label="Family Medicine" value="Family Medicine" />
                        <Picker.Item label="Internal Medicine" value="Internal Medicine" />
                        <Picker.Item label="Pediatrics" value="Pediatrics" />
                        <Picker.Item label="Geriatrics" value="Geriatrics" />
                        <Picker.Item label="Cardiology" value="Cardiology" />
                        <Picker.Item label="Endocrinology" value="Endocrinology" />
                        <Picker.Item label="Gastroenterology" value="Gastroenterology" />
                        <Picker.Item label="Hematology" value="Hematology" />
                        <Picker.Item label="Oncology" value="Oncology" />
                        <Picker.Item label="Nephrology" value="Nephrology" />
                        <Picker.Item label="Rheumatology" value="Rheumatology" />
                        <Picker.Item label="Infectious Disease" value="Infectious Disease" />
                        <Picker.Item label="Dermatology" value="Dermatology" />
                        <Picker.Item label="Allergy and Immunology" value="Allergy and Immunology" />
                        <Picker.Item label="Obstetrics" value="Obstetrics" />
                        <Picker.Item label="Gynecology" value="Gynecology" />
                      </Picker>
                    </View>
                  </View>
                )}

                {/* Password */}
                <CustomLabtracaInputText
                  title="Password"
                  placeholder="Min. 6 characters"
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

                <View style={{ height: 8 }} />

                {/* Terms checkbox */}
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 }}
                  activeOpacity={0.8}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                >
                  <Checkbox
                    value={termsAccepted}
                    onValueChange={setTermsAccepted}
                    color={termsAccepted ? '#006968' : undefined}
                    style={{ marginTop: 2, marginRight: 10 }}
                  />
                  <Text style={{ flex: 1, fontSize: 13, color: '#6C757D', lineHeight: 20 }}>
                    I have read and agreed to the{' '}
                    <Text
                      onPress={() => setShowTermsModal(true)}
                      style={{ color: '#006968', fontWeight: '600' }}
                    >
                      Terms and Conditions
                    </Text>
                  </Text>
                </TouchableOpacity>

                {/* Submit */}
                <TouchableOpacity
                  onPress={handleSubmit as any}
                  disabled={
                    values.email.trim() === '' ||
                    values.password.trim() === '' ||
                    values.phoneNumber.trim() === '' ||
                    loading
                  }
                  style={{
                    height: 50,
                    borderRadius: 14,
                    backgroundColor:
                      values.email.trim() === '' ||
                      values.password.trim() === '' ||
                      values.phoneNumber.trim() === '' ||
                      loading
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
                    {loading ? 'Processing...' : 'Create Account'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login link */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
                <Text style={{ color: '#6C757D', fontSize: 14 }}>Already have an account? </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('login', { userTypes })}
                >
                  <Text style={{ color: '#006968', fontSize: 14, fontWeight: '700' }}>Log In</Text>
                </TouchableOpacity>
              </View>

              {/* Terms Modal */}
              <Modal
                visible={showTermsModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowTermsModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <ScrollView contentContainerStyle={{ padding: 16 }}>
                      <RenderHTML contentWidth={width} source={{ html: getTermsAndConditions() }} />
                    </ScrollView>
                    <TouchableOpacity
                      style={[styles.closeButton, { backgroundColor: '#006968' }]}
                      onPress={() => setShowTermsModal(false)}
                    >
                      <Text style={[styles.closeButtonText, { color: 'white' }]}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

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

export default Signup;
