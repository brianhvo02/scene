import { createSlice } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const ratingErrors = createSlice({
    name: 'ratingErrors',
    initialState: [],
    reducers: {
        receiveRatingErrors: (_, action) => action.payload.errors,
        clearRatingErrors: () => []
    }
});

export const { receiveRatingErrors, clearRatingErrors } = ratingErrors.actions;

export const useClearRatingErrors = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(clearRatingErrors());
        }
    }, [dispatch]);
}

export default ratingErrors.reducer;