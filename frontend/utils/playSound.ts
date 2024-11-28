//The content in this file is just a helper content used for testing...

import { Audio } from "expo-av"


export const allowAudioPlaybackFromBackground = async () => {
    await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
    });
}

export const playARandomSound = async () => {
    const { sound } = await Audio.Sound.createAsync({
        uri: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
    });

    sound.playAsync();
    console.log("The audio is playing...");

    setTimeout(async () => await sound.stopAsync(), 5000);
}