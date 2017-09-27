import {
  CHANGE_WINNER_NAME,
  SWAP_CURRENCY,
  CHANGE_TOURNAMENT_NAME,
  GET_STATS_TOURNAMENT,
  GOT_STATS_TOURNAMENT,
  SUBMIT_GAME,
  FAILED_REQUEST,
} from '../actions/games';


import currencies from '../data/currencies';

const initialState = {
   winnerName: 'Joe',
   tournamentName: 'tournament1',
   stats: currencies,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_WINNER_NAME:
      return {
        ...state,
        winnerName: action.name};
    case CHANGE_TOURNAMENT_NAME:
      return {
        ...state,
        winnerName: action.name,
      };
    case GET_STATS_TOURNAMENT:
      return {
        ...state,
        tournamentName: action.tournamentName,
      };
    case SUBMIT_GAME:
      return {
        ...state,
      };
    case FAILED_REQUEST:
      return {
        ...state,
        tournamentName: action.tournamentName,
      };
    case GOT_STATS_TOURNAMENT:
      return {
        ...state,
        stats: action.result,
      };
    default:
      return state;
  }
};
