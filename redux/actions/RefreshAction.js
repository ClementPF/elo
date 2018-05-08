import {
  INVALIDATE_DATA,
} from './types';

export function invalidateData() {
  return function action(dispatch) {
     return dispatch({ type: INVALIDATE_DATA })

    console.log("RefreshAction - action");

    //return dispatch(invalidateDataSuccess())
  }
}

export function invalidateDataSuccess() {
    console.log("invalidateDataSuccess - action");
	return {
		type: INVALIDATE_DATA
	};
}

export function invalidateDataError(error) {

    console.log("invalidateDataError - action");
	return {
		type: INVALIDATE_DATA,
		payload: error
	};
}
