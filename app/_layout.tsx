import { AuthProvider } from "@/src/Context/AuthContext";
import { Slot } from "expo-router";
import { View } from "react-native";
import { SafeAreaFrameContext } from "react-native-safe-area-context";

function _layout() {
  return (
    <SafeAreaFrameContext value={null}>
      <AuthProvider>
      <View style={{ marginTop: 0, flex: 1 }}>
        <Slot />
      </View>
      </AuthProvider>
    </SafeAreaFrameContext>
  );
}

export default _layout;
