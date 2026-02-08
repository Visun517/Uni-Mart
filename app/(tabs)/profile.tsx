import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Camera, User, Mail, LogOut, Check, Edit2, Hexagon, Shield, Bell, CircleHelp } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

import { useAuth } from "@/src/Context/AuthContext";
import { logoutUser } from "@/src/Service/AuthService";
import { UpdateUserProfile } from "@/src/Service/AuthService";
import { uploadImageToCloudinary } from "@/src/Service/CloudinaryService";

function Profile() {
  const { user, setUser } = useAuth();
  const router = useRouter();

   if (!user) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#1A3BA0" />
      </View>
    );
  }

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || user?.displayName || "");
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const [isEditing, setIsEditing] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      handleImageUpload(result.assets[0].uri);
    }
  };

  const handleImageUpload = async (uri: string) => {
    setLoading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(uri);
      if (imageUrl) {
        await UpdateUserProfile(user.uid, { profilePic: imageUrl });
        setProfilePic(imageUrl);
        setUser({ ...user, profilePic: imageUrl }); 
        Alert.alert("Success", "Profile picture updated!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateName = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await UpdateUserProfile(user.uid, { name: name });
      setUser({ ...user, name: name });
      setIsEditing(false);
      Alert.alert("Success", "Name updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout from Uni-Mart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logoutUser();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#1A3BA0" />
      
      {/* --- 1. Branded Header Section --- */}
      <View className="bg-[#1A3BA0] pt-14 pb-24 px-8 rounded-b-[50px] shadow-2xl items-center">
        <View className="flex-row items-center justify-between w-full mb-6">
            <View className="p-2 border bg-white/10 rounded-xl border-white/20">
                <Hexagon size={24} color="white" />
            </View>
            <Text className="text-xl font-black text-white">Profile</Text>
            <TouchableOpacity className="p-2 border bg-white/10 rounded-xl border-white/20">
                <Bell size={22} color="white" />
            </TouchableOpacity>
        </View>

        {/* Profile Image with modern ring */}
        <View className="relative">
          <View className="p-1 bg-white rounded-full shadow-2xl">
            <View className="w-32 h-32 overflow-hidden border-4 border-white rounded-full bg-slate-100">
                {profilePic || user?.profilePic ? (
                  <Image source={{ uri: profilePic || user?.profilePic }} className="w-full h-full" />
                ) : (
                  <View className="items-center justify-center flex-1">
                    <User size={50} color="#cbd5e1" />
                  </View>
                )}
            </View>
          </View>
          <TouchableOpacity 
            onPress={pickImage}
            activeOpacity={0.8}
            className="absolute bottom-1 right-1 p-2.5 bg-blue-600 border-4 border-white rounded-full shadow-lg"
          >
            <Camera size={18} color="white" />
          </TouchableOpacity>
        </View>

        <Text className="mt-4 text-2xl font-black text-white">{user?.name || user?.displayName}</Text>
        <Text className="font-medium text-blue-100/70">{user?.email}</Text>
      </View>

      {/* --- 2. Information & Settings Section --- */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        className="flex-1 -mt-10"
      >
        <ScrollView showsVerticalScrollIndicator={false} className="px-8">
          
          <View className="p-6 bg-white border shadow-xl rounded-3xl shadow-slate-400 border-slate-50">
            {/* Display Name Edit Field */}
            <View className="mb-6">
              <Text className="mb-3 ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">Account Identity</Text>
              <View className="flex-row items-center px-4 border h-14 bg-slate-50 rounded-2xl border-slate-100">
                <User size={18} color="#1A3BA0" />
                <TextInput
                  className="flex-1 ml-3 text-base font-bold text-slate-800"
                  value={name}
                  onChangeText={setName}
                  editable={isEditing}
                  placeholder="Your Name"
                />
                <TouchableOpacity 
                  onPress={() => isEditing ? handleUpdateName() : setIsEditing(true)}
                  className="p-2"
                >
                  {isEditing ? (
                    <Check size={20} color="#16a34a" />
                  ) : (
                    <Edit2 size={18} color="#94a3b8" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Email Field (Static) */}
            <View>
              <Text className="mb-3 ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">Registered Email</Text>
              <View className="flex-row items-center px-4 border h-14 bg-slate-50/50 rounded-2xl border-slate-50">
                <Mail size={18} color="#94a3b8" />
                <Text className="ml-3 text-base font-semibold text-slate-400">{user?.email}</Text>
              </View>
            </View>
          </View>

          {/* --- 3. Additional Options List --- */}
          <View className="mt-8 space-y-3">
             <Text className="mb-2 ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">Preferences</Text>
             
             <TouchableOpacity className="flex-row items-center justify-between p-5 mb-3 bg-white border shadow-sm rounded-3xl border-slate-50">
                <View className="flex-row items-center">
                    <View className="p-2 mr-4 bg-blue-50 rounded-xl">
                        <Shield size={20} color="#1A3BA0" />
                    </View>
                    <Text className="text-base font-bold text-slate-700">Privacy & Security</Text>
                </View>
                <Edit2 size={16} color="#cbd5e1" />
             </TouchableOpacity>

             <TouchableOpacity className="flex-row items-center justify-between p-5 bg-white border shadow-sm rounded-3xl border-slate-50">
                <View className="flex-row items-center">
                    <View className="p-2 mr-4 bg-orange-50 rounded-xl">
                        <CircleHelp size={20} color="#f97316" />
                    </View>
                    <Text className="text-base font-bold text-slate-700">Help & Support</Text>
                </View>
                <Edit2 size={16} color="#cbd5e1" />
             </TouchableOpacity>
          </View>

          {/* --- 4. Logout Action --- */}
          <View className="mt-10 mb-20">
            {loading ? (
              <ActivityIndicator color="#1A3BA0" className="mb-4" />
            ) : (
              <TouchableOpacity 
                onPress={handleLogout}
                activeOpacity={0.8}
                className="flex-row items-center justify-center bg-red-50 py-5 rounded-[28px] border border-red-100 shadow-sm"
              >
                <LogOut size={20} color="#ef4444" className="mr-3" />
                <Text className="text-lg font-black text-red-500">Sign Out from Uni-Mart</Text>
              </TouchableOpacity>
            )}
            <Text className="mt-6 text-xs font-bold tracking-widest text-center uppercase text-slate-300">Version 1.0.4 stable</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default Profile;