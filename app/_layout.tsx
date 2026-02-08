import { Stack } from "expo-router";
import { AuthProvider } from "../src/Context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FlashMessage from "react-native-flash-message";
import React from "react";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="listing" options={{ headerShown: false }} />
        </Stack>
        <FlashMessage
          position="top"
          floating={true} 
          statusBarHeight={30} 
          style={{
            borderRadius: 25,
            paddingVertical: 15,
            paddingHorizontal: 20,
            marginTop: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8, 
          }}
          titleStyle={{
            fontSize: 18,
            fontWeight: "900", 
          }}
          textStyle={{
            fontSize: 14,
            fontWeight: "600",
          }}
        ></FlashMessage>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
