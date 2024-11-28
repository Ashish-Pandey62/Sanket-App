import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Vibration,
} from "react-native";
import { alerts } from "@/constants";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AlertCancelButton from "@/components/AlertCancelButton";
import { useAppContext } from "@/providers/appContext";

const ModalScreen = () => {
  const { isVibrating, setIsVibrating, modelKey, setIsRecording } =
    useAppContext();

  const currentAlert = alerts.filter(
    ({ alertKey }) => alertKey === modelKey
  )[0];

  const closeModal = () => {
    if (isVibrating) {
      setIsVibrating(false);
      Vibration.cancel();
    }

    router.back();
  };

  return (
    <Pressable
      onPress={closeModal}
      className="flex-1 my-auto p-3 justify-center items-center"
    >
      <View className="w-4/5 h-1/3 justify-center items-center bg-white rounded-md flex-col">
        <View className="flex-row flex-2 items-center justify-around pt-5">
          <View>
            <Image source={currentAlert.icon} style={styles.image} />
          </View>
          <View className="flex-col w-3/5 items-stretch">
            <Text className="text-lg font-semibold">
              {currentAlert.alertTitle}
            </Text>
            <Text className="text-gray-500 text-sm">
              {currentAlert.alertDescription}
            </Text>
          </View>
        </View>
        <View className="flex-col flex-1 items-center justify-center">
          <Ionicons name="warning" size={80} color={"orange"} />
          <AlertCancelButton onPress={closeModal} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
  },
});

export default ModalScreen;
