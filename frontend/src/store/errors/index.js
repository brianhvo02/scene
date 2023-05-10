import { combineReducers } from 'redux';
import sessionErrorsReducer from './sessionErrors';

export default combineReducers({
    session: sessionErrorsReducer
});