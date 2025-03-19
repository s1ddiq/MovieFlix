import { Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "@/constants/icons";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { useRouter, useFocusEffect } from "expo-router";
import { fetchSavedMovies } from "@/services/appwrite";
import { fetchMovieDetails } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { useCallback } from "react";

const Saved = () => {
  const router = useRouter();
  const { user } = useUser();
  const [savedMovies, setSavedMovies] = useState<any[]>([]);
  const [movieDetails, setMovieDetails] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      const movies = await fetchSavedMovies(user.id);
      if (movies) {
        setSavedMovies(movies);
      }
    }
    setRefreshing(false);
  };
  

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchSavedMovies(user.id).then((movies) => {
          if (movies) {
            setSavedMovies(movies);
          }
        });
      }
    }, [user])
  );

  useEffect(() => {
    const fetchDetails = async () => {
      if (!savedMovies.length) return;
      try {
        const details = await Promise.all(
          savedMovies.map(async (movie) => await fetchMovieDetails(movie.movie_id))
        );
        setMovieDetails(details);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchDetails();
  }, [savedMovies]);

  return (
    <View className="bg-primary flex-1 px-10">
      <SignedIn>
        <View className="mt-8">
          <Text className="text-light-200 text-3xl">Your saved movies</Text>
        </View>
        <View>
          {savedMovies.length > 0 ? (
            <FlatList
              data={movieDetails}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              renderItem={({ item }) => <MovieCard {...item} />}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              className="mt-2 pb-32"
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          ) : (
            <Text className="text-gray-500 text-base mt-10">
              No movies saved yet.
            </Text>
          )}
        </View>
      </SignedIn>

      <SignedOut>
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Image source={icons.save} className="size-10" tintColor="#fff" />
          <Text className="text-gray-500 text-base">
            Please sign in to continue
          </Text>
          <TouchableOpacity
            className="mx-5 px-8 bg-accent rounded-lg py-3.5 flex justify-center items-center flex-row text-center z-50"
            onPress={() => router.navigate("/sign-up")}
          >
            <Text className="text-white font-bold text-sm">
              Create an account
            </Text>
          </TouchableOpacity>
        </View>
      </SignedOut>
    </View>
  );
};

export default Saved;
