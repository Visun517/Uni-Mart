import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { SafeAreaFrameContext } from "react-native-safe-area-context";

function _layout() {
  const tabs = [
  { name: "home", label: "Home", icon: "storefront" }, 
  { name: "add-item", label: "Add", icon: "add-circle-outline" },
  { name: "my-adds", label: "My Adds", icon: "sell" }, 
  { name: "profile", label: "Profile", icon: "person" },
] as const;

  return (
    <SafeAreaFrameContext value={null}>
    <Tabs screenOptions={{ headerShown: false }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name={tab.icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
    </SafeAreaFrameContext>
  );
}

export default _layout;
