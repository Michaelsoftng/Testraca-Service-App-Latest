import React, { useEffect } from "react";
import { Alert, View, Text, ActivityIndicator } from "react-native";
import * as Updates from "expo-updates";

const CheckForNewUpdates = () => {
  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          "Update Available",
          "A new version of the app is available. Please update to continue.",
          [
            {
              text: "Update Now",
              onPress: async () => {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync(); // Reloads the app with the new update
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Checking for updates...</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default CheckForNewUpdates;
