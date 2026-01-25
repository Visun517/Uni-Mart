import CustomButton from "@/src/Components/CustomButton";
import { logoutUser } from "@/src/Service/AuthService";
import { router } from "expo-router";
import { View, Text, SafeAreaView, Alert } from "react-native";

function Home() {
  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/register");
    } catch (error) {
      Alert.alert("Error", "Logout failed. Please try again.");
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="items-center justify-center flex-1 px-6">
        {/* White Card Box */}
        <View className="items-center justify-center w-full p-10 bg-white shadow-xl rounded-3xl">
          <Text className="text-3xl font-black text-blue-600">Home Screen</Text>
          <Text className="mt-2 text-gray-500">Welcome back to Uni-Mart!</Text>

          <CustomButton title="Logout" onPress={handleLogout} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Home;
