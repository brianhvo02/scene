import { combineReducers } from 'redux';
import sessionErrorsReducer from './sessionErrors';
import movieErrorsReducer from './movieErrors';
import eventErrorsReducer from './eventErrors';
import ratingErrorsReducer from './ratingErrors';

export default combineReducers({
    session: sessionErrorsReducer,
    movie: movieErrorsReducer,
    event: eventErrorsReducer,
    rating: ratingErrorsReducer
});