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
  StatusBar,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  Camera,
  ChevronDown,
  X,
  Phone,
  Tag,
  DollarSign,
  Type,
  Hexagon,
  AlignLeft,
} from "lucide-react-native";
import InputField from "@/src/Components/InputField";
import CustomButton from "@/src/Components/CustomButton";
import { router } from "expo-router";
import { PostSave } from "@/src/Service/PostService";
import { uploadImageToCloudinary } from "@/src/Service/CloudinaryService";

function AddItem() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Electronics",
    "Fashion & Clothing",
    "Books & Study Material",
    "Musical Instruments",
    "Furniture",
    "Vehicles & Accessories",
    "Other",
  ];

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

  const handlePostItem = async () => {
    if (!image || !title || !price || !category || !description || !number) {
      Alert.alert("Missing Fields", "Please fill all fields and select an image to continue.");
      return;
    }

    setIsLoading(true);

    try {
      const downloadURL = await uploadImageToCloudinary(image);
      if (!downloadURL) throw new Error("Image upload failed.");

      await PostSave(title, parseFloat(price), category, description, downloadURL, number);

      Alert.alert("Success 🎉", "Your advertisement has been published successfully!");
      
      // Reset Form
      setImage(null);
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setNumber("");
      router.replace("/home");

    } catch (error: any) {
      console.error("Post Error:", error);
      Alert.alert("Error", error.message || "Could not post your item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#1A3BA0" />

      {/* --- 1. Top Branded Header --- */}
      <View className="bg-[#1A3BA0] pt-14 pb-20 px-8 rounded-b-[45px] shadow-2xl">
        <View className="flex-row items-center">
          <View className="p-2 mr-4 border bg-white/10 rounded-xl border-white/20">
            <Hexagon size={28} color="white" />
          </View>
          <View>
            <Text className="text-3xl font-black tracking-tight text-white">Create Ad</Text>
            <Text className="mt-1 text-sm font-medium tracking-widest uppercase text-blue-100/70">
              Post your item for sale
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 -mt-12"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          className="px-6"
        >
          {/* --- 2. Image Picker Container --- */}
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.9}
            className="w-full h-64 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] items-center justify-center overflow-hidden mb-8 shadow-sm"
          >
            {image ? (
              <View className="relative w-full h-full">
                <Image source={{ uri: image }} className="w-full h-full" />
                <TouchableOpacity
                  onPress={() => setImage(null)}
                  className="absolute p-2 rounded-full top-4 right-4 bg-black/50"
                >
                  <X size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center">
                <View className="p-5 mb-3 rounded-full bg-blue-50">
                  <Camera size={35} color="#1A3BA0" />
                </View>
                <Text className="text-lg font-bold text-slate-800">Add Item Photo</Text>
                <Text className="mt-1 text-xs text-slate-400">Tap to open Camera or Gallery</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* --- 3. Form Details --- */}
          <View className="space-y-6">
            
            {/* Item Info Section */}
            <View>
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 mb-3">Item Details</Text>
              <InputField
                label="Item Title"
                placeholder="What are you selling?"
                value={title}
                onChangeText={setTitle}
                icon={<Type size={20} color="#94a3b8" />}
              />

              <InputField
                label="Price (LKR)"
                placeholder="Ex: 15,500"
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
                    <Text className={category ? "text-slate-800 font-semibold" : "text-slate-400"}>
                      {category || "Select a Category"}
                    </Text>
                  </View>
                  <ChevronDown size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Contact Section */}
            <View>
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 mb-3">Seller Contact</Text>
              <InputField
                label="Phone Number"
                placeholder="07x xxxxxxx"
                value={number}
                onChangeText={setNumber}
                keyboardType="phone-pad"
                icon={<Phone size={20} color="#94a3b8" />}
              />
            </View>

            {/* Description Section */}
            <View>
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 mb-3">More Info</Text>
              <View className="px-1 py-1 border border-slate-100 rounded-[35px] bg-slate-50 h-40">
                <InputField
                  placeholder="Describe your item condition, features, etc..."
                  multiline
                  numberOfLines={5}
                  value={description}
                  onChangeText={setDescription}
                  style={{ textAlignVertical: "top", paddingTop: 15, fontSize: 15 }}
                  icon={<AlignLeft size={20} color="#94a3b8" />}
                />
              </View>
            </View>

            {/* Submit Button */}
            <View className="mt-6 shadow-xl shadow-blue-200">
              <TouchableOpacity
                disabled={isLoading}
                onPress={handlePostItem}
                activeOpacity={0.8}
                className={`bg-[#1A3BA0] h-16 rounded-3xl items-center justify-center flex-row`}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Text className="mr-2 text-lg font-black text-white">Publish Advertisement</Text>
                  </>
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
            <View className="w-12 h-1.5 bg-slate-100 rounded-full self-center mb-6" />
            <View className="flex-row items-center justify-between mb-8">
              <Text className="text-2xl font-black text-slate-800">Select Category</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} className="p-2 rounded-full bg-slate-50">
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

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

export default AddItem;