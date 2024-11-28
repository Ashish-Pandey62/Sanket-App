import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, ImageSourcePropType, Pressable } from "react-native";

interface CustomButtonProps {
  title: string;
  icon: string;
  disabled?: boolean;
  onPress: () => void;
  isTab: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  icon,
  disabled,
  onPress,
  isTab,
}) => {
  return (
    <Pressable disabled={disabled || isTab} onPress={onPress}>
      <View
        className={`flex flex-row justify-between items-center pl-4 ${
          !isTab ? "bg-white" : "bg-gray-100"
        } w-50 rounded-tl-full rounded-bl-full rounded-tr-full rounded-br-full`}
      >
        <View>
          <Text
            className={`${
              disabled ? "text-gray-300" : "text-gray-800"
            } text-lg`}
          >
            {title}
          </Text>
        </View>
        <View
          className={`rounded-full justify-center items-center ${
            disabled ? "bg-purple-200" : "bg-purple-400"
          } ml-2 ${isTab ? "w-12 h-12" : "w-16 h-16"}`}
        >
          <View
            className={`rounded-full bg-white justify-center items-center ${
              isTab ? "w-6 h-6" : "w-8 h-8"
            } `}
          >
            <Ionicons name={icon as any} color={"#9b6ffe"} size={20} className={`${isTab ? "" : "ml-0.5"}`} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default CustomButton;
