import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import RefreshReducer from './RefreshReducer';

export default combineReducers({
    authReducer: AuthReducer,
    refreshReducer: RefreshReducer,
});
