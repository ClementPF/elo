import {
  INVALIDATE_DATA,
} from './types';

export const invalidateData = () => {
  return (dispatch) => {
      dispatch({
        type: INVALIDATE_DATA,
      });
  };
};
