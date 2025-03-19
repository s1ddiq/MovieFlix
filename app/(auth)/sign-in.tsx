import { useSignIn } from '@clerk/clerk-expo'
import { Link, Stack, useRouter } from 'expo-router'
import { Text, TextInput, Button, View, TouchableOpacity } from 'react-native'
import React from 'react'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, emailAddress, password])

  return (
        <View className="bg-primary h-full w-full flex justify-center">
          <View className="flex flex-col gap-8 px-5">
            <Stack.Screen options={{ headerShown: false }} />
            <Text className="text-light-200 text-3xl text-center mt-5">
              Sign in
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
                keyboardType='default'
              />
            </View>
            <TouchableOpacity
              className="bg-accent rounded-full py-4 flex justify-center items-center flex-row text-center z-50"
              onPress={onSignInPress}
            >
              <Text className="text-white font-bold text-sm">Login to account</Text>
            </TouchableOpacity>
    
            <View className="flex flex-row gap-5">
              <Text className="text-light-200 text-xl">
                Don't have an account?
              </Text>
              <Link href={`/(auth)/sign-up`} className="text-accent text-xl">
                Sign up
              </Link>
            </View>
          </View>
        </View>
  )
}