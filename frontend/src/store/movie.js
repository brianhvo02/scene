import { createSlice } from "@reduxjs/toolkit";
import jwtFetch from './jwt';
import store from ".";

const initialState = {}

const movieSlice = createSlice({
    name: "movie",
    initialState,
    reducers: {
        receiveMovies: (state, action) => ({...state, ...action.payload.movies}),
    }
});

export const fetchDiscoverMovies = (user) => async dispatch => {
    const genreString = user.genreIds.join('|');
    const res = await fetch(`/api/tmdb/discover`, genreString);
    const { movies } = await res.json();
    dispatch(receiveMovies(movies));
}

export const fetchRecommendedMovies = (movieId) => async dispatch => {
    const res = await fetch(`/api/tmdb/movies/${movieId}/recommendations`);
    const { movies } = await res.json();
    dispatch(receiveMovies(movies));
}

export const fetchNowPlayingMovies = () => async dispatch => {
    const res1 = await fetch('/api/tmdb/movies/now_playing?page=1').then(() => res1.json());
    const res2 = await fetch('/api/tmdb/movies/now_playing?page=2').then(() => res2.json());
    const res = {movies: {...res1.movies, ...res2.movies}}
    dispatch(receiveMovies(movies))
}

if(process.env.NODE_ENV !== "production"){
    window.store = store;
    window.fetchNowPlayingMovies = fetchNowPlayingMovies
}

export default movieSlice.reducer;