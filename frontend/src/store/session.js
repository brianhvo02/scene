import { useSelector } from 'react-redux';
import { receiveSessionErrors } from './errors/sessionErrors';
import { customFetch } from './utils';
import { createSlice } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        const { user, token } = await customFetch(route, {
            method: 'POST',
            body: JSON.stringify(userInfo)
        });
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
    const user = await customFetch('/api/users/current');
    return dispatch(receiveCurrentUser(user));
};

export const useCurrentUser = () => useSelector(state => state.session.user);

export const useProtected = () => {
    const navigate = useNavigate();
    const currentUser = useCurrentUser();
    useEffect(() => {
        if (currentUser === null) navigate('/');
    }, [currentUser]);
}

export const useRequireLoggedOut = () => {
    const navigate = useNavigate();
    const currentUser = useCurrentUser();
    useEffect(() => {
        if (currentUser) navigate('/home');
    }, [currentUser]);
}

// This is new
export default sessionSlice.reducer;
