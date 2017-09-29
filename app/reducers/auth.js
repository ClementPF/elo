import {
  CREATE_USER,
  UPDATE_USER,
  LOGIN_USER,
  LOGOUT_USER,
  RESTORE_SESSION,
  EXPIRED_SESSION,
  FAILED_REQUEST
} from '../actions/auth';

const initialState = {
  token: '',
  signedIn: false
};

export default(state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER:
      return {
        ...state,
        token: action.token
      };
    case UPDATE_USER:
      return {
        ...state
      };
    case LOGIN_USER:
      return {
        ...state,
        token: action.token,
        signedIn: true
      };
    case RESTORE_SESSION:
      return {
        ...state,
        token: action.token,
        signedIn: true
      };
    case EXPIRED_SESSION:
      return {
        ...state,
        token: null,
        signedIn: false
      };
    case LOGOUT_USER:
      return {
        ...state,
        token: null,
        signedIn: false
      };
    case FAILED_REQUEST:
      return {
        ...state,
        tournamentName: action.tournamentName
      };
    default:
      return state;
  }
};
