import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { fetchMovieDetails } from "@/services/api";
import { icons } from "@/constants/icons";
import { saveMovie } from "@/services/appwrite";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;
  
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const data = await fetchMovieDetails(id as string);
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };
    getMovie();
  }, [id]);

  const handleSave = async () => {
    if (!movie || !userId) {
      console.warn("User not logged in or movie not loaded");
      return;
    }

    try {
      const result = await saveMovie({ 
        title: movie.title, 
        movie_id: String(movie.id), 
        userId,
        collectionId: process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID! 
      });

      if (result) {
        setSaved(result.status === "saved");
      }
    } catch (error) {
      console.error("Error saving movie:", error);
    }
  };


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }}
          className="w-full h-[550px] rounded-t-2xl mt-5"
          resizeMode="stretch"
        />

        <View className="px-5">
          <View className="flex-row justify-between w-full mt-5">
            <Text className="text-white font-bold text-xl">{movie?.title}</Text>
            <TouchableOpacity onPress={handleSave} className="items-center">
              <Image source={icons.save} className={`size-10 ${saved ? "bg-accent" : ""}`} tintColor="#fff" />
              <Text className="text-accent">{saved ? "Saved" : "Save"}</Text>
            </TouchableOpacity>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo label="Genres" value={movie?.genres?.map((g: { name: any; }) => g.name).join(", ") || "N/A"} />
          <MovieInfo label="Status" value={movie?.status} />
          <MovieInfo label="Languages" value={movie?.spoken_languages?.map((lang: any) => lang.english_name).join(", ")} />
        </View>

        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w780${movie?.backdrop_path}` }}
          className="w-full h-full rounded-xl mt-5"
          resizeMode="cover"
        />
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex justify-center items-center flex-row text-center z-50"
        onPress={() => router.back()}
      >
        <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff" />
        <Text className="text-white font-bold text-sm">Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
