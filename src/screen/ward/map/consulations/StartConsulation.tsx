import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function StartConsultationScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { userId, consultaionId, patientName } = route.params ?? {};
    const displayName = patientName || 'Patient';

  return (
    <View style={styles.container}>
      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.date}>16/02 • 6:30 AM</Text>
      </View>

      {/* Center Message */}
      <View style={styles.centerMessageContainer}>
        <Text style={styles.centerMessage}>
          {displayName} wants to chat with you...
        </Text>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity style={styles.button}
      onPress={() => {
        navigation.navigate('chat_screen', { userId, consultaionId })
      }}
      >
        <Text style={styles.buttonText}>Start Consultation</Text>
      </TouchableOpacity>
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  date: {
    color: "#888",
    marginTop: 4,
  },
  centerMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerMessage: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#059669",
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 80,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
