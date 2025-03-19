import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
  backdrop_path,
  genre_ids,
  description,
}: Movie) => {
  {
    /* console.log(poster_path) */
  }
  const voteRating = Array(Math.round(vote_average / 2)).fill(0);
  if (voteRating.length < 1) {
    voteRating.push(2);
  }
  return (
    <Link
      href={{
        pathname: "/movies/[id]",
        params: {
          id,
          title,
          poster_path,
          release_date,
          vote_average,
          description,
        },
      }}
      asChild
    >
      <TouchableOpacity className="w-[30%] my-4">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/ffffff.png",
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />
        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {title}
        </Text>
        <View className="flex-row items-center justify-start gap-x-1">
          {voteRating.map((_, index) => (
            <Image source={icons.star} className="size-4" key={index}/>
          ))}

          {/* <Text className="text-xs text-white font-bold uppercase">{Math.round(vote_average / 2)}</Text> */}
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-light-300 font-medium mt-1">
            {release_date?.split("-")[0]}
          </Text>
          {/* <Text className="text-xs font-medium text-light-300 uppercase">Movie</Text> */}
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
