import { createSlice } from "@reduxjs/toolkit";
import { fetchUrl } from "./utils";
import { useDispatch, useSelector } from "react-redux";

const initialState = 0

const carouselSlice = createSlice({
    name: "carousel",
    initialState,
    reducers: {
        decrement: state => state !== 0 ? state - 1 : state,
        increment: state => state + 1
    }
});

export const { decrement, increment } = carouselSlice.actions;

// const getGenreSlice = state => {
//     return state?.genres ? state.genres : {};
// }

// export const getGenres = state => {
//     return state?.genres ? Object.values(state.genres) : [];
// }

// export const getGenre = genreId => state => {
//     return state?.genres ? state?.genres[genreId] : null;
// }

// export const fetchGenres = () => 
//     fetchUrl('/api/tmdb/genres', receiveGenres);

// export const useGenres = () => useSelector(getGenres);

// export const useGenreSlice = () => useSelector(getGenreSlice);

export const useCarousel = () => {
    const dispatch = useDispatch();
    return {
        currentIndex: useSelector(state => state.carousel),
        decrement: () => dispatch(decrement()),
        increment: () => dispatch(increment())
    }
}

export default carouselSlice.reducer;