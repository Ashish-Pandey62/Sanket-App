import { useState, createContext, useContext, PropsWithChildren } from "react";

export type Gender = "Male" | "Female" | "Undisclosed";

type Voice = {
    firstName: string;
    lastName: string;
    gender: Gender;
}

const AppContext = createContext<{
    isRecording: boolean
    setIsRecording: React.Dispatch<React.SetStateAction<boolean>>
    voices: Voice[]
    setVoices: React.Dispatch<React.SetStateAction<Voice[]>>
}>({
    isRecording: false,
    setIsRecording: () => {},
    voices: [],
    setVoices: () => {}
    // checkedAlerts: [true, true, true, true, true, true],
    // setCheckedAlerts: () => {}
})

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
    // const [checkedAlerts, setCheckedAlerts] = useState<boolean[]>([true, true, true, true, true, true])
    const [isRecording, setIsRecording] = useState<boolean>(false)
    const [voices, setVoices] = useState<Voice[]>([])
    const [listeningForFireAlarm, setListeningForFireAlarm] = useState<boolean>(false)

    return (
        <AppContext.Provider value={{ isRecording, setIsRecording, voices, setVoices }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider;

export const useAppContext = () => {
    const context = useContext(AppContext)

    return context
}