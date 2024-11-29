import { useState, createContext, useContext, PropsWithChildren, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export type Gender = "Male" | "Female" | "Undisclosed";

type Voice = {
  firstName: string;
  lastName: string;
  gender: Gender;
};

export type AlertKeys = "fireAlarm" | "infantCrying" | "doorBell" | "petSound" | "nameAlert" | "NoModel"

// WebSocket related code goes here............................

interface ServerToClient {
  alert: ({ sound_label }: { sound_label: AlertKeys }) => void;
  enrollmentSuccess: () => void;
  wakeWord: ({ word }: { word: string }) => void;
}

interface ClientToServer {
  storeChunk: (buffer: Buffer) => void;
  storeThis: (buffer: Buffer) => void;
  wakeWord: () => void;
  userLabel: ({ firstName, lastName, gender }: { firstName: string, lastName: string, gender: Gender }) => void
}

const socket: Socket<ServerToClient, ClientToServer> = io(
  "http://10.10.11.40:3000/"
);

// WebSocket related code goes ends here............................

const AppContext = createContext<{
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  voices: Voice[];
  setVoices: React.Dispatch<React.SetStateAction<Voice[]>>;
  alertEnabled: boolean[];
  setAlertEnabled: React.Dispatch<React.SetStateAction<boolean[]>>;
  isVibrating: boolean;
  setIsVibrating: React.Dispatch<React.SetStateAction<boolean>>;
  modelKey: AlertKeys;
  setModelKey: React.Dispatch<React.SetStateAction<AlertKeys>>;
  isStoring: boolean;
  setIsStoring: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket<ServerToClient, ClientToServer>;
  gender: Gender;
  setGender: React.Dispatch<React.SetStateAction<Gender>>;
  totalAlertCounts: number[]
  setTotalAlertCounts: React.Dispatch<React.SetStateAction<number[]>>
}>({
  isRecording: false,
  setIsRecording: () => {},
  voices: [],
  setVoices: () => {},
  alertEnabled: [],
  setAlertEnabled: () => {},
  isVibrating: true,
  setIsVibrating: () => {},
  modelKey: "NoModel",
  setModelKey: () => {},
  isStoring: false,
  setIsStoring: () => {},
  socket,
  gender: "Undisclosed",
  setGender: () => {},
  totalAlertCounts: [],
  setTotalAlertCounts: ()=>{}
});



const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [alertEnabled, setAlertEnabled] = useState<boolean[]>(
    new Array(5).fill(true)
  );
  const [isVibrating, setIsVibrating] = useState<boolean>(false);
  const [modelKey, setModelKey] = useState<AlertKeys>("NoModel");
  const [isStoring, setIsStoring] = useState<boolean>(false);
  const [gender, setGender] = useState<Gender>("Undisclosed");
  const [totalAlertCounts, setTotalAlertCounts] = useState<number[]>(new Array(5).fill(0))

  useEffect(() => {
    const getDataFromBackend = async () => {
      const response = await fetch("http://10.10.11.40:3000/registeredUsers");

      if (!response.ok){
        console.error("Couldn't get the Registered Users from the backend")
        return
      }

      const data = await response.json()

      setVoices(data.users)
    }

    getDataFromBackend()
  }, [])

  return (
    <AppContext.Provider
      value={{
        isRecording,
        setIsRecording,
        voices,
        setVoices,
        alertEnabled,
        setAlertEnabled,
        isVibrating,
        setIsVibrating,
        modelKey,
        setModelKey,
        isStoring,
        setIsStoring,
        socket,
        gender,
        setGender,
        totalAlertCounts,
        setTotalAlertCounts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

export const useAppContext = () => {
  const context = useContext(AppContext);

  return context;
};
