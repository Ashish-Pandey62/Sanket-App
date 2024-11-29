import {
  BuiltInKeywords,
  PorcupineManager,
} from "@picovoice/porcupine-react-native";
import {
  PropsWithChildren,
  useState,
  useContext,
  createContext,
  useEffect,
} from "react";
import { useAppContext } from "./appContext";

const ACCESS_KEY = "bForeWqZekj3uaGLNtgNrKaIeGP6iriTOWb6lesVz3js66hioaO28w==";

//The order of the word is DIRECTLY RELATED TO THE "keywordIndex" in the detectionCallback function
const WAKE_WORDS = [
  // "सुन-राम_hi_android_v3_0_0.ppn",
  "अंकल_hi_android_v3_0_0.ppn",
  "आंटी-आंटी_hi_android_v3_0_0.ppn",
  "ओह-दाई_hi_android_v3_0_0.ppn",
  "ओह-दीदी_hi_android_v3_0_0.ppn",
  "दाई-दाई_hi_android_v3_0_0.ppn",
  "दाई-सुन_hi_android_v3_0_0.ppn",
  "दिदी-सुन_hi_android_v3_0_0.ppn",
  "भाई-भाई_hi_android_v3_0_0.ppn",
  "भाई-सुन_hi_android_v3_0_0.ppn",
];

const MALE_WAKE_WORDS = [
  "अंकल_hi_android_v3_0_0.ppn",
  "ओह-दाई_hi_android_v3_0_0.ppn",
  "दाई-दाई_hi_android_v3_0_0.ppn",
  "दाई-सुन_hi_android_v3_0_0.ppn",
  "भाई-भाई_hi_android_v3_0_0.ppn",
  "भाई-सुन_hi_android_v3_0_0.ppn",
]

const FEMALE_WAKE_WORDS = [
  "आंटी-आंटी_hi_android_v3_0_0.ppn",
  "ओह-दीदी_hi_android_v3_0_0.ppn",
  "दिदी-सुन_hi_android_v3_0_0.ppn",
]

const PorcupineContext = createContext<
  | {
      porcupine: PorcupineManager | null;
      startListeningToWakeWords: () => Promise<void>;
      stopListeningToWakeWords: () => Promise<void>;
      isListening: boolean;
      setIsListening: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

const PorcupineProvider: React.FC<
  PropsWithChildren & {
    detectionCallback: (keywordIndex: number) => Promise<void>;
  }
> = ({ children, detectionCallback }) => {
  const [porcupine, setPorcupine] = useState<PorcupineManager | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const { gender } = useAppContext()

  //await this
  const startListeningToWakeWords = async () => {
    if (porcupine && !isListening) {
      setIsListening(true)
      console.log("Porcupine is listening...")
      await porcupine.start();
    }
  };

  //await this
  const stopListeningToWakeWords = async () => {
    if (porcupine && isListening) {
      setIsListening(false)
      console.log("Porcupine is not longer listening...")
      await porcupine.stop();
    }
  };

  useEffect(() => {
    const setup = async () => {
      try {
  
        const porcupineManager = await PorcupineManager.fromKeywordPaths(
          ACCESS_KEY,
          gender === "Female" ? FEMALE_WAKE_WORDS : MALE_WAKE_WORDS,
          detectionCallback,
          (err) =>
            console.log("We faced an Error detecting the wake word => ", err),
          "porcupine_params_hi.pv" // For hindi words
        );

        // Uncomment For all Genders
        // const porcupineManager = await PorcupineManager.fromKeywordPaths(
        //   ACCESS_KEY,
        //   WAKE_WORDS,
        //   detectionCallback,
        //   (err) =>
        //     console.log("We faced an Error detecting the wake word => ", err),
        //   "porcupine_params_hi.pv" // For hindi words
        // );

        // Uncomment the code below and comment the above one to use the built in keywords.

        //   const porcupineManager = await PorcupineManager.fromBuiltInKeywords(
        //     ACCESS_KEY,
        //     [
        //       BuiltInKeywords.JARVIS,
        //       BuiltInKeywords.BUMBLEBEE,
        //       BuiltInKeywords.PORCUPINE,
        //     ],
        //     detectionCallback,
        //     (err) => console.log("We faced an Error detecting the wake word => ", err)
        //   );

        setPorcupine(porcupineManager);
      } catch (error) {
        console.log("The Porcupine manager could not be initialized!");
      }
    };

    setup();

  }, []);

  return (
    <PorcupineContext.Provider
      value={{ porcupine, startListeningToWakeWords, stopListeningToWakeWords, isListening, setIsListening }}
    >
      {children}
    </PorcupineContext.Provider>
  );
};

export default PorcupineProvider;

export const usePorcupineContext = () => {
  const obj = useContext(PorcupineContext);

  if (!obj) {
    throw new Error(
      "Use the usePorcupineContext hook within the Porcupine Provider..."
    );
  }

  return obj;
};
