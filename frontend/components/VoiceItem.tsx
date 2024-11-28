import { Ionicons } from "@expo/vector-icons";
import Card from "./Card";
import { View, Text, Button, Pressable } from "react-native";
import { Gender } from "@/providers/appContext";

const VoiceItem: React.FC<{
  firstName: string;
  lastName: string;
  gender: Gender;
}> = ({ firstName, gender, lastName }) => {
  const playVoice = () => {

    //Emit this to the backend
    console.log("Play the voice for ", firstName, lastName)
  }

  return (
    <Card className="flex-row px-4 items-center gap-5 my-1">
      <Ionicons name="man" size={30} />
      <View>
        <Text className="font-bold text-gray-500 text-xl">{firstName} {lastName}</Text>
        <Text className="text-gray-500 font-medium">{gender}</Text>
        <View className="flex-row gap-5">
            <Pressable className="flex-row items-center justify-start gap-1">
                <Text className="text-sm text-red-600">Remove</Text>
                <Ionicons name="trash" color={"#dc2626"} />
            </Pressable>
            <Pressable className="flex-row items-center justify-start gap-1">
                <Text className="text-sm text-secondary">Change</Text>
                <Ionicons name="notifications" color={"#BFA4E7"} />
            </Pressable>
        </View>
      </View>
      <Pressable className="mr-0 ml-auto" onPress={playVoice}>
        <Ionicons name="volume-medium" size={23}/>
      </Pressable>
    </Card>
  );
};

export default VoiceItem;
