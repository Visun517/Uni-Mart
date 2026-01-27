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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  Camera,
  ChevronDown,
  X,
  Tag,
  DollarSign,
  Phone,
  Type,
  ArrowLeft,
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

  const categories = [
    "Electronics",
    "Fashion",
    "Books",
    "Furniture",
    "Vehicles",
    "Other",
  ];

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

      Alert.alert("Success", "Your advertisement has been updated!");
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
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView showsVerticalScrollIndicator={false} className="px-6">
          {/* Header */}
          <View className="flex-row items-center mt-8 mb-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 mr-4 rounded-full bg-slate-50"
            >
              <ArrowLeft size={24} color="#1e293b" />
            </TouchableOpacity>
            <View>
              <Text className="text-3xl font-black text-gray-900">Edit Ad</Text>
              <Text className="font-medium text-gray-400">
                Update your item details
              </Text>
            </View>
          </View>

          {/* Image Picker */}
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.8}
            className="w-full h-72 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] items-center justify-center overflow-hidden mb-10 shadow-sm"
          >
            {image ? (
              <View className="relative w-full h-full">
                <Image source={{ uri: image }} className="w-full h-full" />
                <View className="absolute px-4 py-2 rounded-full bottom-4 right-4 bg-black/60">
                  <Text className="text-xs font-bold text-white">
                    Change Photo
                  </Text>
                </View>
              </View>
            ) : (
              <View className="items-center">
                <Camera size={40} color="#2563eb" />
                <Text className="mt-2 text-xl font-bold text-gray-800">
                  Add Photo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Inputs */}
          <View className="space-y-6">
            <InputField
              label="Item Title"
              value={title}
              onChangeText={setTitle}
              icon={<Type size={20} color="#9CA3AF" />}
            />
            <InputField
              label="Price (LKR)"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              icon={<DollarSign size={20} color="#9CA3AF" />}
            />

            {/* Category Dropdown */}
            <View className="mb-5">
              <Text className="mb-2 ml-1 font-semibold text-gray-700">
                Category
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                className="flex-row items-center justify-between h-16 px-5 border border-gray-100 rounded-3xl bg-gray-50"
                onPress={() => setIsModalVisible(true)}
              >
                <View className="flex-row items-center">
                  <Tag size={20} color="#9CA3AF" className="mr-3" />
                  <Text className="text-base font-medium text-gray-800">
                    {category}
                  </Text>
                </View>
                <ChevronDown size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <InputField
              label="Phone Number"
              value={number}
              onChangeText={setNumber}
              keyboardType="phone-pad"
              icon={<Phone size={20} color="#9CA3AF" />}
            />

            <View className="mt-4 mb-8">
              <Text className="mb-3 ml-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Description
              </Text>
              <View className="px-5 py-4 border border-gray-100 rounded-[30px] bg-gray-50 h-40">
                <InputField
                  multiline
                  numberOfLines={5}
                  value={description}
                  onChangeText={setDescription}
                  style={{ textAlignVertical: "top", fontSize: 16 }}
                />
              </View>
            </View>

            <View className="mt-4 mb-10">
              <CustomButton
                title={updating ? "Updating..." : "Save Changes"}
                onPress={handleUpdate}
                disabled={updating}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View className="justify-end flex-1 bg-black/40">
          <View className="bg-white rounded-t-[50px] p-8 h-[60%] shadow-2xl">
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`py-5 px-6 mb-3 rounded-2xl ${category === item ? "bg-blue-600" : "bg-gray-50"}`}
                  onPress={() => {
                    setCategory(item);
                    setIsModalVisible(false);
                  }}
                >
                  <Text
                    className={`text-lg font-bold ${category === item ? "text-white" : "text-gray-600"}`}
                  >
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

export default EditItem;
