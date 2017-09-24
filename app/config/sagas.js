import { takeEvery, call, put, select } from 'redux-saga/effects';

import {
  CHANGE_WINNER_NAME,
  CHANGE_TOURNAMENT_NAME,
  SUBMIT_GAME,
  GET_STATS_TOURNAMENT,
  GOT_STATS_TOURNAMENT,
  FAILED_REQUEST,
} from '../actions/games';

export const getStats = tournamentName => fetch(`http://localhost:8080/tournament/${tournamentName}/stats`);

export const postGame = (winner, looser, tournament) => fetch(`http://localhost:8080/tournament/${tournamentName}/matchs`, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "outcomes": [
    {
      "result": "WIN",
      "userName": winner
    },{
      "result": "LOST",
      "userName": looser
    },
  ]

  })
})

const fetchStatsForTournamentName = function* (action) {
  console.log('TODO: Update the things.', action);

  try {
    const response = yield call(getStats, action.tournamentName);
    const result = yield response.json();
    if (result.error) {
console.log('TODO: Update the things.', result.error);
    } else {
      yield put({ type: GOT_STATS_TOURNAMENT, result });
    }
  } catch (error) {
    yield put({ type: FAILED_REQUEST, error: error.message });
  }
};

const postGameForTournamentName = function* (action) {

  console.log('postGameForTournamentName', action);
  try {
    const response = yield call(postGame, action.tournamentName);
    const result = yield response.json();
    if (result.error) {
console.log('TODO: Update the things.', result.error);
    } else {
    }
  } catch (error) {
    yield put({ type: FAILED_REQUEST, error: error.message });
  }
};


/*
function* fetchLatestConversionRates(action) {
  try {
    let currency = action.currency;
    if (currency === undefined) {
      currency = yield select(state => state.currencies.baseCurrency);
    }
    const response = yield call(getLatestRate, currency);
    const result = yield response.json();
    if (result.error) {
      yield put({ type: CONVERSION_ERROR, error: result.error });
    } else {
      yield put({ type: CONVERSION_RESULT, result });
    }
  } catch (error) {
    yield put({ type: CONVERSION_ERROR, error: error.message });
  }
}*/

const rootSaga = function* (){
  yield takeEvery(SUBMIT_GAME, postGameForTournamentName);
  yield takeEvery(GET_STATS_TOURNAMENT, fetchStatsForTournamentName);
};

export default rootSaga;
