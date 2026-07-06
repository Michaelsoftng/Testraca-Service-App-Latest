import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GET_CONSULTATION_BY_CONSULTATION_ID,
  GET_RESULT_REVIEW_BY_ID,
  UPDATE_CONSULTATION_REQUEST,
  UPDATE_RESULT_REVIEW,
} from '../../../../schema/ApiSchema';
import axios from 'axios';
import { URL_LINK } from '../../../../../config';
import { useGetUserDetails } from '../../../../hook/useGetUserDetails';
import { ArrowLeft, History, Info, PlusCircle, ChevronDown, ShieldCheck, Send } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

type PrescriptionModalProps = {
  name?: string;
  types?: string;
  consultationId?: string;
  resultReviewId?: string;
  onSubmitted?: (consultation?: any) => void;
  mode?: 'prescription' | 'note';
  submissionType?: 'consultation' | 'resultReview';
};

const parsePrescriptionLines = (value: any) => {
  if (Array.isArray(value)) {
    const lines = value.map((item) => String(item || '').trim()).filter(Boolean);
    return lines.length > 0 ? lines : [''];
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [''];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        const lines = parsed.map((item) => String(item || '').trim()).filter(Boolean);
        return lines.length > 0 ? lines : [''];
      }
    } catch {
      // fall through
    }
    return trimmed
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .concat([''])
      .slice(0, Math.max(1, trimmed.split(/\n+/).length));
  }

  return [''];
};

export default function WritePrescription({
  name = '',
  types = '',
  consultationId = '',
  resultReviewId = '',
  onSubmitted,
  mode = 'prescription',
  submissionType = 'consultation',
}: PrescriptionModalProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isClickLoading, setIsClickLoading] = useState(false);
  const [consultationDetails, setConsultationDetails] = useState<any>(null);
  const [diagnosis, setDiagnosis] = useState(types || '');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [prescriptionItems, setPrescriptionItems] = useState<string[]>(['']);
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');
  const [instructions, setInstructions] = useState('');
  const { userData } = useGetUserDetails();

  const isResultReviewMode = submissionType === 'resultReview' || !!resultReviewId;
  const targetRecordId = isResultReviewMode ? resultReviewId : consultationId;

  useEffect(() => {
    AsyncStorage.getItem('userToken_').then(setToken);
  }, []);

  useEffect(() => {
    const loadConsultation = async () => {
      if (!targetRecordId || !token) {
        return;
      }

      try {
        const queryToUse = isResultReviewMode ? GET_RESULT_REVIEW_BY_ID : GET_CONSULTATION_BY_CONSULTATION_ID;
        const variables = isResultReviewMode ? { id: targetRecordId } : { id: targetRecordId };

        const response = await axios.post(
          URL_LINK,
          {
            query: queryToUse,
            variables,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: '*/*',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const consultation = isResultReviewMode
          ? response?.data?.data?.getResultReviewById
          : response?.data?.data?.getConsultationById;
        if (!consultation) {
          return;
        }

        setConsultationDetails(consultation);
        setDiagnosis(consultation.doctorsReport || types || consultation.purpose || consultation.currentSyptoms || '');
        setDoctorNotes('');
        setPrescriptionItems(parsePrescriptionLines(consultation.prescription));
      } catch (error: any) {
        console.error('Failed to load consultation details', error?.message || error);
      }
    };

    loadConsultation();
  }, [targetRecordId, token, types, isResultReviewMode]);

  const patientName = useMemo(() => {
    return (
      name ||
      [
        consultationDetails?.patient?.user?.firstName,
        consultationDetails?.patient?.user?.lastName,
        consultationDetails?.patient?.firstName,
        consultationDetails?.patient?.lastName,
      ]
        .filter(Boolean)
        .slice(0, 2)
        .join(' ') ||
      'Patient'
    );
  }, [consultationDetails, name]);

  const consultationSuffix = useMemo(() => {
    const value = String(targetRecordId || consultationDetails?.id || '');
    if (!value) return 'N/A';
    const split = value.split('-');
    return split[split.length - 1] || value;
  }, [consultationDetails?.id, targetRecordId]);

  const idLabel = isResultReviewMode ? 'Result Review' : 'Consultation';

  const updatePrescriptionItem = (index: number, value: string) => {
    setPrescriptionItems((prev) => prev.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const addPrescriptionField = () => {
    setPrescriptionItems((prev) => [...prev, '']);
  };

  const removePrescriptionField = (index: number) => {
    setPrescriptionItems((prev) => {
      if (prev.length === 1) {
        return [''];
      }
      return prev.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const handleSubmit = async () => {
    if (!targetRecordId) {
      Alert.alert('Error', `${idLabel} ID is missing.`);
      return;
    }

    if (!token) {
      Alert.alert('Error', 'You are not authenticated.');
      return;
    }

    const normalizedDiagnosis = diagnosis.trim();
    const normalizedNotes = doctorNotes.trim();
    const normalizedPrescriptions = prescriptionItems.map((item) => item.trim()).filter(Boolean);

    if (mode === 'prescription' && normalizedPrescriptions.length === 0) {
      Alert.alert('Error', 'Add at least one medication line before submitting.');
      return;
    }

    if (mode === 'note' && !normalizedDiagnosis && !normalizedNotes && normalizedPrescriptions.length === 0) {
      Alert.alert('Error', 'Enter a diagnosis, note, or prescription before submitting.');
      return;
    }

    setIsClickLoading(true);
    try {
      if (isResultReviewMode) {
        const response = await axios.post(
          URL_LINK,
          {
            query: UPDATE_RESULT_REVIEW,
            variables: {
              resultReviewId: targetRecordId,
              updateData: {
                purpose: consultationDetails?.purpose || 'Second opinion on lipid panel',
                medicalhistory: consultationDetails?.medicalhistory || 'Hypertension',
                otherdetails: normalizedNotes || consultationDetails?.otherdetails || 'Patient reports mild dizziness',
                currentSyptoms: consultationDetails?.currentSyptoms || 'Headache',
                requestedDuration: consultationDetails?.requestedDuration || 30,
                requestedDoctorType:
                  consultationDetails?.requestedDoctorType || userData?.doctor?.specialization || 'Cardiologist',
                ...(normalizedPrescriptions.length > 0 ? { prescription: normalizedPrescriptions } : {}),
                doctorsReport: normalizedDiagnosis,
                status: 'result_review_complete',
              },
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

        const updatedResultReview = response?.data?.data?.UpdateResultReview?.resultReview;
        if (!updatedResultReview?.id) {
          const serverMessage = response?.data?.errors?.[0]?.message || 'Unable to save result review.';
          throw new Error(serverMessage);
        }

        const mergedResultReview = {
          ...(consultationDetails || {}),
          ...updatedResultReview,
          doctorsReport: normalizedDiagnosis,
          otherdetails: normalizedNotes,
          prescription:
            normalizedPrescriptions.length > 0
              ? normalizedPrescriptions
              : consultationDetails?.prescription ?? updatedResultReview?.prescription,
        };

        setConsultationDetails(mergedResultReview);
        Alert.alert('Success', mode === 'note' ? 'Result review note saved successfully.' : 'Result review saved successfully.');
        if (typeof onSubmitted === 'function') {
          onSubmitted(mergedResultReview);
        }
        return;
      }

      const response = await axios.post(
        URL_LINK,
        {
          query: UPDATE_CONSULTATION_REQUEST,
          variables: {
            consultationId: targetRecordId,
            updateData: {
              ...(normalizedPrescriptions.length > 0 ? { prescription: normalizedPrescriptions } : {}),
              doctorsReport: normalizedDiagnosis,
              otherdetails: normalizedNotes,
            },
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

      const updatedConsultation = response?.data?.data?.UpdateConsultation?.consultation;
      if (!updatedConsultation?.id) {
        const serverMessage = response?.data?.errors?.[0]?.message || 'Unable to save details.';
        throw new Error(serverMessage);
      }

      const mergedConsultation = {
        ...(consultationDetails || {}),
        ...updatedConsultation,
        doctorsReport: normalizedDiagnosis,
        otherdetails: normalizedNotes,
        prescription: normalizedPrescriptions,
      };

      setConsultationDetails(mergedConsultation);
      Alert.alert('Success', mode === 'note' ? 'Note saved successfully.' : 'Prescription saved successfully.');
      if (typeof onSubmitted === 'function') {
        onSubmitted(mergedConsultation);
      }
    } catch (error: any) {
      const serverMessage = error?.response?.data?.errors?.[0]?.message || error?.message || 'Unable to save details.';
      console.error('Prescription submit error:', serverMessage);
      Alert.alert('Error', serverMessage);
    } finally {
      setIsClickLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a1f2c]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-[#f4f7f9]"
      >
        {/* --- TOP BRANDED HEADER --- */}
        <View className="bg-[#1a1f2c] px-4 pt-3 pb-4 flex-row items-center justify-between">
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity className="p-1 mr-2">
              <ArrowLeft color="#ffffff" size={24} />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">Write Prescription</Text>
          </View>
          
          <TouchableOpacity className="p-1">
            <History color="#ffffff" size={22} />
          </TouchableOpacity>
        </View>

        {/* --- MAIN SCROLLABLE APP BODY --- */}
        <ScrollView className="flex-1 px-4 pt-5" showsVerticalScrollIndicator={false}>
          
          {/* --- PATIENT HEADER TOP TICKET CARD --- */}
          <View className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex-row justify-between items-center mb-5">
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-base">{patientName}</Text>
              <View className="flex-row items-center flex-wrap mt-1">
                <Text className="text-gray-500 text-sm font-medium">42 Years</Text>
                <View className="w-[1px] h-3 bg-gray-300 mx-3" />
                <Text className="text-gray-500 text-sm font-medium">Female</Text>
                <View className="w-[1px] h-3 bg-gray-300 mx-3" />
                <Text className="text-[#008b8b] text-sm font-bold">#{consultationSuffix}</Text>
              </View>
            </View>

            <TouchableOpacity className="bg-gray-500/20 p-2.5 rounded-xl">
              <Info color="#4b5563" size={20} />
            </TouchableOpacity>
          </View>

          {/* --- SECTION 1: DIAGNOSIS & OBSERVATIONS --- */}
          <Text className="text-gray-500 text-xs font-black tracking-wider uppercase mb-2">
            Diagnosis & Observations
          </Text>
          <View className="bg-white border border-gray-300 rounded-xl mb-5 p-1 overflow-hidden">
            <TextInput
              className="w-full min-h-[110px] p-3 text-gray-800 text-sm align-top"
              placeholder="Enter patient diagnosis, clinical findings, and observations..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={diagnosis}
              onChangeText={setDiagnosis}
            />
          </View>

          {/* --- SECTION 2: MEDICATIONS LAYOUT --- */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-500 text-xs font-black tracking-wider uppercase">
              Medications
            </Text>
            <TouchableOpacity className="flex-row items-center space-x-1" onPress={addPrescriptionField}>
              <PlusCircle color="#008b8b" size={16} />
              <Text className="text-[#008b8b] text-xs font-bold ml-1">ADD MEDICATION</Text>
            </TouchableOpacity>
          </View>

          {/* Medication Input Embedded Form Container */}
          <View className="bg-white border border-gray-300 rounded-xl p-4 mb-5 shadow-sm">
            
            {/* Input fields: Medicine Name */}
            <Text className="text-gray-500 text-xs font-bold mb-1.5">Medication Name</Text>
            <TextInput
              className="bg-[#f0f2fc] w-full px-3 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm mb-4"
              placeholder="e.g. Amoxicillin 500mg"
              placeholderTextColor="#94a3b8"
              value={medName}
              onChangeText={setMedName}
            />

            {/* Sub-form row: Dosage, Frequency, Duration */}
            <View className="flex-row space-x-2.5">
              
              {/* Dosage Column Block */}
              <View className="flex-1 mr-1">
                <Text className="text-gray-500 text-xs font-bold mb-1.5">Dosage</Text>
                <TextInput
                  className="bg-[#f0f2fc] w-full px-3 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm text-center"
                  placeholder="1 tab"
                  placeholderTextColor="#94a3b8"
                  value={dosage}
                  onChangeText={setDosage}
                />
              </View>

              {/* Frequency Column Block */}
              <View className="flex-1 mx-1">
                <Text className="text-gray-500 text-xs font-bold mb-1.5">Frequency</Text>
                <TouchableOpacity className="bg-[#f0f2fc] w-full px-3 py-3 rounded-xl border border-gray-200 flex-row items-center justify-between">
                  <Text className="text-gray-800 text-sm flex-1 text-center font-medium">Once daily</Text>
                  <ChevronDown color="#64748b" size={14} />
                </TouchableOpacity>
              </View>

              {/* Duration Column Block */}
              <View className="flex-1 ml-1">
                <Text className="text-gray-500 text-xs font-bold mb-1.5">Duration</Text>
                <TextInput
                  className="bg-[#f0f2fc] w-full px-3 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm text-center"
                  placeholder="7 days"
                  placeholderTextColor="#94a3b8"
                  value={duration}
                  onChangeText={setDuration}
                />
              </View>

            </View>

          </View>

          {/* Medication Items List */}
          {prescriptionItems.length > 0 && (
            <View className="mb-5">
              <Text className="text-gray-500 text-xs font-black tracking-wider uppercase mb-2">
                Prescription Lines
              </Text>
              {prescriptionItems.map((item, index) => (
                <View key={`prescription-${index}`} className="mb-3">
                  <View className="bg-white border border-gray-300 rounded-xl p-3">
                    <TextInput
                      className="text-gray-800 text-sm"
                      placeholder={`Medication line ${index + 1}`}
                      onChangeText={(value) => updatePrescriptionItem(index, value)}
                      value={item}
                      placeholderTextColor="#94a3b8"
                      multiline
                    />
                  </View>
                  {prescriptionItems.length > 1 && (
                    <TouchableOpacity onPress={() => removePrescriptionField(index)} className="mt-1 px-2 py-1">
                      <Text className="text-red-500 text-xs font-bold">Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* --- SECTION 3: ADDITIONAL INSTRUCTIONS --- */}
          <Text className="text-gray-500 text-xs font-black tracking-wider uppercase mb-2">
            Additional Instructions
          </Text>
          <View className="bg-white border border-gray-300 rounded-xl mb-5 p-1 overflow-hidden">
            <TextInput
              className="w-full min-h-[85px] p-3 text-gray-800 text-sm align-top"
              placeholder="E.g. Take after meals, avoid dairy, follow up in 2 weeks..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={instructions}
              onChangeText={setInstructions}
            />
          </View>

          {/* --- SECTION 4: DIGITAL SIGNATURE PANEL --- */}
          <View className="bg-[#ebdffc]/50 border border-[#c0a8f0]/40 rounded-xl p-4 flex-row items-center justify-between mb-16">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="bg-[#dbeafe] p-2 rounded-xl mr-3">
                <ShieldCheck color="#008b8b" size={22} strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="text-[#008b8b] text-[11px] font-black tracking-wider uppercase">
                  Digital Signature Active
                </Text>
                <Text className="text-gray-600 text-xs font-bold mt-0.5" numberOfLines={2}>
                  Dr. {userData?.lastName || "Doctor"} • Reg: #MD-{userData?.id?.slice(-4)}
                </Text>
              </View>
            </View>

            {/* Vector Signature Line Rendering */}
            <View className="w-20 h-10 justify-center items-center">
              <Svg height="100%" width="100%" viewBox="0 0 100 40">
                <Path
                  d="M 10,25 Q 25,10 40,22 T 70,15 T 90,20"
                  fill="transparent"
                  stroke="#008b8b"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Svg>
            </View>
          </View>

        </ScrollView>

        {/* --- FIXED SUBMIT ACTION BOTTOM CONTROL PANEL --- */}
        <View className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <TouchableOpacity 
            className="bg-[#008b8b] w-full py-4 rounded-xl flex-row items-center justify-center shadow-md active:opacity-95"
            onPress={handleSubmit}
            disabled={isClickLoading}
          >
            <Send color="#ffffff" size={16} strokeWidth={2.5} />
            <Text className="text-white font-bold text-base ml-2.5">
              {isClickLoading ? 'Submitting...' : 'Submit Prescription'}
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
