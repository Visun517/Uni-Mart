import CustomButton from "@/src/Components/CustomButton";
import InputField from "@/src/Components/InputField";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import { login1, loginWithGoogle } from "@/src/Service/AuthService";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

// WebBrowser.maybeCompleteAuthSession();

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  //   androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
  //   iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,

  //   redirectUri: "https://auth.expo.io/@Prabodha123/uni-mart",
  // });

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { id_token } = response.params;
  //     handleFirebaseGoogleLogin(id_token);
  //   }
  // }, [response]);

  const handleFirebaseGoogleLogin = async (idToken: string) => {
    try {
      await loginWithGoogle(idToken);
      Alert.alert("Login successful", "Welcome to Uni-Mart!");
      router.replace("/home");
    } catch (error) {
      console.log("Firebase Google Login Error:", error);
      Alert.alert("Error", "Failed to sync with Firebase.");
    }
  };

  const handleLogin = async () => {
    if (!email && !password) {
      Alert.alert("Please fill all the fields");
      return;
    }
    try {
      await login1(email, password);
      Alert.alert("Login successful");
      router.replace("/home");
    } catch (error) {
      console.log(error);
      Alert.alert("Login failed. Please check your credentials and try again.");
    } finally {
      console.log("Finized..!");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="justify-center flex-1 px-8 py-10">
          {/* 1. Header Section */}
          <View className="items-start mb-10">
            <Text className="text-4xl font-black text-blue-600">Uni-Mart</Text>
            <Text className="mt-2 text-lg font-medium text-gray-400">
              Log in to your campus marketplace
            </Text>
          </View>

          {/* 2. Form Section */}
          <View>
            <InputField
              label="University Email"
              placeholder="e.g. student@uni.ac.lk"
              value={email}
              onChangeText={setEmail}
              icon={<Mail size={20} color="#9CA3AF" />}
            />

            <View className="relative">
              <InputField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                icon={<Lock size={20} color="#9CA3AF" />}
              />
              <TouchableOpacity
                className="absolute right-4 top-11"
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <EyeOff size={22} color="#9CA3AF" />
                ) : (
                  <Eye size={22} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="items-end mb-6">
              <Text className="font-semibold text-blue-600">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <CustomButton title="Sign In" onPress={handleLogin} />
          </View>

          {/* 3. Register Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">New to Uni-Mart? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text className="font-bold text-blue-600">Create Account</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center my-10">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="mx-4 font-medium text-gray-400">
              Or continue with
            </Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          {/* 5. Social Login Buttons Section */}
          <View className="flex-row gap-4">
            {/* Google Button */}
            <TouchableOpacity
              // onPress={() => promptAsync()}
              activeOpacity={0.8}
              className="flex-row items-center justify-center flex-1 bg-white border border-gray-100 shadow-sm h-14 rounded-2xl"
            >
              <Image
                source={require("../../assets/images/google-48.png")}
                className="w-6 h-6"
                resizeMode="contain"
              />
              <Text className="ml-3 font-bold text-gray-700">Google</Text>
            </TouchableOpacity>

            {/* Facebook Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex-row items-center justify-center flex-1 bg-white border border-gray-100 shadow-sm h-14 rounded-2xl"
            >
              <Image
                source={require("../../assets/images/facebook-48.png")}
                className="w-6 h-6"
                resizeMode="contain"
              />
              <Text className="ml-3 font-bold text-gray-700">Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

export default Login;

