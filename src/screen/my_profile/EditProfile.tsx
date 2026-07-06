import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Camera, Calendar, ChevronDown, ChevronRight, X, MapPin, ArrowLeft, Settings, Lock, CheckCircle2 } from "lucide-react-native";
import axios from "axios";
import { URL_LINK } from "../../../config";
import { UPDATE_PHLEBO_DOC } from "../../schema/ApiSchema";
import useAuth from "../../schema/UseAuth";
import { useGetUserDetails } from "../../hook/useGetUserDetails";
import { GOOGLE_MAPS_API_KEY } from "../../../config";
type InputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

type PlacePrediction = {
  place_id: string;
  main_text: string;
  secondary_text: string;
  description: string;
};

type PlaceDetails = {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: Array<{
    long_name: string;
    types: string[];
  }>;
};

function InputField({ label, value, onChangeText, placeholder }: InputProps) {
  return (
    <View className="mb-4">
      <Text className="text-xs font-bold text-slate-700 mb-1">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A3A3A3"
        className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/30 text-sm font-medium text-slate-900"
      />
    </View>
  );
}

export default function EditProfile() {
  const navigation = useNavigation<any>();
  const { token } = useAuth(navigation);
  const { userData, reloadUserDetails } = useGetUserDetails();

  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [email, setEmail] = useState(userData?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || "");
  const [location, setLocation] = useState(userData?.location || "");
  const [latitude, setLatitude] = useState<number | null>(userData?.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(userData?.longitude || null);
  const [saving, setSaving] = useState(false);

  // Location modal state
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [addressInput, setAddressInput] = useState(location);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const debounceTimer = useRef<any>(null);

  const initials = useMemo(() => {
    const first = String(firstName?.[0] || userData?.firstName?.[0] || "A").toUpperCase();
    const second = String(lastName?.[0] || userData?.lastName?.[0] || "").toUpperCase();
    return (first + second).slice(0, 2);
  }, [firstName, lastName, userData?.firstName, userData?.lastName]);

  // Google Places Autocomplete
  const fetchAutocompletePredictions = async (input: string) => {
    if (!input.trim() || input.length < 3) {
      setPredictions([]);
      return;
    }

    try {
      setLoadingPredictions(true);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input,
            key: GOOGLE_MAPS_API_KEY, // Replace with actual key from config.js
            components: "country:ng", // Restrict to Nigeria if needed
          },
        }
      );
      setPredictions(
        response.data.predictions.map((p: any) => ({
          place_id: p.place_id,
          main_text: p.structured_formatting?.main_text || p.description,
          secondary_text: p.structured_formatting?.secondary_text || "",
          description: p.description,
        }))
      );
    } catch (error) {
      console.error("Autocomplete error:", error);
      setPredictions([]);
    } finally {
      setLoadingPredictions(false);
    }
  };

  const handleAddressInputChange = (text: string) => {
    setAddressInput(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchAutocompletePredictions(text);
    }, 300);
  };

  const fetchPlaceDetails = async (placeId: string, description: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: GOOGLE_MAPS_API_KEY, // Replace with actual key
            fields: "formatted_address,geometry,address_components",
          },
        }
      );

      const details: PlaceDetails = response.data.result;
      const formattedAddress = details.formatted_address || description;
      const lat = details.geometry?.location?.lat;
      const lng = details.geometry?.location?.lng;

      setLocation(formattedAddress);
      setLatitude(lat);
      setLongitude(lng);
      setAddressInput(formattedAddress);
      setPredictions([]);
      setShowLocationModal(false);
    } catch (error) {
      console.error("Place details error:", error);
      Alert.alert("Error", "Could not fetch location details. Please try again.");
    }
  };

  const onSave = async () => {
    if (!userData?.id) {
      Alert.alert("Update failed", "User profile is not ready yet.");
      return;
    }

    if (!firstName.trim()) {
      Alert.alert("Validation", "Please enter your first name.");
      return;
    }

    try {
      setSaving(true);
      await axios.post(
        URL_LINK,
        {
          query: UPDATE_PHLEBO_DOC,
          variables: {
            userId: userData.id,
            updateData: {
              firstName,
              lastName,
              email,
              phoneNumber,
              location,
              latitude,
              longitude,
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      reloadUserDetails();
      Alert.alert("Success", "Profile updated successfully.");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Update failed", error?.message || "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white border-b border-slate-100 px-4 py-3 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-9 h-9 rounded-full bg-slate-50 items-center justify-center">
          <ArrowLeft size={18} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-slate-900">Edit Profile</Text>
        <Settings size={20} color="#0F172A" />
      </View>

      {/* Location Modal */}
      <Modal visible={showLocationModal} animationType="slide" onRequestClose={() => setShowLocationModal(false)}>
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-slate-100">
            <Text className="text-lg font-bold text-slate-900">Select Location</Text>
            <TouchableOpacity onPress={() => setShowLocationModal(false)}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View className="px-4 py-3">
            <View className="flex-row items-center border border-slate-300 rounded-lg px-3">
              <MapPin size={20} color="#64748b" />
              <TextInput
                placeholder="Search address..."
                placeholderTextColor="#A3A3A3"
                value={addressInput}
                onChangeText={handleAddressInputChange}
                className="flex-1 py-3 ml-2 text-slate-700"
              />
              {addressInput ? (
                <TouchableOpacity onPress={() => { setAddressInput(""); setPredictions([]); }}>
                  <X size={18} color="#94A3B8" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {loadingPredictions ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#0D9488" />
            </View>
          ) : predictions.length > 0 ? (
            <FlatList
              data={predictions}
              keyExtractor={(item) => item.place_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => fetchPlaceDetails(item.place_id, item.description)}
                  className="px-4 py-3 border-b border-slate-100"
                >
                  <Text className="font-semibold text-slate-900">{item.main_text}</Text>
                  {item.secondary_text ? (
                    <Text className="text-sm text-slate-500 mt-1">{item.secondary_text}</Text>
                  ) : null}
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingTop: 8 }}
            />
          ) : addressInput ? (
            <View className="items-center py-8">
              <Text className="text-slate-500">No locations found</Text>
            </View>
          ) : (
            <View className="items-center py-8">
              <Text className="text-slate-500">Type an address to search</Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Avatar Section */}
        <View className="items-center mt-6 mb-8">
          <View className="relative">
            <View className="w-24 h-24 bg-teal-700 border-2 border-teal-600/30 items-center justify-center rounded-full">
              <Text className="text-white text-4xl font-bold">{initials}</Text>
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 bg-teal-800 w-8 h-8 rounded-full items-center justify-center border-2 border-white">
              <Camera size={14} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="mt-4 text-xl font-semibold text-slate-800">
            {`${firstName} ${lastName}`.trim() || "User"}
          </Text>
          <Text className="text-slate-500">{email || userData?.email || ""}</Text>
          <Text className="text-slate-400 text-xs uppercase tracking-widest mt-1">Phlebotomy Specialist</Text>
        </View>

        {/* Personal Information Form */}
        <View className="mx-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
          <Text className="text-slate-500 font-bold mb-4 text-base">Personal Information</Text>

          <InputField label="First Name" value={firstName} onChangeText={setFirstName} placeholder="First name" />
          <InputField label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Last name" />
          <InputField label="Email" value={email} onChangeText={setEmail} placeholder="your@email.com" />
          <InputField label="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} placeholder="+234..." />

          {/* Date of Birth */}
          <View className="flex-row justify-between">
            <View className="w-[48%]">
              <Text className="text-xs font-bold text-slate-700 mb-1">Date of Birth</Text>
              <TouchableOpacity className="flex-row items-center justify-between border border-slate-200 rounded-xl p-3.5 bg-slate-50/30">
                <Calendar size={18} color="#94A3B8" />
                <Text className="text-sm font-medium text-slate-900">{userData?.dateOfBirth || "--/--/----"}</Text>
                <ChevronDown size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Gender */}
            <View className="w-[48%]">
              <Text className="text-xs font-bold text-slate-700 mb-1">Gender</Text>
              <TouchableOpacity className="flex-row items-center justify-between border border-slate-200 rounded-xl p-3.5 bg-slate-50/30">
                <Text className="text-sm font-medium text-slate-400">Select gender</Text>
                <ChevronDown size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Location Field with Modal */}
          <View className="mt-4">
            <Text className="text-xs font-bold text-slate-700 mb-1">Address</Text>
            <TouchableOpacity
              onPress={() => setShowLocationModal(true)}
              className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/30 flex-row items-center justify-between"
            >
              <Text className="text-sm font-medium text-slate-900 flex-1 pr-2" numberOfLines={1}>
                {location || "Tap to enter address"}
              </Text>
              <ChevronDown size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Display Coordinates (for debugging/confirmation) */}
          {latitude && longitude ? (
            <View className="mt-3 bg-slate-50 p-2 rounded">
              <Text className="text-xs text-slate-600">
                📍 {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Change Password */}
        <TouchableOpacity
          onPress={() => navigation.navigate("change_password")}
          className="mx-4 mt-4 bg-white border border-slate-100 rounded-2xl shadow-sm p-4 flex-row justify-between items-center"
        >
          <View className="flex-row items-center">
            <Lock size={18} color="#0D9488" />
            <Text className="ml-3 text-sm font-bold text-slate-900">Change Password</Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>
      </ScrollView>

      {/* Footer Buttons */}
      <View className="px-4 py-4 bg-white border-t border-slate-100 mb-4 flex-row">
        <TouchableOpacity
          className="flex-1 mr-2 py-4 rounded-xl items-center border border-slate-200 bg-white"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-slate-700 font-bold text-base">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 ml-2 py-4 rounded-xl flex-row justify-center items-center ${saving ? "bg-teal-300" : "bg-teal-800"}`}
          onPress={onSave}
          disabled={saving}
        >
          {!saving && <CheckCircle2 size={18} color="white" />}
          <Text className="text-white font-bold text-base ml-2">{saving ? "Saving..." : "Save Changes"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
