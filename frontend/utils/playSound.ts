//The content in this file is just a helper content used for testing...

import { Audio } from "expo-av"


export const allowAudioPlaybackFromBackground = async () => {
    await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
    });
}


export const playASound = async (urlEncodedData: string) => {
    console.log("Playing a voice sent by the backend")

    await Audio.Sound.createAsync({
        uri: `data:audio/wav;base64,${urlEncodedData}`,
    },
    { shouldPlay: true }
    );
}