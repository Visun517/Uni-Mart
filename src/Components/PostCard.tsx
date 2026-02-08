import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MapPin, Heart, ShoppingBag } from 'lucide-react-native';

const PostCard = ({ post, onPress, onAddToCart }: any) => { 
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white rounded-[32px] mb-6 overflow-hidden shadow-xl shadow-slate-200 border border-slate-50 w-[47%]"
    >
      <View className="relative">
        <Image source={{ uri: post.imageUrl }} className="w-full h-48" resizeMode="cover" />
        
        {/* --- Add to Cart Floating Button --- */}
        <TouchableOpacity 
          className="absolute p-2 rounded-full shadow-sm top-3 right-3 bg-white/80 backdrop-blur-md"
          onPress={onAddToCart} 
        >
          <ShoppingBag size={18} color="#1A3BA0" />
        </TouchableOpacity>

        <View className="absolute px-3 py-1 shadow-sm bottom-3 left-3 bg-white/90 rounded-2xl">
          <Text className="text-[10px] font-bold text-slate-800">{post.category}</Text>
        </View>
      </View>

      <View className="p-4 bg-white">
        <Text className="mb-1 text-base font-bold leading-5 text-slate-900" numberOfLines={1}>
          {post.title}
        </Text>
        <Text className="text-lg font-black text-blue-600">Rs.{post.price.toLocaleString()}</Text>

        <View className="flex-row items-center pt-3 mt-3 border-t border-slate-50">
          <MapPin size={10} color="#64748b" />
          <Text className="text-[10px] font-medium text-slate-400 ml-1">University Campus</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;