import { createSlice } from "@reduxjs/toolkit";
import { fetchUrl } from "./utils";

const initialState = {}

const movieSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {
        receiveMovies: (state, action) => ({...state, ...action.payload.movies})
    }
});

export const { receiveMovies } = movieSlice.actions;

export const getMovies = state => {
    return state?.movies ? Object.values(state.movies) : [];
}

export const getMovie = movieId => state => {
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

export const fetchPopularMovies = () =>
    fetchUrl(`/api/tmdb/movies/popular`, receiveMovies);

export default movieSlice.reducer;