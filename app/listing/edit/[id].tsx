import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/src/Config/firebaseConfig";
import {
  Camera,
  ChevronDown,
  X,
  Tag,
  DollarSign,
  Phone,
  Type,
  ArrowLeft,
  Hexagon,
  AlignLeft,
} from "lucide-react-native";

import InputField from "@/src/Components/InputField";
import CustomButton from "@/src/Components/CustomButton";
import { uploadImageToCloudinary } from "@/src/Service/CloudinaryService";
import { GetPostById, UpdatePost } from "@/src/Service/PostService";
import * as ImagePicker from "expo-image-picker";

function EditItem() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isNewImage, setIsNewImage] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const categories = ["Electronics", "Fashion", "Books", "Furniture", "Vehicles", "Other"];

  useEffect(() => {
    const fetchPostData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const docSnap = await GetPostById(id as string);
        if (docSnap !== null) {
          setTitle(docSnap.title || "");
          setPrice(docSnap.price ? docSnap.price.toString() : "");
          setCategory(docSnap.category || "");
          setNumber(docSnap.number || "");
          setDescription(docSnap.desc || "");
          setImage(docSnap.imageUrl || null);
        } else {
          Alert.alert("Error", "Post not found");
          router.back();
        }
      } catch (error) {
        console.error("Firestore Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [id]);

  const pickImage = async () => {
    Alert.alert("Change Image", "Choose a method to update your item image", [
      {
        text: "Camera",
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (permission.granted) {
            let result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.7,
            });
            if (!result.canceled) {
              setImage(result.assets[0].uri);
              setIsNewImage(true);
            }
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
          });
          if (!result.canceled) {
            setImage(result.assets[0].uri);
            setIsNewImage(true);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleUpdate = async () => {
    if (!title || !price || !category || !image) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setUpdating(true);
    try {
      let finalImageUrl = image;
      if (isNewImage) {
        const uploadedUrl = await uploadImageToCloudinary(image!);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      const updatedData = {
        title,
        price: parseFloat(price),
        category,
        number,
        desc: description,
        imageUrl: finalImageUrl,
      };

      await UpdatePost(id as string, updatedData);
      Alert.alert("Success 🎉", "Your advertisement has been updated!");
      router.replace("/(tabs)/my-adds");
    } catch (error) {
      Alert.alert("Update Failed", "Something went wrong.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#1A3BA0" />
        <Text className="mt-4 font-medium text-slate-400">Loading details...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#1A3BA0" />

      {/* --- 1. Branded Header Section --- */}
      <View className="bg-[#1A3BA0] pt-14 pb-20 px-8 rounded-b-[45px] shadow-2xl">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="p-2 mr-4 border bg-white/10 rounded-xl border-white/20"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text className="text-3xl font-black tracking-tight text-white">Edit Ad</Text>
            <Text className="mt-1 text-sm font-medium tracking-widest uppercase text-blue-100/70">
              Modify your listing details
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 -mt-12"
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} className="px-6">
          
          {/* --- 2. Premium Image Picker --- */}
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.9}
            className="w-full h-72 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] items-center justify-center overflow-hidden mb-8 shadow-sm"
          >
            {image ? (
              <View className="relative w-full h-full">
                <Image source={{ uri: image }} className="w-full h-full" />
                <View className="absolute px-5 py-2.5 rounded-full bottom-4 right-4 bg-black/60 border border-white/20">
                  <Text className="text-xs font-bold tracking-wider text-white uppercase">Change Photo</Text>
                </View>
              </View>
            ) : (
              <View className="items-center">
                <View className="p-5 mb-3 rounded-full bg-blue-50">
                  <Camera size={35} color="#1A3BA0" />
                </View>
                <Text className="text-lg font-bold text-slate-800">Add Item Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* --- 3. Form Sections --- */}
          <View className="space-y-6">
            
            {/* Section: Basic Info */}
            <View>
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 mb-3">Item Information</Text>
              <InputField
                label="Item Title"
                value={title}
                onChangeText={setTitle}
                icon={<Type size={20} color="#94a3b8" />}
              />

              <InputField
                label="Price (LKR)"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                icon={<DollarSign size={20} color="#94a3b8" />}
              />

              {/* Category Dropdown */}
              <View className="mb-4">
                <Text className="mb-2 ml-1 text-xs font-bold text-slate-700">Category</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row items-center justify-between h-16 px-5 border border-slate-100 rounded-3xl bg-slate-50"
                  onPress={() => setIsModalVisible(true)}
                >
                  <View className="flex-row items-center">
                    <Tag size={20} color="#94a3b8" className="mr-3" />
                    <Text className="text-base font-semibold text-slate-800">{category}</Text>
                  </View>
                  <ChevronDown size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Section: Seller Contact */}
            <View>
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 mb-3">Seller Contact</Text>
              <InputField
                label="Phone Number"
                value={number}
                onChangeText={setNumber}
                keyboardType="phone-pad"
                icon={<Phone size={20} color="#94a3b8" />}
              />
            </View>

            {/* Section: Description */}
            <View>
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 mb-3">Description</Text>
              <View className="px-1 py-1 border border-slate-100 rounded-[35px] bg-slate-50 h-40">
                <InputField
                  multiline
                  numberOfLines={5}
                  value={description}
                  onChangeText={setDescription}
                  style={{ textAlignVertical: "top", paddingTop: 15, fontSize: 15 }}
                  icon={<AlignLeft size={20} color="#94a3b8" />}
                />
              </View>
            </View>

            {/* Update Button */}
            <View className="mt-6 mb-10 shadow-xl shadow-blue-200">
              <TouchableOpacity
                disabled={updating}
                onPress={handleUpdate}
                activeOpacity={0.8}
                className="bg-[#1A3BA0] h-16 rounded-3xl items-center justify-center flex-row"
              >
                {updating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-lg font-black text-white">Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* --- Category Modal --- */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View className="justify-end flex-1 bg-black/40">
          <View className="bg-white rounded-t-[50px] p-8 h-[65%] shadow-2xl">
            <View className="self-center w-12 h-1.5 bg-slate-100 rounded-full mb-6" />
            <Text className="mb-6 text-2xl font-black text-slate-800">Select Category</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`py-5 px-8 mb-3 rounded-2xl ${category === item ? "bg-[#1A3BA0]" : "bg-slate-50"}`}
                  onPress={() => { setCategory(item); setIsModalVisible(false); }}
                >
                  <Text className={`text-lg font-bold ${category === item ? "text-white" : "text-slate-600"}`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default EditItem;