import { createSlice } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const sessionErrorsSlice = createSlice({
    name: 'sessionErrors',
    initialState: [],
    reducers: {
        receiveSessionErrors: (_, action) => action.payload.errors,
        clearSessionErrors: () => []
    }
});

export const { receiveSessionErrors, clearSessionErrors } = sessionErrorsSlice.actions;

export const useClearSessionErrors = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(clearSessionErrors());
        }
    }, [dispatch]);
}

export default sessionErrorsSlice.reducer;