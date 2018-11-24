import {
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  GET_USER_GAMES_SUCCESS,
  GET_USER_GAMES_FAIL
} from '../actions/types';

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
      var temp;
      if (state.games == null) {
        temp = action.payload;
      } else {
        temp = state.games;
        temp.push(...action.payload);
      }
      return { ...state, games: temp };
    case GET_USER_GAMES_FAIL:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
