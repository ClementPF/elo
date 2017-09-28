import {takeEvery, call, put, select} from 'redux-saga/effects';

var React = require("react-native");
var { AsyncStorage} = React;


import {
  CHANGE_WINNER_NAME,
  CHANGE_TOURNAMENT_NAME,
  SUBMIT_GAME,
  GET_STATS_TOURNAMENT,
  GOT_STATS_TOURNAMENT,
  FAILED_REQUEST
} from '../actions/games';

import {CREATE_USER, LOGIN_USER, RESTORE_SESSION} from '../actions/auth';
export const createUser = token => fetch(`http://localhost:8080/auth/token`, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({"fb_access_token": token})
})

export const getStats = (token, tournamentName) => fetch(`http://localhost:8080/tournament/${tournamentName}/stats`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization':'Bearer ' + token,
  }})


export const postGame = (token, winner, tournament) => fetch(`http://localhost:8080/tournament/${tournament}/games`, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization':'Bearer ' + token,
  },
  body: JSON.stringify({
    "outcomes": [
      {
        "result": "WIN",
        "user_name": winner
      },
      {
        "result": "LOSS",
        "user_name": "todo_change_to_actual"
      }
    ],
  "tournament_name": tournament

  })
})

const fetchStatsForTournamentName = function * (action) {
  console.log('TODO: Update the things.', action);

  try {
    const auth = yield select(state => state.auth);
    const response = yield call(getStats, auth.token, action.tournamentName);
    const result = yield response.json();
    if (result.error) {
      console.log('TODO: Update the things.', result.error);
    } else {
      yield put({type: GOT_STATS_TOURNAMENT, result});
    }
  } catch (error) {
    yield put({type: FAILED_REQUEST, error: error.message});
  }
};

const postGameForTournamentName = function * (action) {
  try {
    const auth = yield select(state => state.auth);
    const games = yield select(state => state.games);
      console.log('postGameForTournamentName', games.winnerName , auth.token);
    const response = yield call(postGame, auth.token, games.winnerName, games.tournamentName);
    const result = yield response.json();
    if (result.error) {
      yield put({type: FAILED_REQUEST, error: result});
    } else {
      console.log('postGameForTournamentName Success', result);
    }
  } catch (error) {
    yield put({type: FAILED_REQUEST, error: error.message});
  }
};

const loginUser = function * (action) {

  console.log('loginUser', action);
  try {
    const response = yield call(createUser, action.token);
    const result = yield response.json();

  console.log('loginUser sucess', result);

    if (result.error_message) {
      console.log('Failed Login', result.error_message);
    } else {
        yield put({type: LOGIN_USER, token: result.access_token});
      try {
         AsyncStorage.setItem('@Store:token', result.access_token);
      } catch (error) {
          console.log('Failed saving token', error);
      }
    }
  } catch (error) {
    yield put({type: FAILED_REQUEST, error: error.message});
  }
};

const restoreSession = function * (action){

}

const rootSaga = function * () {
  yield takeEvery(SUBMIT_GAME, postGameForTournamentName);
  yield takeEvery(GET_STATS_TOURNAMENT, fetchStatsForTournamentName);
  yield takeEvery(CREATE_USER, loginUser);
  yield takeEvery(RESTORE_SESSION, restoreSession);
};

export default rootSaga;
