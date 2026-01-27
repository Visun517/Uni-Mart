import { useAuth } from "@/src/hooks/useAuth";
import "../global.css";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(tabs)/home"); 
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [user, loading]);

  return (
    <View className="items-center justify-center flex-1 bg-white">
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}

export default Index;