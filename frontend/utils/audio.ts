import AudioRecord from "react-native-audio-record";

export const initializeAudioRecorder = (dataHandler: (data: string) => void) => {
    AudioRecord.init({
        sampleRate: 16000, // use 44100 for better quality -> 16000 means takes sample 16000 times per second 
        channels: 1, // 1 -> for mono-audio, 2 -> for stereo-audio
        bitsPerSample: 16, // 8 or 16, default 16
        audioSource: 6, // android only (for voice recognition apparently)
        wavFile: "test.wav", // default 'audio.wav'
    });

    AudioRecord.on("data", dataHandler)
}

export const startRecordingAudio = () => {
    AudioRecord.start()
}

//await this
//returns the local file's location, (always stores the data apparently)
export const stopRecordingAudio = async () => {
    const fileLocation =  await AudioRecord.stop();
    
    return fileLocation
}