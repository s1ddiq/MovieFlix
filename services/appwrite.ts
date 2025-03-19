import { Client, Databases, Account, ID, Query } from "react-native-appwrite";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from "@clerk/clerk-expo";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const ENDPOINT = "https://cloud.appwrite.io/v1";
const S_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const account = new Account(client);
const database = new Databases(client);


export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      }, []);
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const saveMovie = async ({
  title,
  movie_id,
  userId,
  collectionId,
}: {
  title: string;
  movie_id: string;
  userId: string;
  collectionId: string;
}) => {
  try {
    if (!userId) throw new Error("User is not authenticated");

    const response = await database.listDocuments(
      DATABASE_ID, 
      S_COLLECTION_ID,
      [Query.equal("userId", userId), Query.equal("movie_id", movie_id)]
    );

    if (response.documents.length > 0) {
      await database.deleteDocument(DATABASE_ID, S_COLLECTION_ID, response.documents[0].$id);
      return { status: "removed" };
    } else {
      await database.createDocument(DATABASE_ID, S_COLLECTION_ID, ID.unique(), {
        title,
        movie_id,
        userId,
      });
      return { status: "saved" };
    }
  } catch (error) {
    console.error("Error saving movie:", error);
    throw error;
  }
};

export const fetchSavedMovies = async (userId: string) => {
  try {
    const response = await database.listDocuments(DATABASE_ID, S_COLLECTION_ID, [
      Query.equal('userId', userId),
    ])
      { /*Return user's saved movies */}
    return response.documents; 
  } catch (error) {
    console.log(error);
    return [];
  }

}