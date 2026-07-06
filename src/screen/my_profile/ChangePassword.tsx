import { Formik } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Lock, ShieldCheck, Eye, EyeOff, Shield } from 'lucide-react-native';
import axios from 'axios';
import { CHANGE_PASSWORD } from '../../schema/ApiSchema';
import { URL_LINK } from '../../../config';
import useAuth from '../../schema/UseAuth';
import CustomAlert from '../../components/CustomAlert';

const loginSchema = Yup.object().shape({
  old_password: Yup.string()
    .min(6, 'Password must be at least 8 characters')
    .required('Password is required'),
  new_password1: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  new_password2: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const ChangePassword = ({ navigation }: { navigation: any }) => {
  const [loading, setLoad] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgDescription, setMsgDescription] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { token } = useAuth(navigation);

  return (
    <Formik
      initialValues={{ old_password: '', new_password1: '', new_password2: '' }}
      validationSchema={loginSchema}
      onSubmit={async (values, { resetForm }) => {
        setLoad(true);
        try {
          const response = await axios.post(
            URL_LINK,
            {
              query: CHANGE_PASSWORD,
              variables: {
                old_password: values.old_password,
                new_password1: values.new_password1,
                new_password2: values.new_password2,
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const result = response.data?.data?.ChangeUserPassword;

          if (result?.success) {
            resetForm();
            setMsgTitle('Success');
            setMsgDescription('Your password has been updated successfully.');
            setModalVisible(true);
          } else {
            setMsgTitle('Warning');
            setMsgDescription(
              result?.errors?.newPassword2?.[0]?.message || 'Unable to update password.'
            );
            setModalVisible(true);
          }
        } catch (error) {
          setMsgTitle('Error');
          setMsgDescription('Something went wrong. Please try again.');
          setModalVisible(true);
        } finally {
          setLoad(false);
        }
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
        const isDisabled =
          values.old_password.trim() === '' ||
          values.new_password1.trim() === '' ||
          values.new_password2.trim() === '' ||
          loading;

        return (
          <SafeAreaView edges={['top']} className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-white border-b border-gray-100 px-4 py-3.5 flex-row items-center">
              <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
                <ArrowLeft color="#005f5f" size={24} />
              </TouchableOpacity>
              <Text className="text-[#005f5f] text-lg font-bold">Change Password</Text>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
              <ScrollView
                className="flex-1 bg-[#f8fafc]"
                contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text className="text-slate-900 text-xl font-bold mb-1">Security Update</Text>
                <Text className="text-gray-500 text-sm leading-relaxed mb-6">
                  Choose a strong password you haven't used before to keep your account secure.
                </Text>

                {/* Current Password */}
                <Text className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5 ml-0.5">
                  Current Password
                </Text>
                <View className="bg-white border border-[#cbd5e1] rounded-xl flex-row items-center px-3.5 py-3 shadow-sm mb-1">
                  <Lock color="#64748b" size={18} />
                  <TextInput
                    className="flex-1 ml-2.5 text-slate-900 text-sm"
                    placeholder="Enter current password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showCurrent}
                    value={values.old_password}
                    onChangeText={handleChange('old_password')}
                    onBlur={handleBlur('old_password')}
                  />
                  <TouchableOpacity onPress={() => setShowCurrent((v) => !v)}>
                    {showCurrent ? <EyeOff color="#64748b" size={18} /> : <Eye color="#64748b" size={18} />}
                  </TouchableOpacity>
                </View>
                {touched.old_password && errors.old_password ? (
                  <Text className="text-red-500 text-xs mt-1 mb-3 ml-0.5">{errors.old_password}</Text>
                ) : (
                  <View className="mb-3" />
                )}

                {/* New Password */}
                <Text className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5 ml-0.5">
                  New Password
                </Text>
                <View className="bg-white border border-[#cbd5e1] rounded-xl flex-row items-center px-3.5 py-3 shadow-sm mb-1">
                  <Lock color="#64748b" size={18} />
                  <TextInput
                    className="flex-1 ml-2.5 text-slate-900 text-sm"
                    placeholder="Enter new password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showNew}
                    value={values.new_password1}
                    onChangeText={handleChange('new_password1')}
                    onBlur={handleBlur('new_password1')}
                  />
                  <TouchableOpacity onPress={() => setShowNew((v) => !v)}>
                    {showNew ? <EyeOff color="#64748b" size={18} /> : <Eye color="#64748b" size={18} />}
                  </TouchableOpacity>
                </View>
                {touched.new_password1 && errors.new_password1 ? (
                  <Text className="text-red-500 text-xs mt-1 mb-3 ml-0.5">{errors.new_password1}</Text>
                ) : (
                  <View className="mb-3" />
                )}

                {/* Confirm New Password */}
                <Text className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5 ml-0.5">
                  Confirm New Password
                </Text>
                <View className="bg-white border border-[#cbd5e1] rounded-xl flex-row items-center px-3.5 py-3 shadow-sm mb-1">
                  <ShieldCheck color="#64748b" size={18} />
                  <TextInput
                    className="flex-1 ml-2.5 text-slate-900 text-sm"
                    placeholder="Confirm new password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showConfirm}
                    value={values.new_password2}
                    onChangeText={handleChange('new_password2')}
                    onBlur={handleBlur('new_password2')}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm((v) => !v)}>
                    {showConfirm ? <EyeOff color="#64748b" size={18} /> : <Eye color="#64748b" size={18} />}
                  </TouchableOpacity>
                </View>
                {touched.new_password2 && errors.new_password2 ? (
                  <Text className="text-red-500 text-xs mt-1 mb-3 ml-0.5">{errors.new_password2}</Text>
                ) : (
                  <View className="mb-3" />
                )}

                {/* Encryption Badge */}
                <View className="bg-[#dbeafe]/40 border border-[#dbeafe] rounded-2xl p-4 flex-row items-center mt-2 mb-6">
                  <View className="bg-[#dbeafe]/70 w-10 h-10 rounded-full items-center justify-center mr-3">
                    <Shield color="#2563eb" size={20} />
                  </View>
                  <Text className="flex-1 text-[#1e40af] text-xs leading-relaxed">
                    Your password is encrypted end-to-end. We will never ask for your password via
                    email or phone.
                  </Text>
                </View>

                {/* Submit */}
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  disabled={isDisabled}
                  activeOpacity={0.85}
                  className={`flex-row items-center justify-center py-4 rounded-xl ${
                    isDisabled ? 'bg-gray-300' : 'bg-[#006666]'
                  }`}
                >
                  <Lock color="#ffffff" size={18} />
                  <Text className="text-white font-bold text-sm ml-2">
                    {loading ? 'Processing...' : 'Update Password'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>

            <CustomAlert
              title={msgTitle}
              msg={msgDescription}
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
            />
          </SafeAreaView>
        );
      }}
    </Formik>
  );
};

export default ChangePassword;
