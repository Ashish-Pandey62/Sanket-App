import { Ionicons } from "@expo/vector-icons";
import { usePathname, useSegments } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Switch, Pressable, Button } from "react-native";
import CustomButton from "./CustomButton";
import { Gender } from "@/providers/appContext";
import {icons} from "@/constants"

const Form: React.FC<{
  onSubmit: (
    firstName: string,
    lastName: string,
    gender: Gender,
    age?: number
  ) => void;
}> = ({ onSubmit: handleSubmit }) => {
  const path = usePathname();
  const [gender, setGender] = useState<Gender>("Undisclosed");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [firstNameIsTouched, setFirstNameIsTouched] = useState<boolean>(false);
  const [lastNameIsTouched, setLastNameIsTouched] = useState<boolean>(false);
  const [ageIsTouched, setAgeIsTouched] = useState<boolean>(false);

  return (
    <View className="bg-bg_white self-stretch px-8 py-4">
      <Text className="font-semibold text-lg">First Name </Text>
      <TextInput
        className={`${
          firstNameIsTouched && firstName.trim() === ""
            ? "border-red-600"
            : "border-gray-300"
        } border-b-2 pb-1 pt-2 mt-1 placeholder:text-gray-500/50 text-lg`}
        placeholder="John"
        keyboardAppearance="default"
        keyboardType="default"
        onChangeText={setFirstName}
        value={firstName}
        onBlur={() => {
          setFirstNameIsTouched(true);
        }}
      />
      <Text className="font-semibold text-lg mt-5">Last Name </Text>
      <TextInput
        className={`${
          lastNameIsTouched && lastName.trim() === ""
            ? "border-red-600"
            : "border-gray-300"
        } border-b-2 pb-1 pt-2 mt-1 placeholder:text-gray-500/50 text-lg`}
        placeholder="Doe"
        keyboardAppearance="default"
        keyboardType="default"
        onChangeText={setLastName}
        value={lastName}
        onBlur={() => {
          setLastNameIsTouched(true);
        }}
      />
      {!path.includes("register") && (
        <>
          <Text className="font-semibold text-lg mt-5">Age</Text>
          <TextInput
            className={`${
              ageIsTouched && age.trim() === ""
                ? "border-red-600"
                : "border-gray-300"
            } border-b-2 pb-1 pt-2 mt-1 placeholder:text-gray-500/50 text-lg`}
            keyboardAppearance="default"
            keyboardType="numeric"
            onChangeText={setAge}
            value={age}
            placeholder="40"
            onBlur={() => {
              setAgeIsTouched(true);
            }}
          />
        </>
      )}
      <Text className="font-semibold text-lg mt-5">Gender</Text>
      <View className="flex-row justify-around items-center mb-5">
        <Pressable
          onPress={() => {
            setGender((prevState) => {
              if (prevState === "Male") {
                return "Undisclosed";
              }

              return "Male";
            });
          }}
          className={`p-2 rounded-xl ${
            gender === "Male" ? "elevation-lg bg-purple-400" : ""
          }`}
        >
          <Ionicons name="man" size={30} />
        </Pressable>
        <Pressable
          className={` p-2 rounded-xl ${
            gender === "Female" ? "elevation-lg bg-purple-400" : ""
          }`}
          onPress={() => {
            setGender((prevState) => {
              if (prevState === "Female") {
                return "Undisclosed";
              }

              return "Female";
            });
          }}
        >
          <Ionicons name="woman" size={30} />
        </Pressable>
      </View>
      <View className="self-end">
        <CustomButton title="Complete" icon={"checkmark-sharp"} isTab={false}
        disabled={
          (firstNameIsTouched && firstName.trim() === "") ||
          (lastNameIsTouched && lastName.trim() === "") ||
          (ageIsTouched && age.trim() === "")
        }
        onPress={() => {
          if (firstName.trim() === "" || lastName.trim() === "") {
            setFirstNameIsTouched(true);
            setLastNameIsTouched(true);
            return;
          }

          if (!path.includes("register")) {
            const isNotNumber = Number.isNaN(Number(age));

            if (age.trim() === "" || isNotNumber) {
              setAgeIsTouched(true);
              if (isNotNumber) {
                setAge("");
              }

              return;
            }
          }

          handleSubmit(firstName, lastName, gender, Number(age));
          setAgeIsTouched(false);
          setFirstNameIsTouched(false);
          setLastNameIsTouched(false);
          setFirstName("");
          setLastName("");
          setGender("Undisclosed");
          setAge("");
        }}
        />
      </View>
    </View>
  );
};

export default Form;
