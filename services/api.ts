export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}


export const fetchMovies = async ({query}: {query: string}) => {
    const endpoint = query ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    })

    if(!response.ok) {
        throw new Error('Failed to fetch movies')
    }

    const data = await response.json();

    return data.results;
}

export const fetchMovieDetails = async (movieId:string): Promise<MovieDetails> => {
    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        })

        if(!response.ok) {
            throw new Error('Failed to fetch movie details');
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// const url = 'https://api.themoviedb.org/3/keyword/keyword_id/movies?include_adult=false&language=en-US&page=1';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MjYwNjBlMWI3MTA0NTlmYjJhMTk3YmE4NmI3ZTM3YyIsIm5iZiI6MTc0MjE2NDcyNC45MzYsInN1YiI6IjY3ZDc1MmY0MjVmMDFkNTQxNjdjMDAxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kJZ9CtrWiJ4kqmpuE1K9YDLOMwG1O0NZvC07b3JhvkQ'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));