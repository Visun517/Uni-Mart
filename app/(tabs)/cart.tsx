import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from "react-native";
import {
  Trash2,
  ShoppingCart,
  Hexagon,
  ArrowRight,
  ShoppingBag,
} from "lucide-react-native";
import { getCartItems, removeFromCart } from "@/src/Service/CartService";
import { router } from "expo-router";
import { showMessage } from "react-native-flash-message";

function CartScreen() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCart = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCart();
  };

  const handleRemove = async (id: string) => {
    try {
      await removeFromCart(id);
      fetchCart();

      showMessage({
        message: "Success",
        description: "Item removed from cart.",
        type: "success",
        icon: "success",
      });
    } catch (error) {
      
      showMessage({
        message: "Error",
        description: "Item removed unexpectedly from cart.",
        type: "danger",
        icon: "danger",
      });
    }
  };

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }, [cartItems]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#1A3BA0" />

      {/* --- 1. Top Branded Header --- */}
      <View className="bg-[#1A3BA0] pt-14 pb-20 px-8 rounded-b-[45px] shadow-2xl">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="p-2 mr-4 border bg-white/10 rounded-xl border-white/20">
              <Hexagon size={28} color="white" />
            </View>
            <View>
              <Text className="text-sm font-bold tracking-widest uppercase text-blue-100/70">
                Selected Items
              </Text>
              <Text className="text-3xl font-black tracking-tight text-white">
                My Cart
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-2xl font-black text-white">
              {cartItems.length}
            </Text>
            <Text className="text-blue-100/70 text-[10px] font-bold uppercase">
              Items
            </Text>
          </View>
        </View>
      </View>

      {/* --- 2. Floating Summary Card --- */}
      <View className="px-8 -mt-10">
        <View className="flex-row items-center justify-between p-6 bg-white border shadow-xl rounded-3xl shadow-slate-400 border-slate-50">
          <View>
            <Text className="text-xs font-bold tracking-widest uppercase text-slate-400">
              Subtotal Amount
            </Text>
            <Text className="mt-1 text-3xl font-black text-[#1A3BA0]">
              Rs. {totalPrice.toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity
            className="p-4 bg-slate-900 rounded-2xl"
            onPress={() => alert("Checkout flow coming soon!")}
          >
            <ArrowRight size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- 3. Cart Items List --- */}
      <View className="flex-1 px-6 mt-8">
        <Text className="px-1 mb-4 text-xl font-black text-slate-900">
          Cart Inventory
        </Text>

        {loading && !refreshing ? (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#1A3BA0" />
          </View>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.cartId}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#1A3BA0"
              />
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push(`/listing/${item.postId}`)}
                className="flex-row items-center p-4 mb-4 bg-white border shadow-xl rounded-3xl border-slate-50 shadow-slate-100"
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-20 h-20 rounded-[20px] bg-slate-100"
                />
                <View className="flex-1 ml-4">
                  <Text className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                    {item.category}
                  </Text>
                  <Text
                    className="text-lg font-bold text-slate-800"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text className="text-base font-black text-slate-900">
                    Rs. {item.price.toLocaleString()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemove(item.cartId)}
                  className="p-3 border border-red-100 bg-red-50 rounded-2xl"
                >
                  <Trash2 size={20} color="#ef4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className="items-center justify-center px-10 mt-20">
                <View className="p-10 mb-6 rounded-full bg-slate-50">
                  <ShoppingBag size={50} color="#cbd5e1" />
                </View>
                <Text className="text-lg font-bold text-center text-slate-400">
                  Your campus cart is empty.
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/home")}
                  className="mt-5 bg-[#1A3BA0] px-8 py-4 rounded-2xl shadow-lg shadow-blue-200"
                >
                  <Text className="font-black text-white">
                    Explore Marketplace
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>

      {/* --- 4. Bottom Checkout Button (Only if cart not empty) --- */}
      {cartItems.length > 0 && (
        <View className="absolute bottom-10 left-8 right-8">
          <TouchableOpacity
            activeOpacity={0.9}
            className="bg-[#1A3BA0] h-16 rounded-3xl flex-row items-center justify-center shadow-2xl shadow-blue-500"
          >
            <ShoppingCart size={20} color="white" className="mr-3" />
            <Text className="text-lg font-black text-white">
              Place Orders Now
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default CartScreen;
