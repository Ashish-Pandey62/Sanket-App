import { TabTriggerSlotProps } from "expo-router/ui";
import { forwardRef, Ref } from "react";
import { Pressable, View, Image, StyleSheet } from "react-native";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

const TabBarButton = forwardRef(
  ({ children, isFocused, type, ...props }: (TabTriggerSlotProps & {type:string}), ref: Ref<View>) => {
    return (
      <Pressable
      ref={ref}
      {...props}
      >
        {type === "home" ? (
          <Ionicons name="home" size={30} color={'#B28CFF'}/>
        ) : type === "alerts" ? (
          <CustomButton icon={"notifications-outline"} title="Alerts" onPress={()=>{}} disabled={false} isTab={true} />
        ) : type === "voices" ? (
          <CustomButton icon={"add-sharp"} title="Voices" onPress={()=>{}} disabled={false} isTab={true} />
        ) : null}
      </Pressable>
    );
  }
);

export default TabBarButton
