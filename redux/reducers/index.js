import { combineReducers } from 'redux';
import UserReducer from './UserReducer';
import RefreshReducer from './RefreshReducer';

export default combineReducers({
  userReducer: UserReducer,
  refreshReducer: RefreshReducer
});
