import { createSlice } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const commentErrors = createSlice({
    name: 'commentErrors',
    initialState: [],
    reducers: {
        receivecommentErrors: (_, action) => action.payload.errors,
        clearcommentErrors: () => []
    }
});

export const { receivecommentErrors, clearcommentErrors } = commentErrors.actions;

export const useClearcommentErrors = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(clearcommentErrors());
        }
    }, [dispatch]);
}

export default commentErrors.reducer;