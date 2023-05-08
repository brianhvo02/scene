import { receiveSessionErrors } from './errors/sessionErrors';
import jwtFetch from './jwt';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: undefined
};

// Start new stuff
const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        receiveCurrentUser: (state, action) => ({ user: action.payload }),
        logoutUser: () => initialState
    }
});

const { receiveCurrentUser, logoutUser } = sessionSlice.actions;
// End new stuff

export const signup = user => startSession(user, 'api/users/register');
export const login = user => startSession(user, 'api/users/login');

const startSession = (userInfo, route) => async dispatch => {
    try {
        const res = await jwtFetch(route, {
            method: 'POST',
            body: JSON.stringify(userInfo)
        });
        const { user, token } = await res.json();
        sessionStorage.setItem('jwtToken', token);
        return dispatch(receiveCurrentUser(user));
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveSessionErrors(res.errors));
        }
    }
};

export const logout = () => dispatch => {
    sessionStorage.removeItem('jwtToken');
    dispatch(logoutUser());
};

export const getCurrentUser = () => async dispatch => {
    const res = await jwtFetch('/api/users/current');
    const user = await res.json();
    return dispatch(receiveCurrentUser(user));
};

// This is new
export default sessionSlice.reducer;
