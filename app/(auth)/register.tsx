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
  StatusBar,
} from "react-native";
import { Mail, Lock, Eye, EyeOff, User, Hexagon } from "lucide-react-native";
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
      <View className="flex-1 bg-white">
        {/* Status Bar සැකසුම */}
        <StatusBar barStyle="light-content" backgroundColor="#1A3BA0" />

        {/* --- 1. Top Blue Header Section --- */}
        <View className="bg-[#1A3BA0] h-[30%] items-center justify-center rounded-b-[65px] shadow-2xl">
          <View className="items-center mt-4">
            <View className="p-4 mb-2 bg-white/10 rounded-[25px] border border-white/20">
              <Hexagon size={50} color="white" strokeWidth={1.5} />
            </View>
            <Text className="text-4xl font-black tracking-tighter text-white">UniMart</Text>
            <Text className="mt-1 text-[10px] font-bold tracking-[2px] uppercase text-blue-100/60">
              Campus Marketplace
            </Text>
          </View>
        </View>

        {/* --- 2. Form Section (Overlapping Card) --- */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 -mt-12"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            className="px-8"
          >
            <View className="bg-white rounded-[45px] p-6 shadow-2xl shadow-slate-400 border border-slate-50 mb-10">
              <View className="items-start mb-6 ml-1">
                <Text className="text-3xl font-black text-slate-800">Get Started</Text>
                <Text className="text-[15px] font-medium text-slate-400 mt-1">
                  Create your campus account today
                </Text>
              </View>

              <View className="space-y-4">
                <InputField
                  label="Full Name"
                  placeholder="Ex: John Doe"
                  value={username}
                  onChangeText={setUsername}
                  icon={<User size={18} color="#64748b" />}
                />

                <InputField
                  label="University Email"
                  placeholder="name@university.ac.lk"
                  value={email}
                  onChangeText={setEmail}
                  icon={<Mail size={18} color="#64748b" />}
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
                    icon={<Lock size={18} color="#64748b" />}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-11"
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <EyeOff size={20} color="#94a3b8" />
                    ) : (
                      <Eye size={20} color="#94a3b8" />
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
                    icon={<Lock size={18} color="#64748b" />}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-11"
                    onPress={() => setIsConfirmVisible(!isConfirmVisible)}
                  >
                    {isConfirmVisible ? (
                      <EyeOff size={20} color="#94a3b8" />
                    ) : (
                      <Eye size={20} color="#94a3b8" />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Register Button */}
                <View className="mt-4 shadow-lg shadow-blue-300">
                  <CustomButton
                    title="Create Account"
                    onPress={handleRegister}
                  />
                </View>
              </View>

              {/* --- 3. Footer Section --- */}
              <View className="flex-row justify-center mt-8 mb-2">
                <Text className="text-base font-medium text-slate-500">
                  Already a member?{" "}
                </Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                  <Text className="text-base font-bold text-[#1A3BA0]">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Register;