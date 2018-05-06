import {
  INVALIDATE_DATA,
  DATA_INVALIDATED
} from '../actions/types';

const INITIAL_STATE = {
    invalidateData: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INVALIDATE_DATA:
    console.log("redux INVALIDATE_DATA")
      return { ...state,
        invalidateData: true};
    case DATA_INVALIDATED:
        return { ...state,
            invalidateData: false};
    default:
      return state;
  }
};
