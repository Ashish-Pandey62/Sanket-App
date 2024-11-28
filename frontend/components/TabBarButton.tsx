import { TabTriggerSlotProps } from "expo-router/ui";
import { Children, forwardRef, Ref } from "react";
import { Pressable, View, Image, StyleSheet } from "react-native";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";

const TabBarButton = forwardRef(
  ({ children, isFocused, type, ...props }: (TabTriggerSlotProps & {type:string}), ref: Ref<View>) => {
    return (
      <Pressable
      ref={ref}
      {...props}
      >
        {type === "home" ? (
          <Image source={icons.home} style={styles.icon} />
        ) : type === "alerts" ? (
          <CustomButton icon={icons.bell} title="Alerts" onPress={()=>{}} disabled={false} isTab={true} />
        ) : type === "voices" ? (
          <CustomButton icon={icons.plus} title="Voices" onPress={()=>{}} disabled={false} isTab={true} />
        ) : null}
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
  }
})

export default TabBarButton
