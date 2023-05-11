import { createSlice } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const eventErrors = createSlice({
    name: 'eventErrors',
    initialState: [],
    reducers: {
        receiveEventErrors: (_, action) => action.payload.errors,
        clearEventErrors: () => []
    }
});

export const { receiveEventErrors, clearEventErrors } = eventErrors.actions;

export const useClearEventErrors = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(clearEventErrors());
        }
    }, [dispatch]);
}

export default eventErrors.reducer;