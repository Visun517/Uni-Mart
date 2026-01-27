import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  Camera,
  Image as ImageIcon,
  ChevronDown,
  X,
  Phone,
  Tag,
  DollarSign,
  Type,
} from "lucide-react-native";
import InputField from "@/src/Components/InputField";
import CustomButton from "@/src/Components/CustomButton";
import { router } from "expo-router";
import { auth, storage } from "@/src/Config/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { PostSave } from "@/src/Service/PostService";
import { uploadImageToCloudinary } from "@/src/Service/CloudinaryService";

function AddItem() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [number , setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // (Camera or Gallery)
  const pickImage = async () => {
    Alert.alert("Select Image", "Choose a method to upload your item image", [
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
            if (!result.canceled) setImage(result.assets[0].uri);
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
          if (!result.canceled) setImage(result.assets[0].uri);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const categories = [
    "Electronics",
    "Fashion & Clothing",
    "Books & Study Material",
    "Musical Instruments",
    "Furniture",
    "Vehicles & Accessories",
    "Other",
  ];


  const handlePostItem = async () => {
    // 1 (Validation)
    if (!image || !title || !price || !category || !description || !number) {
      Alert.alert("Error", "Please fill all fields and select an image.");
      return;
    }

    setIsLoading(true); // Loading

    try {
      const downloadURL = await uploadImageToCloudinary(image);

      if (!downloadURL) {
        throw new Error("Failed to upload image to Cloudinary.");
      }

      await PostSave(
        title,
        parseFloat(price), 
        category,
        description,
        downloadURL,
        number
      );

      Alert.alert("Success", "Your item has been posted successfully!");

      setImage(null);
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      router.replace("/home");

    } catch (error: any) {
      console.error("Post Error:", error);
      Alert.alert("Post Failed", error.message || "Something went wrong.");
    } finally {
      setIsLoading(false); 
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white ">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          className="px-6"
        >
          {/* 1. Header Section */}
          <View className="mt-14 mb-8">
            <Text className="text-4xl font-black text-gray-900 tracking-tight">
              Create Ad
            </Text>
            <Text className="text-gray-400 text-lg mt-1">
              List your item in the Uni-Mart
            </Text>
          </View>

          {/* 2. Image Picker Section - මීට වඩා Premium පෙනුමක් ලබා දී ඇත */}
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.8}
            className="w-full h-72 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] items-center justify-center overflow-hidden mb-10 shadow-sm"
          >
            {image ? (
              <View className="w-full h-full relative">
                <Image source={{ uri: image }} className="w-full h-full" />
                <TouchableOpacity
                  onPress={() => setImage(null)}
                  className="absolute top-5 right-5 bg-black/60 p-2 rounded-full"
                >
                  <X size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center">
                <View className="bg-blue-100 p-6 rounded-full mb-4">
                  <Camera size={40} color="#2563eb" />
                </View>
                <Text className="text-gray-800 text-xl font-bold">Add Photo</Text>
                <Text className="text-gray-400 mt-1">Snap a photo of your item</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* 3. Details Section - Input Fields Grouping */}
          <View className="space-y-6">
            
            {/* Item Details Group */}
            <View>
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-3">Item Information</Text>
              <InputField
                label="Item Title"
                placeholder="What are you selling?"
                value={title}
                onChangeText={setTitle}
                icon={<Type size={20} color="#9CA3AF" />}
              />

              <InputField
                label="Price (LKR)"
                placeholder="Set a fair price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                icon={<DollarSign size={20} color="#9CA3AF" />}
              />

              {/* Category Selection */}
              <View className="mb-5">
                <Text className="mb-2 font-semibold text-gray-700 ml-1">Category</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row items-center justify-between px-5 h-16 border border-gray-100 rounded-3xl bg-gray-50 shadow-sm"
                  onPress={() => setIsModalVisible(true)}
                >
                  <View className="flex-row items-center">
                    <Tag size={20} color="#9CA3AF" className="mr-3" />
                    <Text className={category ? "text-gray-800 font-medium text-base" : "text-gray-400 text-base"}>
                      {category || "Select Category"}
                    </Text>
                  </View>
                  <ChevronDown size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Seller Contact Group */}
            <View className="mt-4">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-3">Contact Details</Text>
              <InputField
                label="Phone Number"
                placeholder="07x xxxxxxx"
                value={number}
                onChangeText={setNumber}
                keyboardType="phone-pad"
                icon={<Phone size={20} color="#9CA3AF" />}
              />
            </View>

            {/* Description Group */}
            <View className="mt-4 mb-8">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-3">Description</Text>
              <View className="px-5 py-4 border border-gray-100 rounded-[30px] bg-gray-50 h-40 shadow-sm">
                <InputField
                  placeholder="Describe your item's condition, features, etc."
                  multiline
                  numberOfLines={5}
                  value={description}
                  onChangeText={setDescription}
                  style={{ textAlignVertical: "top", fontSize: 16 }}
                />
              </View>
            </View>

            {/* Post Button */}
            <View className="mt-4 shadow-xl shadow-blue-200">
              <CustomButton title="Post Advertisement" onPress={handlePostItem} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-[50px] p-8 h-[60%] shadow-2xl">
            <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6" />
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-2xl font-black text-gray-800">Category</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="bg-gray-100 p-2 rounded-full">
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`py-5 px-6 mb-3 rounded-2xl ${category === item ? "bg-blue-600" : "bg-gray-50"}`}
                  onPress={() => { setCategory(item); setIsModalVisible(false); }}
                >
                  <Text className={`text-lg font-bold ${category === item ? "text-white" : "text-gray-600"}`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default AddItem;
