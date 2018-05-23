import {
  INVALIDATE_DATA,
  DATA_INVALIDATED,
} from './types';

export function invalidateData() {
  return function action(dispatch) {
    //console.log('RefreshAction - action');
    return invalidateDataSuccess();
};
}

export function dataInvalidated() {
  return function action(dispatch) {
    //console.log('RefreshAction - action');
    return dispatch({ type: DATA_INVALIDATED });
};
}

export function invalidateDataSuccess() {
    //console.log('invalidateDataSuccess - action');
	return {
		type: DATA_INVALIDATED
	};
}

export function invalidateDataError(error) {
    //console.log('invalidateDataError - action');
	return {
		type: INVALIDATE_DATA,
		payload: error
	};
}
