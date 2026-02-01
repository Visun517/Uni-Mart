import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { Camera, User, Mail, LogOut, Check, Edit2 } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

import { useAuth } from "@/src/Context/AuthContext";
import { logoutUser } from "@/src/Service/AuthService";
import { UpdateUserProfile } from "@/src/Service/AuthService";
import { uploadImageToCloudinary } from "@/src/Service/CloudinaryService";

function Profile() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
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
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logoutUser();
          router.replace("/register");
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {/* 1. Header & Image Section */}
          <View className="items-center pt-10 pb-6 bg-white rounded-b-[50px] shadow-sm mt-8">
            <Text className="mb-6 text-2xl font-black text-slate-900">My Profile</Text>
            
            <View className="relative">
              <View className="w-32 h-32 overflow-hidden bg-gray-200 border-4 border-blue-500 rounded-full">
                {profilePic ? (
                  <Image source={{ uri: profilePic }} className="w-full h-full" />
                ) : (
                  <View className="items-center justify-center flex-1">
                    <User size={60} color="#cbd5e1" />
                  </View>
                )}
              </View>
              <TouchableOpacity 
                onPress={pickImage}
                className="absolute bottom-0 right-0 p-2 bg-blue-600 border-4 border-white rounded-full"
              >
                <Camera size={20} color="white" />
              </TouchableOpacity>
            </View>
            
            <Text className="mt-4 text-xl font-bold text-slate-800">{user?.name}</Text>
            <Text className="font-medium text-gray-400">{user?.email}</Text>
          </View>

          {/* 2. Details Section */}
          <View className="px-6 mt-8">
            <View className="bg-white p-6 rounded-[32px] shadow-sm space-y-6">
              
              {/* Name Input */}
              <View>
                <Text className="mb-2 ml-1 text-xs font-bold tracking-widest text-gray-400 uppercase">Display Name</Text>
                <View className="flex-row items-center px-4 py-3 border bg-slate-50 rounded-2xl border-slate-100">
                  <User size={20} color="#94a3b8" />
                  <TextInput
                    className="flex-1 ml-3 text-base font-bold text-slate-800"
                    value={name}
                    onChangeText={setName}
                    editable={isEditing}
                  />
                  <TouchableOpacity onPress={() => isEditing ? handleUpdateName() : setIsEditing(true)}>
                    {isEditing ? (
                      <Check size={20} color="#16a34a" />
                    ) : (
                      <Edit2 size={18} color="#2563eb" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Email (Read Only) */}
              <View>
                <Text className="mb-2 ml-1 text-xs font-bold tracking-widest text-gray-400 uppercase">Email Address</Text>
                <View className="flex-row items-center px-4 py-3 bg-slate-100 rounded-2xl opacity-60">
                  <Mail size={20} color="#94a3b8" />
                  <Text className="ml-3 text-base font-bold text-slate-500">{user?.email}</Text>
                </View>
              </View>
            </View>

            {/* 3. Actions Section */}
            <View className="mt-8 space-y-4">
              {loading && <ActivityIndicator color="#2563eb" className="mb-4" />}
              
              <TouchableOpacity 
                onPress={handleLogout}
                className="flex-row items-center justify-center bg-red-50 py-4 rounded-[24px] border border-red-100"
              >
                <LogOut size={20} color="#ef4444" className="mr-2" />
                <Text className="text-base font-black text-red-500">Logout Account</Text>
              </TouchableOpacity>
            </View>

            <View className="items-center mt-10 mb-10">
              <Text className="font-medium text-slate-300">Uni-Mart v1.0.0</Text>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Profile;