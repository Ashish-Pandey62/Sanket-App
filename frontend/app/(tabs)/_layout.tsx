import { TabSlot, Tabs, TabTrigger, TabList } from "expo-router/ui";
import { Text } from "react-native";
import { StatusBar } from "expo-status-bar";

import PorcupineProvider from "@/providers/porcupine";
import { io, Socket } from "socket.io-client";
import { useEffect } from "react";
import { Buffer } from "buffer";

import { requestNotificationPermission } from "@/utils/permissions";
import {
  initializeNotifications,
  triggerNotification,
  triggerVibration,
} from "@/utils/notifications";
import { initializeAudioRecorder } from "@/utils/audio";
import {
  allowAudioPlaybackFromBackground,
  playARandomSound,
} from "@/utils/playSound";
import MyTabBar from "@/components/MyTabBar";
import TabBarButton from "@/components/TabBarButton";
import { router } from "expo-router";
import { useAppContext } from "@/providers/appContext";

// WebSocket related code goes here............................

interface ServerToClient {
  alert: ({ sound_label }: { sound_label: string }) => void;
}

interface ClientToServer {
  storeChunk: (buffer: Buffer) => void;
  wakeWord: () => void;
}

const socket: Socket<ServerToClient, ClientToServer> = io(
  "http://10.10.11.40:3000/"
);

// WebSocket related code goes ends here............................

export default function RootLayout() {
  //All setup related code goes here..............................

  const { isVibrating, setIsVibrating } = useAppContext()

  useEffect(() => {
    requestNotificationPermission();

    initializeNotifications();

    initializeAudioRecorder((data) => {
      //This function gets executed "sampleRate: 16000" many times per second after recorder starts.

      const audioBuffer = Buffer.from(data, "base64");

      // Sending the data to the backend continuously start here..................

      socket.emit("storeChunk", audioBuffer);

      // Sending the data to the backend continuously ends here..................
    });

    // this is just there to make sure audio can play in the background, if not required you may remove it
    allowAudioPlaybackFromBackground();

    // setup for event listener from the backend starts here................................................

    socket.on("alert", async ({ sound_label }) => {

      console.log(sound_label)

      if (sound_label === ""){
        triggerNotification({});

        const vibrationTime = 2000
        setIsVibrating(true)
        triggerVibration({ duration: vibrationTime });
        setTimeout(() => setIsVibrating(false), vibrationTime);

      } else if (sound_label === "alert") {

        triggerNotification({});
        setIsVibrating(true)
        triggerVibration({ duration: 2000, repeat: true });

      }
      
      //temporary
      triggerNotification({});

      // await playARandomSound();

      router.push("/modal")
    });

    //setup for event listener from the backend ends here................................................
  }, []);

  //All setup related code ends here..............................

  const detectionCallback = async (keywordIndex: number) => {
    if (keywordIndex === 2) {
      console.log(`detected porcupine...`);
    } else if (keywordIndex === 1) {
      console.log(`detected bumblebee...`);
    } else if (keywordIndex === 0) {
      console.log(`At your service sir....`);

      //Sending the signal to the backend on detection starts here..............

      // socket.emit("wakeWord");
      
      //Sending the signal to the backend on detection ends here..............
    }
    socket.emit("wakeWord");
  };

  return (
    <PorcupineProvider detectionCallback={detectionCallback}>
      <StatusBar style="dark" backgroundColor="#c084fc" />
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
