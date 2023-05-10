import { createSlice } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const movieErrorsSlice = createSlice({
    name: 'movieErrors',
    initialState: [],
    reducers: {
        receiveMovieErrors: (_, action) => action.payload.errors,
        clearMovieErrors: () => []
    }
});

export const { receiveMovieErrors, clearMovieErrors } = movieErrorsSlice.actions;

export const useClearMovieErrors = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(clearMovieErrors());
        }
    }, [dispatch]);
}

export default movieErrorsSlice.reducer;