import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, View, Text, FlatList } from "react-native";
import VoiceItem from "./VoiceItem";

import { useAppContext } from "@/providers/appContext";

const VoiceList = () => {
  const [hidden, setHidden] = useState<boolean>(false);
  const { voices } = useAppContext()

  return (
    <View className="px-8">
      <Pressable
        onPress={() => {
          setHidden((prevState) => !prevState);
        }}
        className="flex-row justify-between items-center mb-5"
      >
        <Text className="text-gray-500 font-semibold text-lg">
          {hidden
            ? "Show all registered voices"
            : "Hide all the registered voices"}
        </Text>
        <Ionicons
          color={"#6b7280"}
          name={hidden ? "chevron-down-outline" : "chevron-up-outline"}
          size={20}
        />
      </Pressable>
      {!hidden && <FlatList
        scrollEnabled={false}
        data={voices}
        keyExtractor={() => Math.random().toString()}
        renderItem={({ item }) => <VoiceItem {...item} />}
        ListEmptyComponent={() => (
            <Text className="font-thin text-center mt-10">No voices recorded</Text>
        )}
      />}
    </View>
  );
};

export default VoiceList;
