import { createSlice } from "@reduxjs/toolkit";
import { fetchUrl } from "./utils";
import { useDispatch, useSelector } from "react-redux";

const initialState = {
    currentIndex: 0,
    currentPage: 1,
    movies: []
}

const carouselSlice = createSlice({
    name: "carousel",
    initialState,
    reducers: {
        decrement: state => {
            if (state.currentIndex !== 0) {
                state.currentIndex--;
            } else {
                return state;
            }
        },
        increment: state => { state.currentIndex++ },
        addMovies: (state, { payload }) => {
            state.movies = [
                ...new Set([
                    ...state.movies, 
                    ...payload
                ])
            ]
        },
        incrementPage: state => { state.currentPage++ }
    }
});

export const { addMovies, decrement, increment, incrementPage } = carouselSlice.actions;

export const useCarousel = () => {
    const dispatch = useDispatch();
    const carousel = useSelector(state => state.carousel);
    return {
        ...carousel,
        decrement: () => dispatch(decrement()),
        increment: () => dispatch(increment()),
        incrementPage: () => dispatch(incrementPage())
    }
}

export default carouselSlice.reducer;