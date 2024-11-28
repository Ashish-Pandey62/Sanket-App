import { View, Text, Pressable, Vibration } from "react-native";

import { router } from "expo-router";
import { useAppContext } from "@/providers/appContext";

const ModalScreen = () => {
  const { isVibrating, setIsVibrating } = useAppContext();

  return (
    <Pressable
      onPress={() => {
        if (isVibrating) {
          setIsVibrating(false);
          Vibration.cancel();
        }
        router.back();
      }}
      className="flex-1 my-auto p-3 justify-center items-center"
    >
      <View className="w-4/5 h-1/2 justify-center items-center bg-white rounded-md">
        <Text>This is a modal</Text>
      </View>
    </Pressable>
  );
};

export default ModalScreen;
