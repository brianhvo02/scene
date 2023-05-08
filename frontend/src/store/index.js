import sessionReducer from './session';
import errorsReducer from './errors';
import { configureStore } from '@reduxjs/toolkit';

export default configureStore({
    reducer: {
        errors: errorsReducer,
        session: sessionReducer
    }
});