import { combineReducers } from 'redux';
import sessionErrorsReducer from './sessionErrors';
import movieErrorsReducer from './movieErrors';

export default combineReducers({
    session: sessionErrorsReducer,
    movie: movieErrorsReducer
});