import Axios from 'axios';
import { API_CONF, API_ENDPOINTS } from './config.js';

function getUser() {
  console.log('getUser');
  return Axios.get(`${API_ENDPOINTS.USER}`);
}

function getStatsForUser(username) {
  return Axios.get(`${API_ENDPOINTS.USER}/${username}/stats`);
}

function getRivalryStatsForUserForTournament(username, tournamentName) {
  return Axios.get(`${API_ENDPOINTS.USER}/${username}/rivalry?tournamentName=${tournamentName}`);
}

function getGamesForUser(params) {
  const { username, tournamentName, page, page_size } = params;
  console.log('getGamesForUser ' + username + tournamentName);

  let requestParams;
  if (typeof tournamentName !== 'undefined') requestParams = 'tournamentName=' + tournamentName;
  if (typeof page !== 'undefined')
    requestParams =
      (typeof requestParams !== 'undefined' ? requestParams + '&' : '') + 'page=' + page;
  if (typeof page_size !== 'undefined')
    requestParams =
      (typeof requestParams !== 'undefined' ? requestParams + '&' : '') + 'page_size=' + page_size;

  if (typeof requestParams !== 'undefined') requestParams = '?' + requestParams;
  else requestParams = '';

  return Axios.get(`${API_ENDPOINTS.USER}/${username}/games${requestParams}`);
}

function getTournamentsForUser(username) {
  return Axios.get(`${API_ENDPOINTS.USER}/${username}/tournaments`);
}

function getUsers() {
  return Axios.get(`${API_ENDPOINTS.USERS}`);
}

function challengeUser(challenger, challengee, message) {
  return Axios.post(`${API_ENDPOINTS.USER}/${challengee}/challenge`, {
    challenger: challenger,
    challengee: challengee,
    message: message
  });
}

function postPushToken(token) {
  return Axios.post(`${API_ENDPOINTS.USER}/push`, {
    value: token
  });
}

export {
  getUser,
  getTournamentsForUser,
  getStatsForUser,
  getRivalryStatsForUserForTournament,
  getGamesForUser,
  getUsers,
  postPushToken,
  challengeUser
};
