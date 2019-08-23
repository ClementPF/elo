import {
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  GET_USER_GAMES_SUCCESS,
  GET_USER_GAMES_FAIL
} from '../actions/types';
import _ from 'lodash';

const INITIAL_STATE = {
  user: null,
  games: null,
  error: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_USER_SUCCESS:
      return { ...state, user: action.payload };
    case GET_USER_FAIL:
      return { ...state, error: action.payload };
    case GET_USER_GAMES_SUCCESS:
      let temp;
      if (state.games == null) {
        temp = action.payload;
      } else {
        temp = _.merge(action.payload, state.games);
        console.log('temp', temp);
      }
      return { ...state, games: temp };
    case GET_USER_GAMES_FAIL:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
