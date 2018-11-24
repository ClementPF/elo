import Axios from 'axios';
import { API_CONF, API_ENDPOINTS } from './config.js';

function getTournaments() {
  return Axios.get(`${API_ENDPOINTS.TOURNAMENTS}/all`);
}

function getTournamentsForSport(sportName) {
  return Axios.get(`${API_ENDPOINTS.TOURNAMENT}/tournaments?sport=${sportName}`);
}

function getStatsForTournament(tournamentName) {
  return Axios.get(`${API_ENDPOINTS.TOURNAMENT}/${tournamentName}/stats`);
}

function getUsersForTournament(tournamentName) {
  return Axios.get(`${API_ENDPOINTS.TOURNAMENT}/${tournamentName}/users`);
}

function getGamesForTournament(tournamentName, page, page_size) {
  let requestParams;
  if (typeof page !== 'undefined') requestParams = 'page=' + page;
  if (typeof page_size !== 'undefined')
    requestParams =
      (typeof requestParams !== 'undefined' ? requestParams + '&' : '') + 'page_size=' + page_size;

  if (typeof requestParams !== 'undefined') requestParams = '?' + requestParams;
  else requestParams = '';

  return Axios.get(`${API_ENDPOINTS.TOURNAMENT}/${tournamentName}/games${requestParams}`);
}

function postGameForTournament(tournamentName, winnerName, looserName, isTie) {
  return Axios.post(`${API_ENDPOINTS.TOURNAMENT}/${tournamentName}/games`, {
    outcomes: [
      {
        result: isTie ? 'TIE' : 'WIN',
        user: {
          username: winnerName
        }
      },
      {
        result: isTie ? 'TIE' : 'LOSS',
        user: {
          username: looserName
        }
      }
    ],
    tournament: {
      name: tournamentName
    }
  });
}

function postTournament(tournamentName, sportName) {
  return Axios.post(`${API_ENDPOINTS.TOURNAMENT}/`, {
    display_name: tournamentName,
    is_over: false,
    sport: {
      name: sportName
    }
  });
}

export {
  getTournaments,
  getTournamentsForSport,
  getStatsForTournament,
  getUsersForTournament,
  getGamesForTournament,
  postGameForTournament,
  postTournament
};
