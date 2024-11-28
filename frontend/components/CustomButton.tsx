import React from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet, Pressable } from 'react-native';

interface CustomButtonProps {
    title: string;
    icon: ImageSourcePropType | undefined;
    disabled?: boolean;
    onPress: () => void;
    isTab: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, icon, disabled, onPress, isTab }) => {
    return (
    <Pressable disabled={disabled && isTab} onPress={onPress}>
        <View className={`flex flex-row justify-between items-center pl-4 p ${!isTab ? 'bg-white':'bg-gray-100'} w-50 rounded-2xl`}>
            <View>
                <Text className={`${disabled ? 'text-gray-300' :'text-gray-800'} text-lg`}>{title}</Text>
            </View>
            <View className={`rounded-full ${disabled ? 'bg-purple-200' :'bg-purple-400'} ml-2 w-16 h-16 relative`}>
                <View className='rounded-full bg-white ml-2 w-8 h-8 top-4 left-2'>
                <Image source={icon} style={styles.image} />
                {/* <Text className='text-purple-800 text-3xl absolute left-2'>+</Text> */}
            </View>
            </View>
        </View>
    </Pressable>
    );
};

const styles = StyleSheet.create({
    image: {
      width: 26, // Desired width
      height: 26, // Desired height
      top: 3,
      left: 3,
    },
  });

export default CustomButton;