import CustomButton from "@/src/Components/CustomButton";
import InputField from "@/src/Components/InputField";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react-native";
import { login1 } from "@/src/Service/AuthService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Required", "Please enter both email and password to continue.");
      return;
    }
    try {
      await login1(email, password);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Login Failed", "Invalid credentials. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-8"
        >
          {/* --- 1. Header Section --- */}
          <View className="mt-52">
            <View className="flex-row items-center mb-2">
              <Text className="text-5xl font-black text-blue-600">Uni</Text>
              <Text className="text-5xl font-black text-slate-800">Mart</Text>
            </View>
            <Text className="text-lg font-medium tracking-tight text-gray-400">
              The smartest way to trade on campus.
            </Text>
          </View>

          {/* --- 2. Form Section --- */}
          <View className="space-y-5">
            <InputField
              label="University Email"
              placeholder="name@university.ac.lk"
              value={email}
              onChangeText={setEmail}
              icon={<Mail size={20} color="#64748b" />}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <View className="relative">
              <InputField
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                icon={<Lock size={20} color="#64748b" />}
              />
              <TouchableOpacity
                className="absolute right-4 top-11"
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <EyeOff size={22} color="#94a3b8" />
                ) : (
                  <Eye size={22} color="#94a3b8" />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="items-end">
              <Text className="font-semibold text-blue-600">Forgot Password?</Text>
            </TouchableOpacity>

            <View className="mt-4 shadow-xl shadow-blue-200">
              <CustomButton title="Sign In" onPress={handleLogin} />
            </View>
          </View>

          {/* --- 3. Register Link --- */}
          <View className="flex-row justify-center mt-10">
            <Text className="text-base font-medium text-slate-500">New here? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text className="text-base font-extrabold text-blue-600">Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* --- 4. Divider --- */}
          <View className="flex-row items-center my-10">
            <View className="flex-1 h-[1px] bg-slate-100" />
            <Text className="mx-4 text-xs font-bold tracking-widest uppercase text-slate-400">
              Or connect with
            </Text>
            <View className="flex-1 h-[1px] bg-slate-100" />
          </View>

          {/* --- 5. Social Logins --- */}
          <View className="flex-row gap-4 mb-10">
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-center flex-1 h-16 border bg-slate-50 border-slate-100 rounded-2xl"
            >
              <Image
                source={require("../../assets/images/google-48.png")}
                className="w-6 h-6 mr-3"
                resizeMode="contain"
              />
              <Text className="font-bold text-slate-700">Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-center flex-1 h-16 border border-blue-100 bg-blue-50 rounded-2xl"
            >
              <Image
                source={require("../../assets/images/facebook-48.png")}
                className="w-6 h-6 mr-3"
                resizeMode="contain"
              />
              <Text className="font-bold text-blue-700">Facebook</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default Login;