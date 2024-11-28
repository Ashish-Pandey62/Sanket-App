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

export const triggerVibration = ({ duration = 1000 }: { duration?: number }) => {
    Vibration.vibrate(duration); // Vibrates for 1 second (default)
};
