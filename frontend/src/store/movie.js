import { createSlice } from "@reduxjs/toolkit";
import jwtFetch from './jwt';

const initialState = {}

const movieSlice = createSlice({
    name: "movie",
    initialState,
    reducers: {
        receiveMovies: (state, action) => ({...state, ...action.payload.movies}),
        // receiveMovie: (state, action) => ({...state, ...action.payload })
    }
});

const fetchDiscoverMovies = (user) => async dispatch => {
    const genreString = user.genreIds.join('|')
    const res = await fetch(`/api/tmdb/discover`, genreString);
    const { movies } = res.json()
    dispatch(receiveMovies(movies))
}

export default movieSlice.reducer;