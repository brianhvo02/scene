import sessionReducer from './session';
import moviesReducer from './movies';
import genresReducer from './genres';
import theatersReducer from './theaters';
import errorsReducer from './errors';
import { configureStore } from '@reduxjs/toolkit';

export default configureStore({
    reducer: {
        errors: errorsReducer,
        session: sessionReducer,
        movies: moviesReducer,
        genres: genresReducer,
        theaters: theatersReducer
    }
});