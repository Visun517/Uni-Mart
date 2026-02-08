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
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Bell,
  LayoutGrid,
  Hexagon,
  Plus,
  Trash2,
  Edit3,
  Eye,
  AlertTriangle,
} from "lucide-react-native";

import PostCard from "@/src/Components/PostCard";
import { useAuth } from "@/src/Context/AuthContext";
import { GetUserPosts, DeletePost } from "@/src/Service/PostService";
import Post from "@/src/types/Post";
import { showMessage } from "react-native-flash-message";

function MyAdds() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<Post | null>(null);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState<string | null>(null);

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
    setSelectedItem(item);
    setIsActionModalVisible(true);
  };


  const confirmDelete = (postId: string) => {
    setPostIdToDelete(postId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteExecution = async () => {
    if (!postIdToDelete) return;

    try {
      setIsDeleteModalVisible(false);
      setLoading(true);

      await DeletePost(postIdToDelete);

      showMessage({
        message: "Ad Removed",
        description: "Your advertisement has been deleted successfully.",
        type: "success",
        icon: "success",
        backgroundColor: "#16a34a",
      });

      fetchPosts();
    } catch (error) {
      showMessage({
        message: "Delete Failed",
        description: "Something went wrong. Please try again.",
        type: "danger",
        icon: "danger",
      });
    } finally {
      setLoading(false);
      setPostIdToDelete(null);
    }
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
              <Text className="text-sm font-bold tracking-widest uppercase text-blue-100/70">
                Your Inventory
              </Text>
              <Text className="text-3xl font-black tracking-tight text-white">
                My Ads
              </Text>
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
            <Text className="text-xs font-bold tracking-widest uppercase text-slate-400">
              Active Listings
            </Text>
            <Text className="mt-1 text-4xl font-black text-slate-900">
              {posts.length}
            </Text>
          </View>
          <View className="p-4 bg-blue-50 rounded-3xl">
            <LayoutGrid size={32} color="#1A3BA0" />
          </View>
        </View>
      </View>
      {/* --- 3. Listings Grid --- */}
      <View className="flex-1 px-6 mt-8">
        <View className="flex-row items-center justify-between px-1 mb-4">
          <Text className="text-xl font-black text-slate-900">
            Manage Items
          </Text>
          <TouchableOpacity onPress={onRefresh}>
            <Text className="text-xs font-bold text-blue-600 uppercase">
              Refresh
            </Text>
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#1A3BA0" />
            <Text className="mt-4 font-medium text-slate-400">
              Syncing your ads...
            </Text>
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
              <PostCard post={item} onPress={() => handlePostPress(item)} />
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
      <Modal
        visible={isActionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsActionModalVisible(false)}
      >
        <View className="justify-end flex-1 bg-black/50">
          <View className="bg-white rounded-t-[45px] p-8 shadow-2xl">
            {/* Handle Line */}
            <View className="w-12 h-1.5 bg-slate-100 rounded-full self-center mb-6" />

            <Text className="mb-2 text-2xl font-black text-slate-800">
              Manage Advertisement
            </Text>
            <Text className="mb-8 font-medium text-slate-400">
              What would you like to do with this listing?
            </Text>

            <View className="space-y-3">
              {/* View Option */}
              <TouchableOpacity
                onPress={() => {
                  setIsActionModalVisible(false);
                  router.push(`/listing/${selectedItem?.id}`);
                }}
                className="flex-row items-center p-5 border bg-slate-50 rounded-3xl border-slate-100"
              >
                <View className="p-2 mr-4 bg-blue-100 rounded-xl">
                  <Eye size={22} color="#1A3BA0" />
                </View>
                <Text className="text-lg font-bold text-slate-700">
                  View Advertisement
                </Text>
              </TouchableOpacity>

              {/* Edit Option */}
              <TouchableOpacity
                onPress={() => {
                  setIsActionModalVisible(false);
                  router.push(`/listing/edit/${selectedItem?.id}`);
                }}
                className="flex-row items-center p-5 border bg-slate-50 rounded-3xl border-slate-100"
              >
                <View className="p-2 mr-4 bg-orange-100 rounded-xl">
                  <Edit3 size={22} color="#f59e0b" />
                </View>
                <Text className="text-lg font-bold text-slate-700">
                  Edit Details
                </Text>
              </TouchableOpacity>

              {/* Delete Option */}
              <TouchableOpacity
                onPress={() => {
                  setIsActionModalVisible(false);
                  if (selectedItem) confirmDelete(selectedItem.id);
                }}
                className="flex-row items-center p-5 border border-red-100 bg-red-50 rounded-3xl"
              >
                <View className="p-2 mr-4 bg-red-100 rounded-xl">
                  <Trash2 size={22} color="#ef4444" />
                </View>
                <Text className="text-lg font-bold text-red-600">
                  Delete Permanently
                </Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                onPress={() => setIsActionModalVisible(false)}
                className="items-center py-4 mt-4"
              >
                <Text className="text-lg font-black text-slate-400">
                  Dismiss
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="fade" // මැදින් එන නිසා fade වඩාත් ගැලපේ
      >
        <View className="items-center justify-center flex-1 px-10 bg-black/60">
          <View className="bg-white w-full rounded-[45px] p-8 items-center shadow-2xl">
            {/* Warning Icon Area */}
            <View className="p-6 mb-6 rounded-full bg-red-50">
              <AlertTriangle size={50} color="#ef4444" strokeWidth={1.5} />
            </View>

            <Text className="mb-2 text-2xl font-black text-center text-slate-800">
              Are you sure?
            </Text>
            <Text className="mb-10 font-medium leading-6 text-center text-slate-400">
              This action cannot be undone. Do you really want to delete this
              listing?
            </Text>

            <View className="w-full space-y-3">
              {/* Real Delete Button */}
              <TouchableOpacity
                onPress={handleDeleteExecution}
                className="items-center justify-center w-full h-16 bg-red-500 shadow-lg rounded-3xl shadow-red-200"
              >
                <Text className="text-lg font-black text-white">
                  Yes, Delete Ad
                </Text>
              </TouchableOpacity>

              {/* Cancel / Keep Ad Button */}
              <TouchableOpacity
                onPress={() => setIsDeleteModalVisible(false)}
                className="items-center justify-center w-full h-16 mt-3 bg-slate-100 rounded-3xl"
              >
                <Text className="text-lg font-bold text-slate-600">
                  No, Keep it
                </Text>
              </TouchableOpacity>
            </View>

            {/* Security Info */}
            <View className="flex-row items-center mt-8 opacity-20">
              <Trash2 size={12} color="black" />
              <Text className="ml-1 text-[10px] font-bold uppercase tracking-widest">
                Permanent Deletion
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default MyAdds;
