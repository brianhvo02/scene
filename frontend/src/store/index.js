import sessionReducer from './session';
import moviesReducer from './movies';
import errorsReducer from './errors';
import { configureStore } from '@reduxjs/toolkit';

export default configureStore({
    reducer: {
        errors: errorsReducer,
        session: sessionReducer,
        movies: moviesReducer
    }
});