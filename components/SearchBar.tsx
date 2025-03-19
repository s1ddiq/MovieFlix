import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

interface Props {
    placeholder?: string;
    onPress?: () => void;
    value?: string;
    onChangeText?: (text: string) => void;
}

const SearchBar = ({placeholder, onPress, value, onChangeText}: Props) => {
  return (
    <View className="flex flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />

      <TextInput
        placeholder={placeholder}
        value={value}
        className="text-white text-lg font-semibold flex-1 ml-3 w-full h-full"
        placeholderTextColor="#a8b5db"
        onChangeText={onChangeText}
        onPress={onPress}
      />
    </View>
  );
};

export default SearchBar;
