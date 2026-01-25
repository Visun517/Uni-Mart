import React from 'react';
import { Text, Pressable, PressableProps } from 'react-native';

interface CustomButtonProps extends PressableProps {
  title: string;
}

const CustomButton = ({ title, ...props }: CustomButtonProps) => {
  return (
    <Pressable
      className="w-full py-4 mb-6 bg-blue-600 rounded-xl active:bg-blue-700"
      {...props}
    >
      <Text className="text-lg font-bold text-center text-white">
        {title}
      </Text>
    </Pressable>
  );
};

export default CustomButton;