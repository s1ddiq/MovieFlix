import * as React from "react";
import {
  Text,
  TextInput,
  Button,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, Stack, useRouter } from "expo-router";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const removeSpaces = (input: string) => {
    return input.replace(/\s+/g, '');
  };

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Incorrect code', 'The 6 digit code you entered was incorrect')
    }
  };

  
  const formatCode = (input: any) => {
    let formattedCode = input.replace(/[^0-9]/g, "").slice(0, 7); // Limit to 6 digits
    return formattedCode.replace(/(\d{1})(?=\d)/g, "$1 "); // Adds a space between each digit
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(tabs)/profile");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <>
        <View className="bg-primary h-full flex gap-8 px-5 justify-center">
          <Text className="text-light-200 text-3xl text-center mt-5">
            Verify your email
          </Text>

          <View className="flex flex-row items-center bg-dark-200 rounded-full px-5 py-4">
            <TextInput
              placeholder="Enter your verification code"
              value={formatCode(code)}
              className="text-white text-lg font-semibold flex-1 ml-3 w-full h-full text-center"
              placeholderTextColor="#a8b5db"
              onChangeText={(newCode) => setCode(newCode.replace(/\s+/g, ''))}
              keyboardType="number-pad"
            />
          </View>
          <TouchableOpacity
            className="bg-accent rounded-full py-4 flex justify-center items-center flex-row text-center z-50"
            onPress={onVerifyPress}
          >
            <Text className="text-white font-bold text-sm">Verify</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <View className="bg-primary h-full w-full flex justify-center">
      <View className="flex flex-col gap-8 px-5">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-light-200 text-3xl text-center mt-5">
          Sign up
        </Text>
        <View className="flex flex-row items-center bg-dark-200 rounded-full px-5 py-4">
          <TextInput
            placeholder="Enter an email"
            value={emailAddress}
            className="text-white text-lg font-semibold flex-1 ml-3 w-full h-full"
            placeholderTextColor="#a8b5db"
            onChangeText={(email) => setEmailAddress(email)}
          />
        </View>
        <View className="flex flex-row items-center bg-dark-200 rounded-full px-5 py-4">
          <TextInput
            placeholder="Enter a password"
            value={password}
            className="text-white text-lg font-semibold flex-1 ml-3 w-full h-full"
            placeholderTextColor="#a8b5db"
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity
          className="bg-accent rounded-full py-4 flex justify-center items-center flex-row text-center z-50"
          onPress={onSignUpPress}
        >
          <Text className="text-white font-bold text-sm">Create account</Text>
        </TouchableOpacity>

        <View className="flex flex-row gap-5">
          <Text className="text-light-200 text-xl">
            Already have an account?
          </Text>
          <Link href={`/(auth)/sign-in`} className="text-accent text-xl">
            Sign in
          </Link>
        </View>
      </View>
    </View>
  );
}
