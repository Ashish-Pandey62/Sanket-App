import { Ionicons } from "@expo/vector-icons";
import Card from "./Card";
import { View, Text, Button, Pressable, Image } from "react-native";
import { Gender, useAppContext } from "@/providers/appContext";
import { playASound } from "@/utils/playSound";

import { icons } from "@/constants";

const VoiceItem: React.FC<{
  firstName: string;
  lastName: string;
  gender: Gender;
}> = ({ firstName, gender, lastName }) => {
  const { setVoices } = useAppContext();

  const playVoice = async () => {
    //Emit this to the backend

    const response = await fetch("http://10.10.11.74:3000/sound", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        gender,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Some error Occured!");
      return;
    }

    const data = await response.json();

    await playASound(data.audioData);
  };

  const deleteData = async () => {
    await fetch("http://10.10.11.74:3000/delete", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        gender,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    setVoices((prevState) => {
      return prevState.filter(
        ({ firstName: fn, lastName: ln, gender: gn }) =>
          firstName !== fn || lastName !== ln || gender !== gn
      );
    });
  };

  return (
    <Card className="flex-row px-4 items-center gap-5 my-1">
      <Image
        source={gender === "Male" ? icons.avatar_male : icons.avatar_female}
        className="w-14 h-14"
      />
      <View>
        <Text className="font-bold text-gray-500 text-xl">
          {firstName} {lastName}
        </Text>
        <Text className="text-gray-500 font-medium">{gender}</Text>
        <View className="flex-row gap-5">
          <Pressable
            className="flex-row items-center justify-start gap-1"
            onPress={deleteData}
          >
            <Text className="text-sm text-red-600">Remove</Text>
            <Ionicons name="trash" color={"#dc2626"} />
          </Pressable>
        </View>
      </View>
      <Pressable className="mr-0 ml-auto" onPress={playVoice}>
        <Ionicons name="volume-medium" size={23} />
      </Pressable>
    </Card>
  );
};

export default VoiceItem;
