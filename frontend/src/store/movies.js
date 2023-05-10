import { createSlice } from "@reduxjs/toolkit";
import { fetchUrl, customFetch } from "./utils";
import { receiveMovieErrors } from './errors/movieErrors';


const initialState = {}

const movieSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {
        receiveMovies: (state, action) => ({...state, ...action.payload.movies}),
    }
});

export const { receiveMovies } = movieSlice.actions;

export const getMovies = state => {
    return state?.movies ? Object.values(state.movies) : [];
}

export const getMovie = movieId => state => {
    return state?.movies ? state?.movies[movieId] : null;
}

export const fetchDiscoverMovies = user => 
    fetchUrl(`/api/tmdb/discover?with_genres=${user?.genreIds?.join('|')}`, receiveMovies);

export const fetchRecommendedMovies = movieId => 
    fetchUrl(`/api/tmdb/movies/${movieId}/recommendations`, receiveMovies);

export const fetchNowPlayingMovies = () => 
    fetchUrl(`/api/tmdb/movies/now_playing`, receiveMovies);

export const fetchPopularMovies = () =>
    fetchUrl(`/api/tmdb/movies/popular`, receiveMovies);


export const addEventAttendee = (eventId, movieId) => async dispatch => {
    try {
        const movies = await customFetch(`/api/movies/${movieId}/events/${eventId}/addAttendees`, {
            method: 'PATCH'
        });
        return dispatch(receiveMovies({ movies }));
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveMovieErrors(res.errors));
        }
    }
}

export const removeEventAttendee = (eventId, movieId) => async dispatch => {
    try{
        const movies = await customFetch(`/api/movies/${movieId}/events/${eventId}/removeAttendee`, {
            method: 'DELETE'
        });
        return dispatch(receiveMovies({ movies }));
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400){
            return dispatch(receiveMovieErrors(res.errors));
        }
    }
}

export default movieSlice.reducer;