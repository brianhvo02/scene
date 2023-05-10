import { createSlice } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const sessionErrorsSlice = createSlice({
    name: 'sessionErrors',
    initialState: null,
    reducers: {
        receiveSessionErrors: (_, action) => ({ errors: action.payload.errors }),
        clearSessionErrors: () => null
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