import { router } from "expo-router";
import {
  View,
  ToastAndroid,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Form from "@/components/Form";

import { Gender, useAppContext } from "@/providers/appContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderBox from "@/components/HeaderBox";

export default function Index() {
  const { setAlertEnabled, setGender } = useAppContext()

  useEffect(() => {
    const checkIfRegistered = async () => {
      const firstName = await AsyncStorage.getItem("firstName");
      
      if (firstName) {
        ToastAndroid.show(`Welcome Back, ${firstName}!`, ToastAndroid.SHORT);
        const gender = await AsyncStorage.getItem("gender");
        setGender(gender as any)
        

        const myAlerts = new Array(5).fill(true)
        for (let i = 0; i < 5; i++){
          const anything = await AsyncStorage.getItem(`alertNo-${i}`)

          if (anything){
            myAlerts[i] = false
          }
        }

        setAlertEnabled(myAlerts)

        router.replace("/(tabs)/home")
      }
    };

    checkIfRegistered();
  }, []);

  const handleSubmit = async (
    firstName: string,
    lastName: string,
    gender: Gender,
    age?: number
  ) => {
    console.log(firstName, lastName, gender, age);

    if (!age) {
      return;
    }

    await Promise.all([
      AsyncStorage.setItem("firstName", firstName),
      AsyncStorage.setItem("lastName", lastName),
      AsyncStorage.setItem("gender", gender),
      AsyncStorage.setItem("age", age.toString()),
    ]);

    setGender(gender)

    router.replace("/(tabs)/home")
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView>
          <View className="flex-1 items-center gap-20">
            <HeaderBox title="Welcome" paragraph="Your Alert assistant!" />
            <Form onSubmit={handleSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
