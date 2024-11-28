import HeaderBox from "@/components/HeaderBox";
import { useAppContext } from "@/providers/appContext";
import { usePorcupineContext } from "@/providers/porcupine";
import { startRecordingAudio, stopRecordingAudio } from "@/utils/audio";
import { startBackgroundJob, stopBackgroundJob } from "@/utils/background";
import { View, Text, Button, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AlertItems from "@/components/AlertItems";

const HomeScreen = () => {
  const { startListeningToWakeWords, stopListeningToWakeWords } =
    usePorcupineContext();
    const { setIsRecording } = useAppContext()

  const startRecording = async () => {
    await startBackgroundJob();
    await startListeningToWakeWords();

    setIsRecording(true)
    startRecordingAudio();
  };

  const stopRecording = async () => {
    await stopListeningToWakeWords();
    await stopBackgroundJob();

    setIsRecording(false)
    await stopRecordingAudio();
  };

  return (
    <SafeAreaView className="flex-1 items-center gap-5">
      <HeaderBox title="Welcome" paragraph="Don't worry I'll inform you if someone calls you" />
      <AlertItems />
    </SafeAreaView>
  );
};

export default HomeScreen;
