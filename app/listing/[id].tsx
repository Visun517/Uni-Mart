import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Share,
  StatusBar,
  Dimensions,
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
  Zap,
  ChevronRight
} from "lucide-react-native";

const { width } = Dimensions.get("window");

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
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#1A3BA0" />
        <Text className="mt-4 font-medium text-slate-400">Loading Details...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* 1. Floating Glass Header */}
      <View className="absolute left-0 right-0 z-10 flex-row justify-between px-6 top-12">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="p-3 border bg-black/20 rounded-2xl border-white/30"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={onShare} 
          className="p-3 border bg-black/20 rounded-2xl border-white/30"
        >
          <Share2 size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* 2. Hero Image Section */}
        <View className="relative">
            <Image
            source={{ uri: post?.imageUrl }}
            className="w-full h-[500px]"
            resizeMode="cover"
            />
            {/* Image Overlay Gradient Effect (Optional concept) */}
            <View className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
        </View>

        {/* 3. Main Content Card */}
        <View className="-mt-16 bg-white rounded-t-[50px] px-8 pt-10 pb-40 shadow-2xl">
          
          {/* Status Badges */}
          <View className="flex-row items-center mb-5">
            <View className="flex-row items-center px-4 py-2 border border-blue-100 bg-blue-50 rounded-2xl">
              <Tag size={14} color="#1A3BA0" />
              <Text className="text-[#1A3BA0] font-bold text-[10px] ml-2 uppercase tracking-widest">
                {post?.category}
              </Text>
            </View>
            <View className="flex-row items-center px-4 py-2 ml-3 border border-green-100 bg-green-50 rounded-2xl">
              <ShieldCheck size={14} color="#16a34a" />
              <Text className="text-green-700 font-bold text-[10px] ml-2 uppercase tracking-widest">Verified</Text>
            </View>
          </View>

          {/* Title & Stats */}
          <Text className="text-4xl font-black text-slate-900 leading-[44px] mb-2 tracking-tight">
            {post?.title}
          </Text>
          
          <View className="flex-row items-center mb-8">
            <Zap size={16} color="#f59e0b" fill="#f59e0b" />
            <Text className="ml-2 text-sm font-bold text-slate-400">Highly requested in Campus</Text>
          </View>

          {/* Price Highlight Section */}
          <View className="bg-slate-50 p-6 rounded-[35px] border border-slate-100 flex-row justify-between items-center mb-8">
            <View>
                <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Asking Price</Text>
                <Text className="text-4xl font-black text-[#1A3BA0]">Rs. {post?.price?.toLocaleString()}</Text>
            </View>
            <View className="px-4 py-2 bg-white border shadow-sm rounded-xl border-slate-100">
                <Text className="text-xs font-bold text-slate-800">Negotiable</Text>
            </View>
          </View>

          {/* Description Section */}
          <View className="mb-10">
            <View className="flex-row items-center mb-4">
                <View className="w-1.5 h-6 bg-[#1A3BA0] rounded-full mr-3" />
                <Text className="text-xl font-black tracking-tight text-slate-900">Description</Text>
            </View>
            <Text className="text-slate-500 leading-7 text-[16px] font-medium">
              {post?.desc}
            </Text>
          </View>

          {/* Premium Seller Profile Card */}
          <Text className="mb-5 text-xl font-black tracking-tight text-slate-900">Seller Profile</Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            className="bg-white border border-slate-100 p-5 rounded-[35px] flex-row items-center shadow-xl shadow-slate-200"
          >
            <View className="bg-[#1A3BA0] p-4 rounded-[25px] shadow-lg shadow-blue-200">
              <User size={30} color="white" />
            </View>
            <View className="flex-1 ml-5">
              <Text className="text-xl font-black text-slate-900" numberOfLines={1}>
                {post?.sellerEmail?.split("@")[0]}
              </Text>
              <Text className="text-slate-400 font-bold text-xs mt-0.5">{post?.sellerEmail}</Text>
            </View>
            <View className="p-2 rounded-full bg-slate-50">
                <ChevronRight size={20} color="#cbd5e1" />
            </View>
          </TouchableOpacity>

          {/* Meta Information Grid */}
          <View className="flex-row justify-between mt-12 bg-slate-50/50 p-6 rounded-[35px] border border-slate-50">
            <View className="flex-row items-center">
              <View className="bg-white p-2.5 rounded-2xl shadow-sm mr-3">
                <MapPin size={18} color="#1A3BA0" />
              </View>
              <View>
                <Text className="text-slate-400 text-[10px] font-bold uppercase">Location</Text>
                <Text className="text-sm font-black text-slate-700">University</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="bg-white p-2.5 rounded-2xl shadow-sm mr-3">
                <Calendar size={18} color="#1A3BA0" />
              </View>
              <View>
                <Text className="text-slate-400 text-[10px] font-bold uppercase">Posted</Text>
                <Text className="text-sm font-black text-slate-700">Today</Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* 4. Bottom Fixed Action Bar - Floating Style */}
      <View className="absolute px-2 bottom-8 left-6 right-6">
        <TouchableOpacity
          onPress={makeCall}
          activeOpacity={0.9}
          className="bg-[#1A3BA0] flex-row items-center justify-center h-20 rounded-[30px] shadow-2xl shadow-blue-500 border-b-4 border-blue-900"
        >
          <View className="bg-white/20 p-2.5 rounded-2xl mr-4">
            <Phone size={24} color="white" fill="white" />
          </View>
          <Text className="text-xl font-black tracking-tight text-white">Call Seller Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ItemView;