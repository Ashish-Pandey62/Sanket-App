import { View } from "react-native";
import { forwardRef } from "react";

const MyTabBar = forwardRef(
  ({ children }: { children: React.ReactNode }, ref) => {
    return (
      <View className="bg-transparent p-3">
        <View className="bg-white p-3 rounded-2xl flex-row justify-around elevation-sm">{children}</View>
      </View>
    );
  }
);

export default MyTabBar;
