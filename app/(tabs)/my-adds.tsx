import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Bell, LayoutGrid, Hexagon, Plus } from "lucide-react-native";

import PostCard from "@/src/Components/PostCard";
import { useAuth } from "@/src/Context/AuthContext";
import { GetUserPosts, DeletePost } from "@/src/Service/PostService"; 
import Post from "@/src/types/Post";

function MyAdds() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const data = await GetUserPosts();
      setPosts(data);
    } catch (error) {
      console.log("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handlePostPress = (item: Post) => {
    Alert.alert(
      "Manage Ad",
      "What would you like to do with this advertisement?",
      [
        { text: "View Ad", onPress: () => router.push(`/listing/${item.id}`) },
        { text: "Edit Ad", onPress: () => router.push(`/listing/edit/${item.id}`) },
        { text: "Delete Ad", style: "destructive", onPress: () => confirmDelete(item.id) },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const confirmDelete = (postId: string) => {
    Alert.alert(
      "Are you sure?",
      "Once deleted, you cannot recover this advertisement.",
      [
        { text: "No" },
        {
          text: "Yes, Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await DeletePost(postId);
              Alert.alert("Success", "Ad deleted successfully.");
              fetchPosts(); 
            } catch (error) {
              Alert.alert("Error", "Failed to delete the ad.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#1A3BA0" />

      {/* --- 1. Top Branded Header (Consistent with Home/Add) --- */}
      <View className="bg-[#1A3BA0] pt-14 pb-20 px-8 rounded-b-[45px] shadow-2xl">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="p-2 mr-4 border bg-white/10 rounded-xl border-white/20">
              <Hexagon size={28} color="white" />
            </View>
            <View>
              <Text className="text-sm font-bold tracking-widest uppercase text-blue-100/70">Your Inventory</Text>
              <Text className="text-3xl font-black tracking-tight text-white">My Ads</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => router.push("/add-item")}
            className="p-3 border bg-white/10 rounded-2xl border-white/20"
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- 2. Floating Summary Card --- */}
      <View className="px-8 -mt-10">
        <View className="flex-row items-center justify-between p-6 bg-white border shadow-xl rounded-3xl shadow-slate-400 border-slate-50">
          <View>
            <Text className="text-xs font-bold tracking-widest uppercase text-slate-400">Active Listings</Text>
            <Text className="mt-1 text-4xl font-black text-slate-900">{posts.length}</Text>
          </View>
          <View className="p-4 bg-blue-50 rounded-3xl">
            <LayoutGrid size={32} color="#1A3BA0" />
          </View>
        </View>
      </View>

      {/* --- 3. Listings Grid --- */}
      <View className="flex-1 px-6 mt-8">
        <View className="flex-row items-center justify-between px-1 mb-4">
          <Text className="text-xl font-black text-slate-900">Manage Items</Text>
          <TouchableOpacity onPress={onRefresh}>
             <Text className="text-xs font-bold text-blue-600 uppercase">Refresh</Text>
          </TouchableOpacity>
        </View>
        
        {loading && !refreshing ? (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#1A3BA0" />
            <Text className="mt-4 font-medium text-slate-400">Syncing your ads...</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor="#1A3BA0" 
              />
            }
            renderItem={({ item }) => (
              <PostCard
                post={item}
                onPress={() => handlePostPress(item)} 
              />
            )}
            ListEmptyComponent={
              <View className="items-center justify-center px-10 mt-20">
                <View className="p-10 mb-6 rounded-full bg-slate-50">
                    <LayoutGrid size={48} color="#cbd5e1" />
                </View>
                <Text className="text-lg font-bold text-center text-slate-400">
                  No advertisements yet.
                </Text>
                <TouchableOpacity 
                    onPress={() => router.push("/add-item")}
                    className="mt-5 bg-[#1A3BA0] px-8 py-4 rounded-2xl shadow-lg shadow-blue-200"
                >
                    <Text className="font-black text-white">Create New Ad</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

export default MyAdds;