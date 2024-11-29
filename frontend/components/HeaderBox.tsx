import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import MicSwitch from "./MicSwitch";
import { usePathname } from "expo-router";
import { icons } from "@/constants";
import { useAppContext } from "@/providers/appContext";

interface HeaderBoxProps {
  title: string;
  paragraph: string;
}

const HeaderBox: React.FC<HeaderBoxProps> = ({ title, paragraph }) => {
  const path = usePathname();

  const { gender } = useAppContext()


  return (
    <View className="flex flex-col p-4 bg-purple-400 w-full rounded-b-3xl">
      {/* First Row */}
      <View className="flex flex-row justify-between items-center mb-4">
        {path !== "/" && (
          <View>
            <MicSwitch />
          </View>
        )}
        <View className="flex flex-row justify-center align-center">
          <Text className="text-white font-bold text-lg">Sanket</Text>
          <Image
            source={require("@/assets/icons/ear.png")}
            style={{ width: 30, height: 30 }}
          />
        </View>
        <View>
          <Image
            source={gender === "Male" ? icons.avatar_male : gender === "Female" ? icons.avatar_female : icons.undisclosed}
            style={{ width: 50, height: 50 }}
          />
        </View>
      </View>

      {/* Second Column */}
      <View className="flex flex-col p-4">
        <Text className="text-gray-100">{paragraph}</Text>
        <Text className="text-4xl text-white font-bold mb-2">{title}</Text>
      </View>
    </View>
  );
};

export default HeaderBox;
