import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
      >
        <Image
          source={icon}
          style={{ tintColor: "#151312", width: 24, height: 24 }}
        />
        {/* <Text className="text-secondary text-base font-semibold ml-2">
          
        </Text> */}
      </ImageBackground>
    );
  }

  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <Image source={icon} tintColor="#a8b5db" className="size-5" />;
    </View>
  );
};

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
            backgroundColor: '#0f0d23',
            borderRadius: 50,
            marginHorizontal: 20,
            marginBottom: 36,
            height: 52,
            position: 'absolute',
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: '#0f0d23',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon title="Home" focused={focused} icon={icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon title="Search" focused={focused} icon={icons.search} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon title="Saved" focused={focused} icon={icons.save} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon title="Profile" focused={focused} icon={icons.person} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
