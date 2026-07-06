import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, CheckCircle2, Copy, MapPin } from "lucide-react-native";
import axios from "axios";
import useAuth from "../../../schema/UseAuth";
import { URL_LINK } from "../../../../config";
import {
  CONFIRM_REQUEST_DROP_OFF,
  GET_COUNTRIES,
  GET_DROP_OFF_LOCATION,
  GET_LOCATION_BY_STATE,
  GET_STATE,
  SET_REQUEST_DELIVERY_MODE,
  SET_SELECT_REQUEST_DROP_OFF_LOCATION,
} from "../../../schema/ApiSchema";
import SearchablePicker from "../../../components/SearchablePicker";
import BottomTabs from "../../../components/BottomTabs";
import { useToast } from "../../../lib/utils/functions";

type PickerItem = {
  id: string;
  name: string;
};

function StepItem({
  label,
  completed,
  active,
  number,
}: {
  label: string;
  completed?: boolean;
  active?: boolean;
  number?: string;
}) {
  return (
    <View className="items-center">
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${
          completed ? "bg-teal-800" : active ? "bg-slate-800 border-2 border-slate-800" : "bg-indigo-50 border border-indigo-200"
        }`}
      >
        {completed ? (
          <CheckCircle2 size={20} color="white" />
        ) : (
          <Text className={`${active ? "text-white" : "text-indigo-400"} font-bold`}>{number}</Text>
        )}
      </View>
      <Text className={`text-[10px] font-bold ${active ? "text-black" : "text-gray-400"}`}>{label}</Text>
    </View>
  );
}

function StepConnector({ completed }: { completed?: boolean }) {
  return <View className={`h-0.5 flex-1 -mt-4 ${completed ? "bg-teal-800" : "bg-slate-200"}`} />;
}

export default function DropOffScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { token } = useAuth(navigation);
  const { showToast } = useToast();

  const itemData = route?.params?.itemData || {};
  const requestId = itemData?.id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [countries, setCountries] = useState<PickerItem[]>([]);
  const [states, setStates] = useState<PickerItem[]>([]);
  const [dropOffArea, setDropOffArea] = useState<PickerItem[]>([]);
  const [locations, setLocations] = useState<PickerItem[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<PickerItem | null>(null);
  const [selectedState, setSelectedState] = useState<PickerItem | null>(null);
  const [selectedDropOffArea, setSelectedDropOffArea] = useState<PickerItem | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<PickerItem | null>(null);

  const dropDistance = Number(itemData?.dropOffDistance || 0);
  const logistics = Number(itemData?.distanceCharge ?? itemData?.logisticsEstimate ?? 0) || Number((dropDistance * 50).toFixed(0));
  const service = Math.max(Number(itemData?.phlebotomistEarning || 0) - logistics, 800);

  useEffect(() => {
    if (!token) return;

    const fetchCountries = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          URL_LINK,
          { query: GET_COUNTRIES },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetched = res?.data?.data?.getAllDropOffCountries || [];
        setCountries(
          fetched.map((item: any) => ({
            id: item.id,
            name: item.name,
          }))
        );
      } catch (error: any) {
        console.error("fetchCountries failed:", error?.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [token]);

  useEffect(() => {
    if (!token || !selectedCountry?.id) {
      setStates([]);
      setSelectedState(null);
      setDropOffArea([]);
      setSelectedDropOffArea(null);
      setLocations([]);
      setSelectedLocation(null);
      return;
    }

    const fetchStates = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          URL_LINK,
          {
            query: GET_STATE,
            variables: { countryId: selectedCountry.id },
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetched = res?.data?.data?.getDropOffStatesByCountry || [];
        setStates(
          fetched.map((item: any) => ({
            id: item.id,
            name: item.name,
          }))
        );
      } catch (error: any) {
        console.error("fetchStates failed:", error?.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [selectedCountry?.id, token]);

  useEffect(() => {
    if (!token || !selectedState?.id) {
      setDropOffArea([]);
      setSelectedDropOffArea(null);
      setLocations([]);
      setSelectedLocation(null);
      return;
    }

    const fetchAreas = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          URL_LINK,
          {
            query: GET_LOCATION_BY_STATE,
            variables: { stateId: selectedState.id },
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetched = res?.data?.data?.getDropOffAreasByState || [];
        setDropOffArea(
          fetched.map((item: any) => ({
            id: item.id,
            name: item.name,
          }))
        );
      } catch (error: any) {
        console.error("fetchAreas failed:", error?.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [selectedState?.id, token]);

  useEffect(() => {
    if (!token || !selectedDropOffArea?.id) {
      setLocations([]);
      setSelectedLocation(null);
      return;
    }

    const fetchLocations = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          URL_LINK,
          {
            query: GET_DROP_OFF_LOCATION,
            variables: { dropOffAreaId: selectedDropOffArea.id, activeOnly: true },
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetched = res?.data?.data?.dropOffLocations || [];
        setLocations(
          fetched.map((item: any) => ({
            id: item.id,
            name: item.name,
          }))
        );
      } catch (error: any) {
        console.error("fetchDropOffLocations failed:", error?.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [selectedDropOffArea?.id, token]);

  const onSubmit = async () => {
    if (!token || !requestId) {
      showToast("error", "Missing session", "Please login again and retry.");
      return;
    }

    if (!selectedLocation?.id) {
      showToast("error", "Select drop-off location", "Choose a drop-off location before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const modeResponse = await axios.post(
        URL_LINK,
        {
          query: SET_REQUEST_DELIVERY_MODE,
          variables: {
            requestId,
            deliveryMode: "DROP_OFF",
            isTimeSensitive: true,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const modeError = modeResponse?.data?.errors?.[0]?.message;
      if (modeError) {
        throw new Error(modeError);
      }

      const locationResponse = await axios.post(
        URL_LINK,
        {
          query: SET_SELECT_REQUEST_DROP_OFF_LOCATION,
          variables: {
            requestId,
            dropOffLocationId: selectedLocation.id,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const locationError = locationResponse?.data?.errors?.[0]?.message;
      if (locationError) {
        throw new Error(locationError);
      }

      const confirmResponse = await axios.post(
        URL_LINK,
        {
          query: CONFIRM_REQUEST_DROP_OFF,
          variables: { requestId },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const confirmError = confirmResponse?.data?.errors?.[0]?.message;
      if (confirmError) {
        throw new Error(confirmError);
      }

      showToast("success", "Drop-off confirmed", "Delivery details saved successfully.");
      navigation.navigate("accepted_request");
    } catch (error: any) {
      showToast(
        "error",
        "Drop-off failed",
        error?.response?.data?.errors?.[0]?.message || error?.message || "Could not complete drop-off setup."
      );
      console.error("Drop-off submission failed:", error?.message || error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <View className="bg-slate-900 pt-12 pb-8 px-6 rounded-b-[40px]">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-9 h-9 rounded-full bg-white/10 items-center justify-center mr-3">
            <ArrowLeft size={18} color="white" />
          </TouchableOpacity>
          <Copy size={16} color="white" />
          <Text className="text-gray-400 ml-2 font-medium">Request #{String(requestId || "").split("-")?.[4] || "N/A"}</Text>
        </View>
        <Text className="text-white text-2xl font-bold mb-2">Select drop-off location</Text>
        <Text className="text-gray-400 text-base leading-5">Where will you hand the sample to the dispatcher?</Text>
      </View>

      <ScrollView className="flex-1 px-6 -mt-6">
        <View className="flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-6">
          <StepItem label="Accepted" completed />
          <StepConnector completed />
          <StepItem label="Collected" completed />
          <StepConnector completed />
          <StepItem label="Drop-off" active number="3" />
          <StepConnector />
          <StepItem label="Done" number="4" />
        </View>

        <Text className="text-gray-500 font-bold mb-3 tracking-wider">DROP-OFF LOCATION</Text>

        <SearchablePicker
          data={countries}
          selectedValue={selectedCountry?.id}
          placeholder="Select country"
          searchPlaceHolder="Search country..."
          containerClassName="flex-row justify-between items-center border border-slate-200 rounded-xl p-4 bg-slate-50/50 mb-4"
          showChevron
          onValueChange={(id: string, name: string) => setSelectedCountry({ id, name })}
        />

        <SearchablePicker
          data={states}
          selectedValue={selectedState?.id}
          placeholder="Select state"
          searchPlaceHolder="Search state..."
          containerClassName="flex-row justify-between items-center border border-slate-200 rounded-xl p-4 bg-slate-50/50 mb-4"
          showChevron
          onValueChange={(id: string, name: string) => setSelectedState({ id, name })}
        />

        <SearchablePicker
          data={dropOffArea}
          selectedValue={selectedDropOffArea?.id}
          placeholder="Select drop-off area"
          searchPlaceHolder="Search area..."
          containerClassName="flex-row justify-between items-center border border-slate-200 rounded-xl p-4 bg-slate-50/50 mb-4"
          showChevron
          onValueChange={(id: string, name: string) => setSelectedDropOffArea({ id, name })}
        />

        <Text className="text-teal-800 font-bold text-xs uppercase mb-1.5 ml-1">Drop-off Location</Text>
        <SearchablePicker
          data={locations}
          selectedValue={selectedLocation?.id}
          placeholder="Choose location"
          searchPlaceHolder="Search location..."
          containerClassName="border border-teal-600/70 rounded-2xl p-4 bg-white shadow-sm mb-4"
          trailingIcon={
            <View className="bg-teal-50 rounded-full p-2.5">
              <MapPin size={18} color="#006666" fill="#CCFBF1" />
            </View>
          }
          onValueChange={(id: string, name: string) => setSelectedLocation({ id, name })}
        />

        {loading && !selectedLocation?.id && (
          <View className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-200 flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-teal-600 items-center justify-center mr-3">
              <ActivityIndicator size="small" color="#0D9488" />
            </View>
            <Text className="text-slate-500 text-sm flex-1">Detecting nearby dispatch centers...</Text>
          </View>
        )}

        <TouchableOpacity
          disabled={submitting || !selectedLocation?.id}
          onPress={onSubmit}
          className={`py-5 rounded-2xl items-center mb-6 ${submitting || !selectedLocation?.id ? "bg-slate-200" : "bg-teal-800"}`}
        >
          <Text className={`font-bold text-lg ${submitting || !selectedLocation?.id ? "text-slate-400" : "text-white"}`}>
            {submitting ? "Submitting..." : "Confirm drop-off & submit"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomTabs activeTab="Drop-off" />
    </SafeAreaView>
  );
}
