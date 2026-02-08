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
  StatusBar,
} from "react-native";
import { Mail, Lock, Eye, EyeOff, Hexagon } from "lucide-react-native";
import { login1 } from "@/src/Service/AuthService";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    redirectUri: "https://auth.expo.io/@prabodha123/uni-mart",
  });

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Required", "Please enter both email and password.");
      return;
    }
    try {
      await login1(email, password);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Login Failed", "Invalid credentials.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white">
        <StatusBar barStyle="light-content" backgroundColor="#1A3BA0" />
        
        {/* --- 1. Top Blue Header with Curve --- */}
        <View className="bg-[#1A3BA0] h-[38%] items-center justify-center rounded-b-[65px] shadow-2xl relative">
          <View className="items-center mt-5">
            <View className="p-5 mb-3 bg-white/10 rounded-[30px] border border-white/20">
              <Hexagon size={65} color="white" strokeWidth={1.2} />
            </View>
            <Text className="text-5xl font-black tracking-tighter text-white">UniMart</Text>
            <Text className="mt-1 text-xs font-bold tracking-[3px] uppercase text-blue-100/60">
              Campus Marketplace
            </Text>
          </View>
        </View>

        {/* --- 2. Form Section --- */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 -mt-12"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            className="px-8"
          >
            {/* සුදු පැහැති Card එකට වැඩිපුර Shadow එකක් සහ Padding එකක් එක් කළා */}
            <View className="bg-white rounded-[45px] p-6 shadow-xl shadow-slate-300 border border-slate-50">
              <View className="items-start mb-6 ml-1">
                <Text className="text-3xl font-black text-slate-800">Welcome Back</Text>
                <Text className="text-[15px] font-medium text-slate-400 mt-1">
                  Log in to your account to continue
                </Text>
              </View>

              <View className="space-y-5">
                <InputField
                  label="Email Address"
                  placeholder="name@university.ac.lk"
                  value={email}
                  onChangeText={setEmail}
                  icon={<Mail size={18} color="#64748b" />}
                  autoCapitalize="none"
                />

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

                <TouchableOpacity className="items-end py-1">
                  <Text className="font-bold text-[#1A3BA0]">Forgot Password?</Text>
                </TouchableOpacity>

                <View className="mt-4 shadow-lg shadow-blue-300">
                  <CustomButton title="Sign In" onPress={handleLogin} />
                </View>
              </View>

              {/* --- 3. Divider --- */}
              <View className="flex-row items-center my-9">
                <View className="flex-1 h-[1px] bg-slate-100" />
                <Text className="mx-4 text-[10px] font-bold tracking-widest uppercase text-slate-300">
                  OR CONNECT WITH
                </Text>
                <View className="flex-1 h-[1px] bg-slate-100" />
              </View>

              {/* --- 4. Social Logins --- */}
              <View className="flex-row gap-4">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => promptAsync()} 
                  className="flex-row items-center justify-center flex-1 bg-white border shadow-sm h-14 border-slate-100 rounded-2xl"
                >
                  <Image source={require("../../assets/images/google-48.png")} className="w-5 h-5 mr-3" resizeMode="contain" />
                  <Text className="font-bold text-slate-700">Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row items-center justify-center flex-1 h-14 bg-[#1877F2] rounded-2xl shadow-sm"
                >
                  <Image source={require("../../assets/images/facebook-48.png")} className="w-5 h-5 mr-3 brightness-200" resizeMode="contain" />
                  <Text className="font-bold text-white">Facebook</Text>
                </TouchableOpacity>
              </View>

              {/* --- 5. Register Link --- */}
              <View className="flex-row justify-center mt-10 mb-6">
                <Text className="text-base font-medium text-slate-500">Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/register")}>
                  <Text className="text-base font-bold text-[#1A3BA0]">Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Login;