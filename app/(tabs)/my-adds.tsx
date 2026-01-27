import CustomButton from "@/src/Components/CustomButton";
import { View, Text, SafeAreaView } from "react-native";

function MyAdds() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="items-center justify-center flex-1 px-6">
        {/* White Card Box */}
        <View className="items-center justify-center w-full p-10 bg-white shadow-xl rounded-3xl">
          <Text className="text-3xl font-black text-blue-600">
            MyAdds Screen
          </Text>
          <Text className="mt-2 text-gray-500">Welcome back to Uni-Mart!</Text>

          <CustomButton title="Logout" onPress={() => {}} />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default MyAdds;
