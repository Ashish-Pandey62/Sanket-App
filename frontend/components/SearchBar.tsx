import { Ionicons } from "@expo/vector-icons";
import { View, Text, TextInput } from "react-native";

const SearchBar = () => {

    return (
        <View className="bg-white self-stretch mx-5 rounded-lg px-4 py-4 flex-row justify-start items-center gap-4 border-gray-400/30 border-[3px]">
            <Ionicons name="search" color={"purple"} className="border-r-2 border-primary pr-3" size={40} />
            <TextInput placeholder="Eg: Infant cry" className="border-b-2 w-[220px] border-gray-400 h-full text-lg focus:outline-none placeholder:text-gray-500/80" />
        </View>
    );
  };
  
export default SearchBar;