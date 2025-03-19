import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Switch, Alert } from "react-native";
import { Platform } from "react-native"; // For platform-specific permission handling
import * as Notifications from 'expo-notifications'; // For Notification permissions

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isNotificationsOn, setIsNotificationsOn] = useState(false);
  const [language, setLanguage] = useState("English");
  const [privacy, setPrivacy] = useState("Public");

  const translateX = useRef(new Animated.Value(0)).current;

  const toggleDarkMode = () => {
    Animated.timing(translateX, {
      toValue: isDarkMode ? 0 : 24,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setIsDarkMode(!isDarkMode);
  };

  const askForNotificationPermission = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        setIsNotificationsOn(true);
      } else {
        Alert.alert("Permissions Denied", "Notifications are disabled.");
        setIsNotificationsOn(false);
      }
    } else {
      // For Android, notifications are enabled by default.
      setIsNotificationsOn(true);
    }
  };

  return (
    <View className="bg-primary w-full h-full absolute px-6 py-8">
      <Text className="text-light-200 text-3xl text-center">Settings</Text>

      <View className="mt-8">
        {/* Dark Mode */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white">Dark Mode</Text>
          <TouchableOpacity
            onPress={toggleDarkMode}
            activeOpacity={0.8}
            style={{
              width: 50,
              height: 30,
              borderRadius: 50,
              backgroundColor: isDarkMode ? "#4CAF50" : "#AB8BFF",
              justifyContent: "center",
              padding: 4,
            }}
          >
            <Animated.View
              style={{
                width: 22,
                height: 22,
                borderRadius: 50,
                backgroundColor: "#fff",
                transform: [{ translateX }],
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Music */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white">Music</Text>
          <Switch
            value={isMusicOn}
            onValueChange={() => setIsMusicOn(!isMusicOn)}
            trackColor={{ false: "#ccc", true: "#AB8BFF" }}
          />
        </View>

        {/* Notifications */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white">Notifications</Text>
          <Switch
            value={isNotificationsOn}
            onValueChange={() => {
              if (!isNotificationsOn) {
                askForNotificationPermission();
              } else {
                setIsNotificationsOn(false);
              }
            }}
            trackColor={{ false: "#4CAF50", true: "#AB8BFF" }}
          />
        </View>

        {/* Language */}
        <View className="mb-6">
          <Text className="text-white">Language</Text>
          <TouchableOpacity
            onPress={() => setLanguage(language === "English" ? "Spanish" : "English")}
            style={{
              backgroundColor: "#4CAF50",
              paddingVertical: 10,
              borderRadius: 10,
              marginTop: 5,
              alignItems: "center",
            }}
          >
            <Text className="text-white font-bold">
              {language === "English" ? "Switch to Spanish" : "Switch to English"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy */}
        <View className="mb-6">
          <Text className="text-white">Privacy</Text>
          <TouchableOpacity
            onPress={() => setPrivacy(privacy === "Public" ? "Private" : "Public")}
            style={{
              backgroundColor: "#4CAF50",
              paddingVertical: 10,
              borderRadius: 10,
              marginTop: 5,
              alignItems: "center",
            }}
          >
            <Text className="text-white font-bold">
              {privacy === "Public" ? "Switch to Private" : "Switch to Public"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Settings;
