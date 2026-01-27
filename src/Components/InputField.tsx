import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface CustomInputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
}

const InputField = ({ label, icon, ...props }: CustomInputProps) => {
  return (
    <View className="w-full mb-4">
      <Text className="mb-2 ml-1 font-semibold text-gray-600">{label}</Text>
      <View className="flex-row items-center w-full px-4 border border-gray-200 rounded-2xl bg-gray-50 focus:border-blue-500">
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput
          placeholderTextColor="#9CA3AF"
          className="flex-1 py-4 text-base text-gray-700"
          {...props}
        />
      </View>
    </View>
  );
};

export default InputField;
