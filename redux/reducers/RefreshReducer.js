import {
  INVALIDATE_DATA,
  DATA_INVALIDATED
} from '../actions/types';

const INITIAL_STATE = {
    isDataStale: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INVALIDATE_DATA:
    //console.log('redux INVALIDATE_DATA')
      return { ...state,
        isDataStale: true};
    case DATA_INVALIDATED:
        return { ...state,
            isDataStale: false};
    default:
      return state;
  }
};
