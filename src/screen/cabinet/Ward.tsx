import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useAuth from "../../schema/UseAuth";
import DoctorHomePage from "../ward/map/DoctorHomePage";
import HomePage from "../ward/map/HomePage";

export default function Ward() {
  const navigation = useNavigation<any>();
  const { userType } = useAuth(navigation);
  const [booting, setBooting] = useState(true);

  const role = useMemo(() => String(userType || "").toLowerCase(), [userType]);

  const clearSession = async () => {
    await AsyncStorage.multiSet([
      ["userToken", ""],
      ["refreshToken", ""],
      ["userType", ""],
      ["id", ""],
    ]);
    navigation.navigate("login");
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Changes might be lost", "Really want to go back?", [
          { text: "No", style: "cancel" },
          {
            text: "Yes",
            style: "destructive",
            onPress: () => {
              clearSession();
              navigation.goBack();
            },
          },
        ]);
        return true;
      };

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  useEffect(() => {
    if (role) {
      setBooting(false);
    }
  }, [role]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {booting ? (
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#059669" />
        </View>
      ) : role === "phlebotomist" ? (
        <HomePage />
      ) : (
        <DoctorHomePage />
      )}
    </GestureHandlerRootView>
  );
}
