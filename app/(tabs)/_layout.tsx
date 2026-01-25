import { Slot } from 'expo-router';
import { View } from 'react-native'; 
import React from 'react';

function _layout() {
  return (
      <View className="flex-1">
        <Slot />
      </View>
  );
}

export default _layout;