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

const ACCESS_KEY = "cTJW0z0/muADrS8/S6Kd1nL34MCdd6ubiNsDP1v9uegyLrhlIX8gIg==";

//The order of the word is DIRECTLY RELATED TO THE "keywordIndex" in the detectionCallback function
const WAKE_WORDS = ["सुन-राम_hi_android_v3_0_0.ppn"];

const PorcupineContext = createContext<
  | {
      porcupine: PorcupineManager | null;
      startListeningToWakeWords: () => Promise<void>;
      stopListeningToWakeWords: () => Promise<void>;
    }
  | undefined
>(undefined);

const PorcupineProvider: React.FC<
  PropsWithChildren & {
    detectionCallback: (keywordIndex: number) => Promise<void>;
  }
> = ({ children, detectionCallback }) => {
  const [porcupine, setPorcupine] = useState<PorcupineManager | null>(null);

  //await this
  const startListeningToWakeWords = async () => {
    if (porcupine) {
      await porcupine.start();
    }
  };

  //await this
  const stopListeningToWakeWords = async () => {
    if (porcupine) {
      await porcupine.stop();
    }
  };

  useEffect(() => {
    // const setup = async () => {
    //   try {
    //     const porcupineManager = await PorcupineManager.fromKeywordPaths(
    //       ACCESS_KEY,
    //       WAKE_WORDS,
    //       detectionCallback,
    //       (err) =>
    //         console.log("We faced an Error detecting the wake word => ", err),
    //       "porcupine_params_hi.pv" // For hindi words
    //     );

        //Uncomment the code below and comment the above one to use the built in keywords.

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

    //     setPorcupine(porcupineManager);
    //   } catch (error) {
    //     console.log("The Porcupine manager could not be initialized!");
    //   }
    // };

    // setup();
  }, []);

  return (
    <PorcupineContext.Provider
      value={{ porcupine, startListeningToWakeWords, stopListeningToWakeWords }}
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
