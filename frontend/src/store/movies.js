import { createSlice } from "@reduxjs/toolkit";
import { fetchUrl, customFetch } from "./utils";
import { receiveMovieErrors } from './errors/movieErrors';
import { receiveEventErrors } from "./errors/eventErrors";
import { receiveRatingErrors } from './errors/ratingErrors'

const initialState = {}

const movieSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {
        receiveMovies: (state, action) => ({...state, ...action.payload.movies}),
        receiveEvent: (state, action) => ({...state, ...action.payload.event}),
        receiveRating: (state, action) => ({...state, ...action.payload.rating})
    }
});

export const { receiveMovies, receiveEvent, receiveRating } = movieSlice.actions;

export const getMovies = state => {
    return state?.movies ? Object.values(state.movies) : [];
}

export const getMovie = movieId => state => {
    return state?.movies ? state?.movies[movieId] : null;
}

export const createEvent = (event, movieId) => async dispatch => {
    try {
        const res = await customFetch(`/api/movies/${movieId}/events`, {
            method: 'POST',
            body: JSON.stringify(event)
        })
        dispatch(receiveMovies(res));
        return res.eventId;
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveEventErrors(res.errors));
        }
    }
}

export const deleteEvent = (eventId, movieId) => async dispatch => {
    try{
        const res = await customFetch(`/api/movies/${movieId}/events/${eventId}`,{
            method: "DELETE"
        })
        return dispatch(receiveMovies(res));
    }
    catch (err){
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveEventErrors(res.errors));
        }
    }
}

export const fetchDiscoverMovies = user => 
    fetchUrl(`/api/tmdb/discover?with_genres=${user?.genreIds?.join('|')}`, receiveMovies);

export const fetchRecommendedMovies = movieId => 
    fetchUrl(`/api/tmdb/movies/${movieId}/recommendations`, receiveMovies);

export const fetchNowPlayingMovies = () => 
    fetchUrl(`/api/tmdb/movies/now_playing`, receiveMovies);

export const fetchPopularMovies = () =>
    fetchUrl(`/api/tmdb/movies/popular`, receiveMovies);

export const fetchMovie = movieId =>
    fetchUrl(`/api/movies/${movieId}`, receiveMovies);

export const addEventAttendee = (eventId, movieId) => async dispatch => {
    try {
        const res = await customFetch(`/api/movies/${movieId}/events/${eventId}/addAttendee`, {
            method: 'POST'
        });
        return dispatch(receiveMovies(res));
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveMovieErrors(res.errors));
        }
    }
}

export const removeEventAttendee = (eventId, movieId) => async dispatch => {
    try {
        const res = await customFetch(`/api/movies/${movieId}/events/${eventId}/removeAttendee`, {
            method: 'DELETE'
        });
        return dispatch(receiveMovies(res));
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400){
            return dispatch(receiveMovieErrors(res.errors));
        }
    }
}

export const addRating = (rating, movieId) => async dispatch => {
    try{
        const res = await customFetch(`/api/movies/${movieId}/ratings`, {
            method: "POST",
            body: JSON.stringify(rating)
        });
        return dispatch(receiveMovies(res));
    }
    catch (err){
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveRatingErrors(res.errors));
        }
    }
}

export const deleteRating = (ratingId, movieId) => async dispatch => {
    try{
        const res = await customFetch(`/api/movies/${movieId}/rating/${ratingId}`,{
            method: 'DELETE'
        });
        return dispatch(receiveMovies(res));
    }
    catch (err){
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveRatingErrors(res.errors));
        }
    }
}

export const updateRating = (rating, movieId) => async dispatch => {
    try{
        const res = await customFetch(`/api/movies/${movieId}/ratings/${rating?._id}`,{
            method: "PATCH",
            body: JSON.stringify(rating)
        });
        return dispatch(receiveMovies(res));
    }
    catch (err){
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveRatingErrors(res.errors));
        }
    }
}

export const createComment = (body, movieId) => async dispatch => {
    try {
        const res = await customFetch(`/api/movies/${movieId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ body })
        });
        return dispatch(receiveMovies(res));
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveMovieErrors(res.errors));
        }
    }
}

export const deleteComment = (commentId, movieId) => async dispatch => {
    try{
        const res = await customFetch(`/api/movies/${movieId}/comments/${commentId}`,{
            method: 'DELETE'
        });
        return dispatch(receiveMovies(res));
    }
    catch (err){
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveRatingErrors(res.errors));
        }
    }
}

export default movieSlice.reducer;