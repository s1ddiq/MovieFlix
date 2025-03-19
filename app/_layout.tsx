import { Stack } from "expo-router";
import "./globals.css";
import { StatusBar } from "react-native";
import { ClerkProvider} from "@clerk/clerk-expo";
import { tokenCache } from '@/cache'



const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen name="movies" options={{ headerShown: false }} />
      </Stack>
    </ClerkProvider>
  );
}
