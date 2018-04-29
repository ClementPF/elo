import axios from 'axios';
import {
  GET_USER_START,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
} from './types';
/*
import {
  API_SIGNUP_USER,
  BACKEND_HOST
} from '../../constants';*/

export const getUser = () => {
  return (dispatch) => {
      axios.get('http://shrkltr1.us-east-2.elasticbeanstalk.com/user')
      .then((response) => {
        dispatch({
          type: GET_USER_SUCCESS,
          payload: response.data
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_USER_FAIL,
          payload: error.message
        });
      });
  };
};
