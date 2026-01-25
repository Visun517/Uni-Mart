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
    if (!username || !email || !password) {
      Alert.alert("Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }
    try {
      await registation(username, email, password);
      Alert.alert("User registered successfully");
      router.replace("/login");
    } catch (error) {
      console.log(error);
    } finally {
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
          >
            <View className="justify-center flex-1 px-8 py-10">
              {/* 1. Header Section */}
              <View className="items-start mb-10">
                <Text className="text-4xl font-black text-blue-600">
                  Join Uni-Mart
                </Text>
                <Text className="mt-2 text-lg font-medium text-gray-400">
                  Create an account to start trading
                </Text>
              </View>

              {/* 2. Form Section */}
              <View className="space-y-1">
                <InputField
                  label="Full Name"
                  placeholder="Enter your name"
                  value={username}
                  onChangeText={setUsername}
                  icon={<User size={20} color="#9CA3AF" />}
                />

                <InputField
                  label="University Email"
                  placeholder="student@uni.ac.lk"
                  value={email}
                  onChangeText={setEmail}
                  icon={<Mail size={20} color="#9CA3AF" />}
                />

                {/* Password Field */}
                <View className="relative">
                  <InputField
                    label="Password"
                    placeholder="Create a password"
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

                {/* Confirm Password Field */}
                <View className="relative">
                  <InputField
                    label="Confirm Password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!isConfirmVisible}
                    icon={<Lock size={20} color="#9CA3AF" />}
                  />
                  <TouchableOpacity
                    className="absolute right-4 top-11"
                    onPress={() => setIsConfirmVisible(!isConfirmVisible)}
                  >
                    {isConfirmVisible ? (
                      <EyeOff size={22} color="#9CA3AF" />
                    ) : (
                      <Eye size={22} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                </View>

                <View className="mt-6">
                  <CustomButton
                    title="Create Account"
                    onPress={handleRegister}
                  />
                </View>
              </View>

              {/* 3. Footer Section */}
              <View className="flex-row justify-center mt-8 mb-4">
                <Text className="text-gray-500">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                  <Text className="font-bold text-blue-600">Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

export default Register;
