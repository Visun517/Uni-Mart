import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MapPin, Heart, ShoppingBag } from 'lucide-react-native';

const PostCard = ({ post, onPress }: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white rounded-[32px] mb-6 overflow-hidden shadow-xl shadow-slate-200 border border-slate-50 w-[47%]"
    >
      {/* Image Section */}
      <View className="relative">
        <Image
          source={{ uri: post.imageUrl }}
          className="w-full h-48"
          resizeMode="cover"
        />
        
        {/* Floating Heart Icon - සාමාන්‍යයෙන් modern apps වල පවතින අංගයකි */}
        {/* <TouchableOpacity 
          className="absolute top-3 right-3 bg-white/60 p-2 rounded-full backdrop-blur-md"
          onPress={() => console.log("Added to wishlist")}
        >
          <Heart size={16} color="#475569" />
        </TouchableOpacity> */}

        {/* Category Badge */}
        <View className="absolute bottom-3 left-3 bg-white/90 px-3 py-1 rounded-2xl shadow-sm">
          <Text className="text-[10px] font-bold text-slate-800">
            {post.category}
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <View className="p-4 bg-white">
        {/* Title */}
        <Text className="text-slate-900 font-bold text-base leading-5 mb-1" numberOfLines={1}>
          {post.title}
        </Text>

        {/* Price Tag */}
        <View className="flex-row items-center justify-between">
          <Text className="text-blue-600 font-black text-lg">
            Rs.{post.price.toLocaleString()}
          </Text>
        </View>

        {/* Location & Meta info */}
        <View className="flex-row items-center mt-3 pt-3 border-t border-slate-50">
          <View className="bg-slate-100 p-1 rounded-full mr-2">
            <MapPin size={10} color="#64748b" />
          </View>
          <Text className="text-[10px] font-medium text-slate-400" numberOfLines={1}>
            University Campus
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;