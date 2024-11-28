import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Vibration,
  ToastAndroid,
} from "react-native";

import Form from "@/components/Form";
import HeaderBox from "@/components/HeaderBox";
import { SafeAreaView } from "react-native-safe-area-context";
import VoiceList from "@/components/VoiceList";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAppContext } from "@/providers/appContext";
import { startRecordingAudio, stopRecordingAudio } from "@/utils/audio";
import { Gender } from "@/providers/appContext";
import { router } from "expo-router";
import { triggerVibration } from "@/utils/notifications";

const RegisterScreen = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [haveAudio, setHaveAudio] = useState<boolean>(false);

  const { isRecording, setVoices, setIsVibrating } = useAppContext();

  const handleSubmit = (
    firstName: string,
    lastName: string,
    gender: Gender
  ) => {
    if (!haveAudio) {
      ToastAndroid.show("You haven't Recorded an Voice", ToastAndroid.SHORT);
      return;
    }

    setHaveAudio(false);

    //Send the data to the Backend about who the recorded voice belongs to....
    setVoices((prevState) => [...prevState, { firstName, lastName, gender }]);
    console.log(firstName, lastName, gender);
  };

  const handleRecordStart = () => {
    setRecording(true);

    if (!isRecording) {
      startRecordingAudio();
    }

    //Emit to DB that voice should be stored
    console.log("Store the Voice from now");
  };

  const handleRecordStop = async () => {
    setRecording(false);

    if (!isRecording) {
      await stopRecordingAudio();
    }

    //Emit to DB that voice storing had ended
    console.log("Stop the storing now");
  };

  return (
    <SafeAreaView className="flex-1 justify-start items-center gap-5">
      <KeyboardAvoidingView behavior="padding">
        <ScrollView bounces={false}>
          <HeaderBox
            title="Add a Voice"
            paragraph="record and add a voice that you want recognized!"
          />
          <Pressable
            onPressIn={handleRecordStart}
            onPressOut={() => {
              setHaveAudio(true);
              handleRecordStop();
            }}
            onPress={() => {
              // const vibrationTime = 500;
              // setIsVibrating(true);
              // triggerVibration({ duration: vibrationTime, repeat: true });
              router.push("/modal");
            }}
            className={`mt-5 justify-start items-center self-center border-[12px] ${
              recording ? "border-primary" : "border-secondary/60"
            } rounded-full`}
          >
            <Ionicons
              name="mic-outline"
              color={"black"}
              size={80}
              className="bg-primary p-8 rounded-full"
            />
          </Pressable>
          {recording && (
            <Text className="font-thin text-center mt-5">Listening...</Text>
          )}
          {haveAudio && !recording && (
            <View className="justify-center items-center flex-row mt-5 gap-2">
              <Ionicons name="document" color={"#6b21a8"} />
              <Text className="font-thin text-center text-purple-800">
                A Voice is Recorded
              </Text>
            </View>
          )}
          <Text className="font-thin text-center mt-5">
            Press and Hold to record
          </Text>
          <Form onSubmit={handleSubmit} />
          <VoiceList />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
