import React, { useEffect, useMemo, useState } from "react";
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
import { Search, Bell } from "lucide-react-native";
import { useAuth } from "@/src/Context/AuthContext";
import { useRouter } from "expo-router";

function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
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

  // Filter Logic
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const isNotMine = post.sellerId !== user?.uid;
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return isNotMine && matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-white pt-10 mt-2">
      <View className="px-6 flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-gray-400 font-medium">Hello, 👋</Text>
            <Text className="text-2xl font-black text-slate-900">
              {user?.displayName || "Uni-Mart User"}
            </Text>
          </View>
          <TouchableOpacity className="bg-slate-100 p-3 rounded-full">
            <Bell size={22} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-slate-100 px-4 h-14 rounded-2xl mb-6">
          <Search size={20} color="#94a3b8" />
          <TextInput
            placeholder="Search items..."
            className="flex-1 ml-3 text-slate-900 font-medium h-full"
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <View className="mb-6">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item)}
                className={`px-6 py-3 rounded-2xl mr-3 ${
                  selectedCategory === item
                    ? "bg-blue-600"
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
          />
        </View>

        {/* List */}
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" className="mt-10" />
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <PostCard
                post={item}
                onPress={() => router.push(`/listing/${item.id}`)}
              />
            )}
            ListEmptyComponent={
              <View className="mt-10 items-center">
                <Text className="text-gray-400">
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
