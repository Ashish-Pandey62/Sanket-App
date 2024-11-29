import { SplashScreen, Stack } from "expo-router";

import "../global.css";
import AppProvider from "@/providers/appContext";
import { StatusBar } from "expo-status-bar";

import { useFonts } from "expo-font";
import { useLayoutEffect } from "react";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded, error] = useFonts({
    "Caveat-Bold": require("../assets/fonts/Caveat/static/Caveat-Bold.ttf"),
    "Caveat-Medium": require("../assets/fonts/Caveat/static/Caveat-Medium.ttf"),
    "Caveat-Regular": require("../assets/fonts/Caveat/static/Caveat-Regular.ttf"),
    "Caveat-SemiBold": require("../assets/fonts/Caveat/static/Caveat-SemiBold.ttf"),
  });

  useLayoutEffect(() => {
    const showScreen = async () => {
      await SplashScreen.hideAsync();
    };

    if (loaded) {
      console.log("The fonts are loaded!")
      showScreen();
    }
  }, [loaded]);

  if (!loaded || error) {
    return null;
  }

  return (
    <AppProvider>
      <StatusBar style="dark" backgroundColor="#c084fc" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F0F0F0" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "transparentModal",
            contentStyle: { backgroundColor: "rgba(0, 0, 0, 0.7)" },
            animation: "fade_from_bottom",
          }}
        />
      </Stack>
    </AppProvider>
  );
};

export default RootLayout;
