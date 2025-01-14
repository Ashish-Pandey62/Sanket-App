import * as Notifications from "expo-notifications";
import { Vibration } from "react-native";

export const initializeNotifications = () => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });
}

// You may not await this (apparently)
export const triggerNotification = async ({ title = "Sanket's Notification", body = "This is a default notification", triggerTime = 5 }: { title?: string, body?: string, triggerTime?: number }) => {
    Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
        },
        trigger: {
            seconds: triggerTime,
            channelId: "default",
        },
    });
}

export const triggerVibration = ({ duration = 1000, repeat = false }: { duration?: number, repeat?: boolean }) => {
    Vibration.vibrate([duration, duration], repeat); // Vibrates for 1 second (default)
};

export const triggerQuickVibration = ({ duration = 1000 }) => {
    Vibration.vibrate(duration)
}
