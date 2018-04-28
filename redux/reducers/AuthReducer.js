import {
  GET_USER_SUCCESS,
  GET_USER_FAIL,
} from '../actions/types';

const INITIAL_STATE = {
    user: null,
    error: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_USER_SUCCESS:
      return { ...state,
        user: action.payload};
    case GET_USER_FAIL:
      return { ...state,
        error: action.payload
    };
    default:
      return state;
  }
};
