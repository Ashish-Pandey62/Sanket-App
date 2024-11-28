import { PermissionsAndroid, Platform } from "react-native";

// We need to ask this for android 12 and above.
export const requestNotificationPermission = async () => {
    if (Platform.OS === "android" && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
                title: "Notification Permission Required",
                message: "This app needs permission to send notifications.",
                buttonPositive: "OK",
            }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Notification permission granted");
        } else {
            console.log("Notification permission denied");
        }
    }
};