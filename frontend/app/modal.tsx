import { View, Text, Pressable, Image, StyleSheet } from "react-native"
import { icons } from "@/constants";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AlertCancelButton from "@/components/AlertCancelButton";
const ModalScreen = () => {
    return (
        <Pressable
            onPress={() => {
                router.back();
            }}
            className="flex-1 my-auto p-3 justify-center items-center"
        >
            <View className="w-4/5 h-1/3 justify-center items-center bg-white rounded-md flex-col">
                <View className="flex-row flex-2 items-center justify-around pt-5">
                    <View>
                        <Image source={icons.avatar_male} style={styles.image}/>
                    </View>
                    <View className="flex-col w-3/5 items-stretch">
                        <Text className="text-lg font-semibold">Someone Called You!</Text>
                        <Text className="text-gray-500 text-sm">
                            Your name was detected, please see your surroundings!
                        </Text>
                    </View>
                </View>
                <View className="flex-col flex-1 items-center justify-center">
                    <Ionicons name="warning" size={80} color={'orange'} />
                    <AlertCancelButton onPress={()=>{router.back();
                    }}/>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 60,
        height: 60,
    }
})

export default ModalScreen;