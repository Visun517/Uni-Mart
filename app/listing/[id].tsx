import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  ActivityIndicator,
  Share,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/src/Config/firebaseConfig";
import { 
  ArrowLeft, 
  Phone, 
  Share2, 
  MapPin, 
  User, 
  Calendar, 
  Tag,
  ShieldCheck,
  MessageCircle
} from "lucide-react-native";

function ItemView() {
  const { id } = useLocalSearchParams(); 
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const makeCall = () => {
    if (post?.number) {
      Linking.openURL(`tel:${post.number}`);
    }
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${post.title} on Uni-Mart for Rs. ${post.price}!`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      {/* 1. Floating Header */}
      <View className="absolute top-12 left-0 right-0 z-10 flex-row justify-between px-6">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="bg-white/90 p-3 rounded-2xl shadow-sm"
        >
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onShare} 
          className="bg-white/90 p-3 rounded-2xl shadow-sm"
        >
          <Share2 size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* 2. Hero Image */}
        <Image
          source={{ uri: post?.imageUrl }}
          className="w-full h-[450px]"
          resizeMode="cover"
        />

        {/* 3. Content Card */}
        <View className="-mt-12 bg-white rounded-t-[45px] px-8 pt-10 pb-32 shadow-2xl">
          
          {/* Category & Badge */}
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 px-4 py-1.5 rounded-full flex-row items-center">
              <Tag size={14} color="#2563eb" />
              <Text className="text-blue-600 font-bold text-xs ml-2 uppercase tracking-tighter">
                {post?.category}
              </Text>
            </View>
            <View className="ml-3 bg-green-100 px-4 py-1.5 rounded-full flex-row items-center">
              <ShieldCheck size={14} color="#16a34a" />
              <Text className="text-green-600 font-bold text-xs ml-2 uppercase tracking-tighter">Verified Ad</Text>
            </View>
          </View>

          {/* Title */}
          <Text className="text-4xl font-black text-slate-900 leading-[42px] mb-4">
            {post?.title}
          </Text>

          {/* Price Tag */}
          <View className="flex-row items-baseline mb-8">
            <Text className="text-3xl font-black text-blue-600">Rs. {post?.price?.toLocaleString()}</Text>
            <Text className="text-slate-400 font-bold ml-2 text-lg">Negotiable</Text>
          </View>

          {/* Description Section */}
          <View className="mb-10">
            <Text className="text-xl font-black text-slate-900 mb-3 tracking-tight">Description</Text>
            <Text className="text-slate-500 leading-7 text-[16px] font-medium">
              {post?.desc}
            </Text>
          </View>

          <View className="h-[1px] bg-slate-100 w-full mb-8" />

          {/* Seller Profile Card */}
          <Text className="text-xl font-black text-slate-900 mb-5 tracking-tight">Seller Information</Text>
          <View className="bg-slate-50 p-6 rounded-[35px] flex-row items-center border border-slate-100">
            <View className="bg-blue-600 p-4 rounded-3xl shadow-lg shadow-blue-300">
              <User size={28} color="white" />
            </View>
            <View className="ml-5 flex-1">
              <Text className="text-slate-900 font-black text-xl" numberOfLines={1}>
                {post?.sellerEmail?.split("@")[0]}
              </Text>
              <Text className="text-slate-400 font-bold text-sm mt-0.5">{post?.sellerEmail}</Text>
            </View>
          </View>

          {/* Meta Info Section */}
          <View className="flex-row justify-between mt-10 px-2">
            <View className="flex-row items-center">
              <View className="bg-slate-100 p-2 rounded-full mr-3">
                <MapPin size={18} color="#64748b" />
              </View>
              <Text className="text-slate-500 font-bold">University Campus</Text>
            </View>
            <View className="flex-row items-center">
              <View className="bg-slate-100 p-2 rounded-full mr-3">
                <Calendar size={18} color="#64748b" />
              </View>
              <Text className="text-slate-500 font-bold">Today</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* 4. Fixed Bottom Action Bar  */}
      <View className="absolute bottom-0 left-0 right-0 px-8 pb-10 pt-6 bg-white/80 backdrop-blur-xl border-t border-slate-50">
        <View className="flex-row gap-4">
            <TouchableOpacity
                onPress={makeCall}
                activeOpacity={0.8}
                className="flex-1 bg-blue-600 flex-row items-center justify-center h-16 rounded-[25px] shadow-2xl shadow-blue-400"
            >
                <Phone size={22} color="white" />
                <Text className="text-white font-black text-lg ml-3">Call Seller</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default ItemView;