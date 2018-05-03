import Axios from 'axios';
import {
  GET_USER_START,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
} from './types';
import {API_CONF, API_ENDPOINTS} from '../../api/config.js';
/*
import {
  API_SIGNUP_USER,
  BACKEND_HOST
} from '../../constants';*/

Axios.defaults.baseURL = API_CONF.BASE_URL;
export const getUser = () => {
  return (dispatch) => {
      Axios.get(`${API_ENDPOINTS.USER}`)
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
