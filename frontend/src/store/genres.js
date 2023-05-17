import { createSlice } from "@reduxjs/toolkit";
import { fetchUrl } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const initialState = {}

const genreSlice = createSlice({
    name: "genres",
    initialState,
    reducers: {
        receiveGenres: (state, action) => ({...state, ...action.payload.genres})
    }
});

const { receiveGenres } = genreSlice.actions;

const getGenreSlice = state => {
    return state?.genres ? state.genres : {};
}

export const getGenres = state => {
    return state?.genres ? Object.values(state.genres) : [];
}

export const getGenre = genreId => state => {
    return state?.genres ? state?.genres[genreId] : null;
}

export const fetchGenres = () => 
    fetchUrl('/api/tmdb/genres', receiveGenres);

export const useGenres = () => useSelector(getGenres);

export const useGenreSlice = () => useSelector(getGenreSlice);

export default genreSlice.reducer;