import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const tabs = [
    { name: "home", label: "Home", icon: "storefront" }, 
    { name: "add-item", label: "Add", icon: "add-circle-outline" },
    { name: "my-adds", label: "My Adds", icon: "sell" }, 
    { name: "profile", label: "Profile", icon: "person" },
  ] as const;

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2563eb' }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={tab.icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}