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
} from "react-native";
import { useRouter } from "expo-router";
import { Bell, LayoutGrid, Trash2, Edit, Eye } from "lucide-react-native";

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
        {
          text: "View Ad",
          onPress: () => router.push(`/listing/${item.id}`),
        },
        {
          text: "Edit Ad",
          onPress: () => router.push(`/listing/edit/${item.id}`),
        },
        {
          text: "Delete Ad",
          style: "destructive",
          onPress: () => confirmDelete(item.id),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-4 mt-8">
        
        {/* 1. Header Section */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-base font-medium text-gray-400">Welcome back,</Text>
            <Text className="text-3xl font-black leading-9 text-slate-900">My Ads</Text>
          </View>
          <TouchableOpacity className="p-3 bg-slate-100 rounded-2xl">
            <Bell size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        <View className="bg-blue-600 p-6 rounded-[32px] mb-8 shadow-xl shadow-blue-200 flex-row justify-between items-center">
          <View>
            <Text className="text-sm font-bold tracking-wider text-blue-100 uppercase">Total Listings</Text>
            <Text className="mt-1 text-4xl font-black text-white">{posts.length}</Text>
          </View>
          <View className="p-4 bg-white/20 rounded-3xl">
            <LayoutGrid size={32} color="white" />
          </View>
        </View>

        {/* 3. List Section */}
        <Text className="px-1 mb-4 text-xl font-black text-slate-900">Manage Listings</Text>
        
        {loading && !refreshing ? (
          <View className="justify-center flex-1">
            <ActivityIndicator size="large" color="#2563eb" />
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
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />
            }
            renderItem={({ item }) => (
              <PostCard
                post={item}
                onPress={() => handlePostPress(item)} 
              />
            )}
            ListEmptyComponent={
              <View className="items-center mt-20">
                <View className="p-10 mb-4 rounded-full bg-slate-50">
                    <LayoutGrid size={48} color="#cbd5e1" />
                </View>
                <Text className="text-lg font-bold text-center text-slate-400">
                  You haven't posted any ads yet.
                </Text>
                <TouchableOpacity 
                    onPress={() => router.push("/add-item")}
                    className="mt-4"
                >
                    <Text className="text-base font-black text-blue-600">Create your first ad</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default MyAdds;