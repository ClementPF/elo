import { takeEvery, call, put, select } from 'redux-saga/effects';

import {
  CHANGE_WINNER_NAME,
  CHANGE_TOURNAMENT_NAME,
  SUBMIT_GAME,
  GET_STATS_TOURNAMENT,
} from '../actions/games';

export const getStats = tournamentName => fetch(`http://localhost:8080/tournament/${tournamentName}/stats`);

// declaring function* fetchLatestConversionRates throws an error
const getStatsForTournamentName = function* (action) {
  console.log("here");
  let tournament = action.tournament;
  if(tournament === undefined){
    tournament = yield select(state => state.tournament.defaultTournament);
  }

  const response = yield call(getStats,tournament);
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

const rootSaga = function* root() {


  yield takeEvery(GET_STATS_TOURNAMENT, getStatsForTournamentName);
};

export default rootSaga;
