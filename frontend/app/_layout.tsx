import { Stack } from "expo-router";

import "../global.css";
import AppProvider from "@/providers/appContext";

const RootLayout = () => {
  return (
    <AppProvider>
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
