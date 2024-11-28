import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, ImageSourcePropType, Pressable } from "react-native";


const AlertCancelButton: React.FC<{onPress: () => void}> = ({
    onPress
}) => {
  return (
    <Pressable onPress={onPress}>
      <View className="bg-orange-400 px-4 py-2 rounded-lg">
        <Text className="text-lg font-semibold">Okay</Text>
      </View>
    </Pressable>
  );
};

export default AlertCancelButton;