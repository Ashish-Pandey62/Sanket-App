import { Switch } from "react-native";
import React from "react";
import { useAppContext } from "@/providers/appContext";
import { startBackgroundJob, stopBackgroundJob } from "@/utils/background";
import { startRecordingAudio, stopRecordingAudio } from "@/utils/audio";
import { usePorcupineContext } from "@/providers/porcupine";

const MicSwitch = () => {
  const { startListeningToWakeWords, stopListeningToWakeWords } =
    usePorcupineContext();
  const { setIsRecording, isRecording } = useAppContext();

  const startRecording = async () => {
    await startBackgroundJob();
    await startListeningToWakeWords();

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
    <Switch
      thumbColor='#B28CFF' trackColor={{false:'white', true:'#BFA4E7'}}
      value={isRecording}
      onValueChange={async (on) => {
        if (on) {
          await startRecording();
        } else {
          await stopRecording();
        }
      }}
    />
  );
};

export default MicSwitch;
