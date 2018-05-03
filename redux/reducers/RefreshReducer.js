import {
  INVALIDATE_DATA,
} from '../actions/types';

const INITIAL_STATE = {
    invalidateData: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INVALIDATE_DATA:
      return { ...state,
        invalidateData: true};
    default:
      return state;
  }
};
