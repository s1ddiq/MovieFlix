import {
  View,
  Text,
  Image,
  Alert,
  Button,
  TouchableOpacity,
  ImageBackground,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "@/constants/icons";
import { Link, useRouter } from "expo-router";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import Settings from "@/components/Settings";
const Profile = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <View className="bg-primary flex-1 px-10">
      <SignedIn>
        <View className="mt-8">
          <Text className="text-light-200 text-3xl">
            Welcome,{" "}
            <Text className="text-accent">
              {user?.emailAddresses[0].emailAddress}
            </Text>
          </Text>
        </View>

        <Modal
          visible={isSettingsOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsSettingsOpen(false)}
        >
          <Settings />
          <TouchableOpacity
            className="absolute bottom-9 w-full mt-12 px-8 bg-accent opacity-80 py-4 flex justify-center items-center z-50"
            onPress={() => setIsSettingsOpen(false)}
          >
            <Text className="text-white font-bold text-sm">Close</Text>
          </TouchableOpacity>
        </Modal>

        <View className="flex-row justify-between flex-wrap gap-5">
          <TouchableOpacity
            onPress={() => setIsSettingsOpen(true)}
            className="bg-accent_op size-40 rounded-3xl mt-5 flex justify-center items-center"
          >
            <Text className="text-3xl text-light-200 text-center">
              Settings
            </Text>
          </TouchableOpacity>
          <View className="bg-accent_op size-40 rounded-3xl mt-5 flex justify-center items-center">
            <Text className="text-3xl text-light-200 text-center">
              (coming soon)
            </Text>
          </View>
          <Link
            href={"/(tabs)/saved"}
            className="bg-accent_op size-40 rounded-3xl mt-5"
          >
            <View className="flex justify-center items-center w-full h-full">
              <Text className="text-3xl text-light-200 text-center">Saved</Text>
            </View>
          </Link>
          <View className="bg-accent_op size-40 rounded-3xl mt-5 flex justify-center items-center">
            <Text className="text-3xl text-light-200 text-center">
              (coming soon)
            </Text>
          </View>
        </View>

        <View className="relative flex-1">
          <TouchableOpacity
            className="mt-12 px-8 bg-accent opacity-80 rounded-full py-4 flex justify-center items-center z-50"
            onPress={() => signOut()}
          >
            <Text className="text-white font-bold text-sm">Sign out</Text>
          </TouchableOpacity>
        </View>
      </SignedIn>

      <View className="flex justify-center items-center flex-1 flex-col gap-5">
        <SignedOut>
          <Image source={icons.person} className="size-10" tintColor="#fff" />
          <TouchableOpacity
            className="mx-5 px-8 bg-accent rounded-lg py-3.5 flex justify-center items-center flex-row text-center z-50"
            onPress={() => router.navigate("/sign-up")}
          >
            <Text className="text-white font-bold text-sm">
              Create an account
            </Text>
          </TouchableOpacity>
        </SignedOut>
      </View>
    </View>
  );
};

export default Profile;
