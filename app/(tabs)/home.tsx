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
  Alert,
} from "react-native";
import { GetAllPosts } from "@/src/Service/PostService";
import Post from "../../src/types/Post";
import PostCard from "@/src/Components/PostCard";
import { Search, Bell } from "lucide-react-native";
import { useAuth } from "@/src/Context/AuthContext";
import { useRouter } from "expo-router";
import { addToCart } from "@/src/Service/CartService";

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

  const handleAddToCart = async (post : Post) => {
    try {
      await addToCart(post);
      Alert.alert("Success", "Item added to your cart!");
    } catch (error) {
      Alert.alert("Error", "Could not add to cart");
    }
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
    <SafeAreaView className="flex-1 bg-white">
      {/* --- 1. Modern Branded Header --- */}
      <View className="bg-[#1A3BA0] pt-4 pb-12 px-8 rounded-b-[45px] shadow-2xl">
        <View className="flex-row items-center justify-between mt-10">
          <View>
            <Text className="text-sm font-bold tracking-widest uppercase text-blue-100/70">
              Hello, 👋
            </Text>
            <Text className="text-3xl font-black tracking-tight text-white">
              {user?.displayName || "Uni-Mart User"}
            </Text>
          </View>
          <TouchableOpacity className="p-3 border shadow-sm bg-white/10 rounded-2xl border-white/20">
            <Bell size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- 2. Floating Search Bar --- */}
      <View className="px-8 -mt-8 shadow-2xl shadow-slate-400">
        <View className="flex-row items-center bg-white h-16 rounded-[25px] px-5 border border-slate-50">
          <Search size={22} color="#94a3b8" />
          <TextInput
            placeholder="Search for essentials..."
            className="flex-1 h-full ml-3 text-slate-800 font-semibold text-[16px]"
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View className="flex-1 px-6 mt-8">
        {/* --- 3. Categories Horizontal Section --- */}
        <View className="mb-8">
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-[2px] ml-1 mb-4">
            Explore Categories
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item)}
                activeOpacity={0.8}
                className={`px-7 py-3.5 rounded-[20px] mr-3 shadow-sm ${
                  selectedCategory === item
                    ? "bg-[#1A3BA0] shadow-blue-400"
                    : "bg-slate-50 border border-slate-100"
                }`}
              >
                <Text
                  className={`font-bold text-sm ${
                    selectedCategory === item ? "text-white" : "text-slate-500"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* --- 4. Main Feed Section --- */}
        <View className="flex-row items-baseline justify-between px-1 mb-5">
          <Text className="text-2xl font-black tracking-tight text-slate-900">
            Recent Listings
          </Text>
          <Text className="text-xs font-bold uppercase text-slate-400">
            {filteredPosts.length} items
          </Text>
        </View>

        {loading ? (
          <View className="items-center justify-center flex-1 -mt-20">
            <ActivityIndicator size="large" color="#1A3BA0" />
            <Text className="mt-4 font-medium text-slate-400">
              Fetching ads...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
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
                onPress={() => router.push(`/listing/${item.id}`)}
                onAddToCart={() => handleAddToCart(item)}
              />
            )}
            ListEmptyComponent={
              <View className="items-center justify-center px-10 mt-20">
                <View className="p-8 mb-5 rounded-full bg-slate-50">
                  <Search size={40} color="#cbd5e1" />
                </View>
                <Text className="text-lg font-bold text-center text-slate-400">
                  No items found match your search.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-4"
                >
                  <Text className="text-[#1A3BA0] font-black uppercase text-xs tracking-widest">
                    Clear Filters
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

export default Home;
