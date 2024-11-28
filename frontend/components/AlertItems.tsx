import Card from "./Card";
import { alerts, icons } from "../constants";
import { View, Image, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "@/providers/appContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AlertItems = () => {
  const { alertEnabled, setAlertEnabled } = useAppContext()

  return (
    <FlatList
      data={alerts}
      className="mx-2"
      renderItem={({ item: alert, index }) => {
        return (
          <Card
            key={Math.random().toString()}
            className="flex-row items-center justify-between bg-white mt-1 p-5 gap-4"
          >
            <View>
              <Image source={alert.icon} style={styles.image} />
            </View>
            <View className="flex-col w-3/5 items-stretch">
              <Text className="text-lg font-semibold">{alert.title}</Text>
              <Text className="text-gray-500 text-sm">{alert.description}</Text>
              <View className="rounded-2xl bg-gray-100 self-start">
                <Text className="text-sm text-gray-600 pl-1 pr-1">{`${alert.totalAlerts} Alerts today`}</Text>
              </View>
            </View>
            <Pressable className="flex-col items-center gap-1" onPress={() => {
              setAlertEnabled((prevState) => {
                const temp = [...prevState]

                temp[index] = !temp[index]

                const storeInStorage = async () => {
                  if (temp[index]){
                    const isAvailable = await AsyncStorage.getItem(`alertNo-${index}`)

                    if (isAvailable){
                      await AsyncStorage.removeItem(`alertNo-${index}`)
                    }
                  } else {
                    await AsyncStorage.setItem(`alertNo-${index}`, "Opted-Out")
                  }
                }

                storeInStorage()

                return temp
              })
            }}>
              <Ionicons name={alertEnabled[index] ? "checkmark-circle" : "remove-circle"} size={30} color={alertEnabled[index] ? "#22c55e" : "#FF8808"} />
              <View className="rounded-lg bg-gray-100 pl-2 pr-2">
                <Text className="text-xs">
                  {alertEnabled[index] ? "Active" : "Off"}
                </Text>
              </View>
            </Pressable>
          </Card>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});

export default AlertItems;
