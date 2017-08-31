export const CHANGE_WINNER_NAME = 'CHANGE_WINNER_NAME';
export const CHANGE_TOURNAMENT_NAME = 'CHANGE_TOURNAMENT_NAME';
export const SUBMIT_GAME = 'SUBMIT_GAME';
export const GET_STATS_TOURNAMENT = 'GET_STATS_TOURNAMENT';

export const changeWinnerName = name => ({
  type: CHANGE_WINNER_NAME,
  name: name,
});

export const changeTournamentName = name => ({
  type: CHANGE_TOURNAMENT_NAME,
  name: name,
});

export const submitGame = winner => ({
  type: SUBMIT_GAME,
  winner: winner,
  tournamentName: tournament,
});

export const getStatsForTournament = tournament => ({
  type: GET_STATS_TOURNAMENT,
  tournament: tournament,
});
