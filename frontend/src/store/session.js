import { useSelector } from 'react-redux';
import { receiveSessionErrors } from './errors/sessionErrors';
import { customFetch } from './utils';
import { createSlice } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

const initialState = {
    user: undefined
};

// Start new stuff
const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        receiveCurrentUser: (state, action) => ({ user: action.payload }),
        logoutUser: () => ({user: null})
    }
});

export const { receiveCurrentUser, logoutUser } = sessionSlice.actions;
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
        if (res.statusCode >= 400) {
            return dispatch(receiveSessionErrors(res));
        }
    }
};

export const logout = () => dispatch => {
    sessionStorage.removeItem('jwtToken');
    dispatch(logoutUser());
};

export const getCurrentUser = () => async dispatch => {
    try {
        const user = await customFetch('/api/users/current');
        return dispatch(receiveCurrentUser(user));
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveSessionErrors(res.errors));
        }
    }
};

export const updateGenreZipCode = (genreIds, zipCode, coordinates) => async dispatch => {
    try {
        const user = await customFetch('/api/users/current/registerGenresZipCode', {
            method: 'PATCH',
            body: JSON.stringify({ genreIds, zipCode, coordinates })
        });
        return dispatch(receiveCurrentUser(user));
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveSessionErrors(res.errors));
        }
    }
}

export const useCurrentUser = () => useSelector(state => state.session.user);

export const useProtected = () => {
    const navigate = useNavigate();
    const currentUser = useCurrentUser();
    useEffect(() => {
        if (
            currentUser === null
                || 
            (
                currentUser !== undefined
                    && 
                (
                    !currentUser.genreMap
                        ||
                    _.isEmpty(currentUser.genreMap)
                )
            )
        ) navigate('/');
    }, [currentUser]);
}

export const useRequireLoggedOut = setShowModal => {
    const navigate = useNavigate();
    const currentUser = useCurrentUser();
    useEffect(() => {
        if (currentUser && !_.isEmpty(currentUser)) {
            (_.isEmpty(currentUser.genreMap) && setShowModal)
                ? (() => {
                    navigate('/');
                    setShowModal();
                })()
                : navigate('/home');
        }
    }, [currentUser]);
}



export const userLikedMovie = movie => async dispatch => {
    try {
        const user = await customFetch('/api/users/likedMovie', {
            method: 'POST',
            body: JSON.stringify({ movie })
        });
        return dispatch(receiveCurrentUser(user));
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveSessionErrors(res.errors));
        }
    }
};

export const userUnlikedMovie = movie => async dispatch => {
    try {
        const user = await customFetch('/api/users/likedMovie', {
            method: 'DELETE',
            body: JSON.stringify({ movie })
        })
        return dispatch(receiveCurrentUser(user));
    }
    catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveSessionErrors(res.errors));
        }
    }
};

export const userDislikedMovie = movie => async dispatch => {
    try {
        const user = await customFetch('/api/users/dislikedMovie', {
            method: 'POST',
            body: JSON.stringify({ movie })
        });
        return dispatch(receiveCurrentUser(user));
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveSessionErrors(res.errors));
        }
    }
};

export const userUndislikedMovie = movie => async dispatch => {
    try {
        const user = await customFetch('/api/users/dislikedMovie', {
            method: 'DELETE',
            body: JSON.stringify({ movie })
        })
        return dispatch(receiveCurrentUser(user));
    }
    catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveSessionErrors(res.errors));
        }
    }
};


export const userUpdateProfilePic = formData => async dispatch => {
    try {
        const user = await customFetch('/api/users/current/updateProfilePic', {
            method: 'PATCH',
            body: formData,
            headers: {
                'Content-Type': null
            }
        });
        return dispatch(receiveCurrentUser(user));
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            return dispatch(receiveSessionErrors(res.errors));
        }
    }
}


// This is new
export default sessionSlice.reducer;
