import { combineReducers } from 'redux';
import sessionErrorsReducer from './sessionErrors';
import movieErrorsReducer from './movieErrors';
import eventErrorsReducer from './eventErrors';

export default combineReducers({
    session: sessionErrorsReducer,
    movie: movieErrorsReducer,
    event: eventErrorsReducer
});