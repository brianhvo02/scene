import { createSlice } from "@reduxjs/toolkit";
import { fetchUrl } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const initialState = {}

const theaterSlice = createSlice({
    name: "theaters",
    initialState,
    reducers: {
        receiveTheaters: (state, action) => ({...state, ...action.payload.theaters})
    }
});

const { receiveTheaters } = theaterSlice.actions;

export const getTheaterSlice = state => {
    return state?.theaters ? state.theaters : {};
}

export const getTheaters = state => {
    return state?.theaters ? Object.values(state.theaters) : [];
}

export const getTheater = theaterId => state => {
    return state?.theaters ? state?.theaters[theaterId] : null;
}

export const fetchTheaters = (movieId, date) => 
    fetchUrl(`/api/movies/${movieId}/theaters?date=${date}`, receiveTheaters);

export const useTheaters = () => useSelector(getTheaters);

export default theaterSlice.reducer;