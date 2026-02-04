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
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react-native";
import { registation } from "@/src/Service/AuthService";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Required", "Please fill in all the fields to create your account.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Match Error", "Passwords do not match. Please check again.");
      return;
    }

    try {
      await registation(username, email, password);
      Alert.alert("Success", "Welcome to Uni-Mart!");
      router.replace("/home");
    } catch (error) {
      console.log(error);
      Alert.alert("Registration Failed", "Something went wrong. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            className="px-8"
          >
            {/* --- 1. Header Section  --- */}
            <View className="mt-40 ">
              <View className="flex-row items-center mb-2">
                <Text className="text-5xl font-black text-blue-600">Uni</Text>
                <Text className="text-5xl font-black text-slate-800">Mart</Text>
              </View>
              <Text className="text-lg font-medium tracking-tight text-gray-400">
                Create an account and start trading today.
              </Text>
            </View>

            {/* --- 2. Form Section --- */}
            <View className="space-y-5">
              <InputField
                label="Full Name"
                placeholder="Ex: John Doe"
                value={username}
                onChangeText={setUsername}
                icon={<User size={20} color="#64748b" />}
              />

              <InputField
                label="University Email"
                placeholder="name@university.ac.lk"
                value={email}
                onChangeText={setEmail}
                icon={<Mail size={20} color="#64748b" />}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              {/* Password Field */}
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

              {/* Confirm Password Field */}
              <View className="relative">
                <InputField
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!isConfirmVisible}
                  icon={<Lock size={20} color="#64748b" />}
                />
                <TouchableOpacity
                  className="absolute right-4 top-11"
                  onPress={() => setIsConfirmVisible(!isConfirmVisible)}
                >
                  {isConfirmVisible ? (
                    <EyeOff size={22} color="#94a3b8" />
                  ) : (
                    <Eye size={22} color="#94a3b8" />
                  )}
                </TouchableOpacity>
              </View>

              {/* Register Button with Shadow */}
              <View className="mt-6 shadow-xl shadow-blue-200">
                <CustomButton
                  title="Create Account"
                  onPress={handleRegister}
                />
              </View>
            </View>

            {/* --- 3. Footer Section --- */}
            <View className="flex-row justify-center mt-10 mb-8">
              <Text className="text-base font-medium text-slate-500">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text className="text-base font-extrabold text-blue-600">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default Register;