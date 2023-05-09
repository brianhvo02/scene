import { createSlice } from "@reduxjs/toolkit";
import { customFetch, fetchUrl } from "./utils";

const initialState = {}

const movieSlice = createSlice({
    name: "movie",
    initialState,
    reducers: {
        receiveMovies: (state, action) => {
            return ({...state, ...action.payload.movies})
        },
    }
});

const { receiveMovies } = movieSlice.actions;

export const getMovies = state => {
    return state?.movies ? Object.values(state.movies) : [];
}

export const getMovie = state => movieId => {
    return state?.movies ? state?.movies[movieId] : null;
}

// export const fetchDiscoverMovies = (user) => async dispatch => {
//     const genreString = user.genreIds.join('|');
//     const res = await fetch(`/api/tmdb/discover`, genreString);
//     const { movies } = await res.json();
//     dispatch(receiveMovies(movies));
// }

export const fetchDiscoverMovies = user => 
    fetchUrl(`/api/tmdb/discover?with_genres=${user?.genreIds?.join('|')}`, receiveMovies);

// export const fetchRecommendedMovies = (movieId) => async dispatch => {
//     const res = await fetch(`/api/tmdb/movies/${movieId}/recommendations`);
//     const { movies } = await res.json();
//     dispatch(receiveMovies(movies));
// }

export const fetchRecommendedMovies = movieId => 
    fetchUrl(`/api/tmdb/movies/${movieId}/recommendations`, receiveMovies);

export const fetchNowPlayingMovies = () => 
    fetchUrl(`/api/tmdb/movies/now_playing`, receiveMovies);

export default movieSlice.reducer;