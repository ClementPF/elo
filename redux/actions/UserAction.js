import {
  GET_USER_START,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  GET_USER_GAMES_START,
  GET_USER_GAMES_SUCCESS,
  GET_USER_GAMES_FAIL
} from './types';

import { getUser, getGamesForUser } from '../../api/user.js';
/*
import {
  API_SIGNUP_USER,
  BACKEND_HOST
} from '../../constants';*/

export function fetchUser() {
  console.log('fetchUser');
  return function action(dispatch) {
    dispatch({ type: GET_USER_START });

    console.log('UserAction - action');
    const request = getUser();

    return request.then(
      data => dispatch(getUserSuccess(data)),
      err => dispatch(getUserError(err.message))
    );
  };
}

export function getUserSuccess(user) {
  console.log('getUserSuccess - action');
  return {
    type: GET_USER_SUCCESS,
    payload: user
  };
}

export function getUserError(error) {
  console.log('getUserError - action');
  return {
    type: GET_USER_FAIL,
    payload: error
  };
}

export function fetchGamesForUser(username, page, pageSize) {
  return function action(dispatch) {
    dispatch({ type: GET_USER_GAMES_START });

    const request = getGamesForUser({ username: username, page: page, page_size: pageSize });
    return request.then(
      data => dispatch(getUserGamesSuccess(data)),
      err => dispatch(getUserGamesError(err.message))
    );
  };
}

export function getUserGamesSuccess(games) {
  console.log('fetchGamesForUser', games);
  return {
    type: GET_USER_GAMES_SUCCESS,
    payload: games
  };
}

export function getUserGamesError(error) {
  return {
    type: GET_USER_GAMES_FAIL,
    payload: error
  };
}
