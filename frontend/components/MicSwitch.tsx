import { Switch, View } from "react-native";
import React from "react";
import { useAppContext } from "@/providers/appContext";
import { startBackgroundJob, stopBackgroundJob } from "@/utils/background";
import { startRecordingAudio, stopRecordingAudio } from "@/utils/audio";
import { usePorcupineContext } from "@/providers/porcupine";
import { Ionicons } from "@expo/vector-icons";

const MicSwitch = () => {
  const { startListeningToWakeWords, stopListeningToWakeWords } =
    usePorcupineContext();
  const { setIsRecording, isRecording, alertEnabled } = useAppContext();

  const startRecording = async () => {
    await startBackgroundJob();
    if (alertEnabled[0]) {
      await startListeningToWakeWords();
    }

    setIsRecording(true);
    startRecordingAudio();
  };

  const stopRecording = async () => {
    await stopListeningToWakeWords();
    await stopBackgroundJob();

    setIsRecording(false);
    await stopRecordingAudio();
  };

  return (
    <View className="flex-row items-center">
      <Switch
        thumbColor="#B28CFF"
        trackColor={{ false: "white", true: "#BFA4E7" }}
        value={isRecording}
        onValueChange={async (on) => {
          if (on) {
            await startRecording();
          } else {
            await stopRecording();
          }
        }}
      />
      <Ionicons name="mic-outline" size={20} color={isRecording ? "#FFB200" : "white"} /> 
    </View>
  );
};

export default MicSwitch;
