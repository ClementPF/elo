import { combineReducers } from 'redux';

import games from './games';
import auth from './auth';

export default combineReducers({
  games,auth,
});
