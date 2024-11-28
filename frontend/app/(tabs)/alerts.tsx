import HeaderBox from "@/components/HeaderBox";
import { SafeAreaView } from "react-native-safe-area-context";
import AlertItems from "@/components/AlertItems";
import SearchBar from "@/components/SearchBar"

const AlertScreen = () => {

  return (
    <SafeAreaView className="flex-1 items-center gap-5">
      <HeaderBox title="Welcome" paragraph="Don't worry I'll inform you if someone calls you" />
      <SearchBar />
      <AlertItems isHome={false} />
    </SafeAreaView>
  );
};

export default AlertScreen;