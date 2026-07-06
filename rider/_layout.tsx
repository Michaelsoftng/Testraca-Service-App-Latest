import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RiderLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#08AC85",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Logistics",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-shipping" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="routes"
        options={{
          title: "Routes",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="route" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-4" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
