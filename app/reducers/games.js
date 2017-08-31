import {
  CHANGE_WINNER_NAME,
  CHANGE_TOURNAMENT_NAME,
  GET_STATS_TOURNAMENT,
  SUBMIT_GAME,
} from '../actions/games';

const initialState = {
   winnerName: 'Joe',
   tournamentName: 'tournament1',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_WINNER_NAME:
      return {
        ...state,
        name: action.text};
    case CHANGE_TOURNAMENT_NAME:
      return {
        ...state,
        name: action.text,
      };
    case GET_STATS_TOURNAMENT:
      return {
        ...state,
        winnerName: action.winnerName,
        tournamentName: action.tournamentName,
      };
    case SUBMIT_GAME:
      return {
        ...state,
        winnerName: action.winnerName,
        tournamentName: action.tournamentName,
      };
    default:
      return state;
  }
};
