import { createSlice } from '@reduxjs/toolkit';

const sessionErrorsSlice = createSlice({
    name: 'sessionErrors',
    initialState: null,
    reducers: {
        receiveSessionErrors: (_, action) => ({ errors: action.payload.errors }),
        clearSessionErrors: () => null
    }
});


export const { receiveSessionErrors, clearSessionErrors } = sessionErrorsSlice.actions;
export default sessionErrorsSlice.reducer;