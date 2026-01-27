import { useAuth } from "@/src/hooks/useAuth";
import "../global.css";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
function index() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-50">
        <ActivityIndicator size="large" color="#4ade80" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/home" />;
  } else {
    return <Redirect href="/login" />;
  }
}

export default index;
