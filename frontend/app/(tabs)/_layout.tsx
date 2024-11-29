import { TabSlot, Tabs, TabTrigger, TabList } from "expo-router/ui";

import PorcupineProvider from "@/providers/porcupine";
import { useEffect } from "react";
import { Buffer } from "buffer";

import { requestNotificationPermission } from "@/utils/permissions";
import {
  initializeNotifications,
  triggerNotification,
  triggerQuickVibration,
  triggerVibration,
} from "@/utils/notifications";
import { initializeAudioRecorder, updateAudioRecorder } from "@/utils/audio";
import {
  allowAudioPlaybackFromBackground,
} from "@/utils/playSound";
import MyTabBar from "@/components/MyTabBar";
import TabBarButton from "@/components/TabBarButton";
import { router } from "expo-router";
import { useAppContext, AlertKeys, Gender } from "@/providers/appContext";
import { ToastAndroid } from "react-native";

export default function RootLayout() {
  //All setup related code goes here..............................

  const { setIsVibrating, setModelKey, isStoring, alertEnabled, socket, setTotalAlertCounts } =
    useAppContext();

  const alertHandler = async ({ sound_label }: { sound_label: AlertKeys }) => {
    if (sound_label === "fireAlarm" && alertEnabled[1]) {
      setTotalAlertCounts((prev)=>{
        const newArr = [...prev]
        newArr[1] +=1
        return newArr
      })
      triggerNotification({
        title: "Fire alarm!",
        body: "There is an alarm ringing!",
      });

      setIsVibrating(true);
      triggerVibration({ duration: 500, repeat: true });

      router.push("/modal");
    } else if (sound_label === "infantCrying" && alertEnabled[2]) {
      setTotalAlertCounts((prev)=>{
        const newArr = [...prev]
        newArr[2] +=1
        return newArr
      })
      triggerNotification({
        title: "Infant Crying",
        body: "An infant crying sound is detected!",
      });
      const vibrationTime = 1000;
      setIsVibrating(true);
      triggerQuickVibration({ duration: vibrationTime });
      setTimeout(() => setIsVibrating(false), vibrationTime);

      router.push("/modal");
    } else if (sound_label === "petSound" && alertEnabled[4]) {
      setTotalAlertCounts((prev)=>{
        const newArr = [...prev]
        newArr[4] +=1
        return newArr
      })
      triggerNotification({
        title: "Pet Sound",
        body: "A pet is making some sound",
      });

      const vibrationTime = 1000;
      setIsVibrating(true);
      triggerQuickVibration({ duration: vibrationTime });
      setTimeout(() => setIsVibrating(false), vibrationTime);

      router.push("/modal");
    } else if (sound_label === "doorBell" && alertEnabled[3]) {
      setTotalAlertCounts((prev)=>{
        const newArr = [...prev]
        newArr[3] +=1
        return newArr
      })
      triggerNotification({
        title: "Ding Dong!",
        body: "Some one is at your door",
      });

      const vibrationTime = 1000;
      setIsVibrating(true);
      triggerQuickVibration({ duration: vibrationTime });
      setTimeout(() => setIsVibrating(false), vibrationTime);

      router.push("/modal");
    }

    // await playARandomSound();

    setModelKey(sound_label);
  };

  useEffect(() => {
    requestNotificationPermission();

    initializeNotifications();

    initializeAudioRecorder((data) => {
      //This function gets executed "sampleRate: 16000" many times per second after recorder starts.

      const audioBuffer = Buffer.from(data, "base64");

      // Sending the data to the backend continuously start here..................

      if (isStoring){
        socket.emit("storeThis", audioBuffer)
      } else {
        socket.emit("storeChunk", audioBuffer);
      }

      // Sending the data to the backend continuously ends here..................
    });

    socket.on("enrollmentSuccess", () => {
      ToastAndroid.show("User Registered Successfully!", ToastAndroid.SHORT)
    })

    const wakeWordHandler = ({ word }: { word: string }) => {
      console.log("Did you just say.. ", word)

      triggerNotification({ title: "Some called you!", body: "Look around! Someone is reaching out to you!" })
      triggerQuickVibration({ duration: 1000 })
    }

    socket.on("wakeWord", wakeWordHandler)

    // this is just there to make sure audio can play in the background, if not required you may remove it
    allowAudioPlaybackFromBackground();
  }, []);

  useEffect(() => {
    updateAudioRecorder((data) => {
      //This function gets executed "sampleRate: 16000" many times per second after recorder starts.

      const audioBuffer = Buffer.from(data, "base64");

      // Sending the data to the backend continuously start here..................

      if (isStoring){
        socket.emit("storeThis", audioBuffer)
      } else {
        socket.emit("storeChunk", audioBuffer);
      }
      // socket.emit("storeChunk", {audioBuffer, isRecording});

      // Sending the data to the backend continuously ends here..................
    })
  }, [isStoring])

  useEffect(() => {
    // setup for event listener from the backend starts here................................................

    socket.on("alert", alertHandler);

    return () => {
      socket.off("alert", alertHandler);
    };

    //setup for event listener from the backend ends here................................................
  }, [alertEnabled]);

  //All setup related code ends here..............................

  const detectionCallback = async (keywordIndex: number) => {
    socket.emit("wakeWord");

    console.log("Pico voice detected the word!")
    triggerNotification({ title: "Pico detected Wake Word", body: "A wake word has been detected!" })
    
    const vibrationTime = 1000
    setIsVibrating(true);
    triggerQuickVibration({ duration: vibrationTime })
    setTimeout(() => setIsVibrating(false), vibrationTime)
    setModelKey("nameAlert")
    setTotalAlertCounts((prev)=>{
      const newArr = [...prev]
      newArr[0] +=1
      return newArr
    })
    router.push("/modal");
  };

  return (
    <PorcupineProvider detectionCallback={detectionCallback}>
      {/* <StatusBar style="dark" backgroundColor="#c084fc" /> */}
      <Tabs className="bg-bg_white">
        <TabSlot />
        <TabList asChild>
          <MyTabBar>
            <TabTrigger name="home" href={"/(tabs)/home"} asChild>
              <TabBarButton type="home" />
            </TabTrigger>
            <TabTrigger name="alerts" href={"/(tabs)/alerts"} asChild>
              <TabBarButton type="alerts" />
            </TabTrigger>
            <TabTrigger name="voices" href={"/(tabs)/register"} asChild>
              <TabBarButton type="voices" />
            </TabTrigger>
          </MyTabBar>
        </TabList>
      </Tabs>
    </PorcupineProvider>
  );
}
