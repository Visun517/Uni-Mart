import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { GetAllPosts } from "@/src/Service/PostService";
import Post from "../../src/types/Post";
import PostCard from "@/src/Components/PostCard";
import { router } from "expo-router";
import { Search, Bell, SlidersHorizontal } from "lucide-react-native";
import { useAuth } from "@/src/Context/AuthContext";

function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Books",
    "Furniture",
    "Vehicles",
  ];

  const fetchPosts = async () => {
    try {
      const data = await GetAllPosts();
      setPosts(data);
    } catch (error) {
      console.log(error);
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

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.desc.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView className="flex-1 bg-white mt-7">
      <View className="px-6 flex-1 pt-4">
        {/* 1. Header Section */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-gray-400 font-medium text-base">
              Hello, 👋
            </Text>
            <Text className="text-2xl font-black text-slate-900 leading-7">
              {user?.displayName || "Uni-Mart User"}
            </Text>
          </View>
          <TouchableOpacity className="bg-slate-100 p-3 rounded-full">
            <Bell size={22} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {/* 2. Modern Search Bar */}
        <View className="flex-row items-center space-x-3 mb-6 gap-3">
          <View className="flex-1 flex-row items-center bg-slate-100 px-4 h-14 rounded-2xl">
            <Search size={20} color="#94a3b8" />
            <TextInput
              placeholder="Search items..."
              className="flex-1 ml-3 text-slate-900 font-medium h-full"
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
          <TouchableOpacity className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-200">
            <SlidersHorizontal size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* 3. Horizontal Categories */}
        <View className="mb-6">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item)}
                className={`px-6 py-3 rounded-2xl mr-3 ${
                  selectedCategory === item
                    ? "bg-blue-600 shadow-lg shadow-blue-200"
                    : "bg-slate-50 border border-slate-100"
                }`}
              >
                <Text
                  className={`font-bold ${selectedCategory === item ? "text-white" : "text-slate-500"}`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>

        {/* 4. Results Info */}
        <View className="flex-row justify-between items-end mb-4 px-1">
          <Text className="text-xl font-black text-slate-900">
            {searchQuery ? "Search Results" : "Recent Ads"}
          </Text>
          <Text className="text-gray-400 font-bold text-xs">
            {filteredPosts.length} Items Found
          </Text>
        </View>

        {/* 5. The Posts Grid */}
        {loading ? (
          <View className="flex-1 justify-center">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => (
              <PostCard
                post={item}
                onPress={() => router.push(`/listing/${item.id}`)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View className="mt-10 items-center">
                <Text className="text-gray-400 font-medium">
                  No items match your criteria.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default Home;
