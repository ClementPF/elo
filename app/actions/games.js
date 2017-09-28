export const CHANGE_WINNER_NAME = 'CHANGE_WINNER_NAME';
export const CHANGE_TOURNAMENT_NAME = 'CHANGE_TOURNAMENT_NAME';
export const SUBMIT_GAME = 'SUBMIT_GAME';
export const GET_STATS_TOURNAMENT = 'GET_STATS_TOURNAMENT';
export const GOT_STATS_TOURNAMENT = 'GOT_STATS_TOURNAMENT';
export const FAILED_REQUEST = 'FAILED_REQUEST';

export const changeWinnerName = name => ({
  type: CHANGE_WINNER_NAME,
  name: name,
});

export const changeTournamentName = name => ({
  type: CHANGE_TOURNAMENT_NAME,
  name: name,
});

export const submitGame = (winner, tournamentName) => ({
  type: SUBMIT_GAME,
});

export const loadStatsForTournament = tournament => ({
  type: GET_STATS_TOURNAMENT,
  tournamentName: tournament,
});

export const loadedStatsForTournament = stats => ({
  type: GOT_STATS_TOURNAMENT,
  stats: stats,
});
