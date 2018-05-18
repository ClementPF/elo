import {
    GET_USER_SUCCESS,
    GET_USER_FAIL,
    GET_USER_GAMES_SUCCESS,
    GET_USER_GAMES_FAIL,
} from '../actions/types';

const INITIAL_STATE = {
    user: null,
    games: null,
    error: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_USER_SUCCESS:
      return { ...state,
        user: action.payload};
    case GET_USER_FAIL:
      return { ...state,
        error: action.payload};
    case GET_USER_GAMES_SUCCESS:
      return { ...state,
        games: action.payload};
    case GET_USER_GAMES_FAIL:
      return { ...state,
        error: action.payload};
    default:
      return state;
  }
};
