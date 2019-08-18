import Axios from 'axios';
import { API_CONF, API_ENDPOINTS } from './config.js';
import _ from 'lodash';

function getUser() {
  console.log('getUser');
  return Axios.get(`${API_ENDPOINTS.USER}`).then(response => response.data);
}

function getStatsForUser(username) {
  return Axios.get(`${API_ENDPOINTS.USER}/${username}/stats`).then(response => response.data);
}

function getRivalryStatsForUserForTournament(username, tournamentName) {
  return Axios.get(
    `${API_ENDPOINTS.USER}/${username}/rivalry?tournamentName=${tournamentName}`
  ).then(response => response.data);
}

function getGamesForUser({ username, tournamentName, page, page_size }) {
  console.log('getGamesForUser', { username, tournamentName, page, page_size });
  let requestParams;
  if (!_.isNil(tournamentName)) requestParams = 'tournamentName=' + tournamentName;
  if (!_.isNil(page))
    requestParams = (!_.isNil(requestParams) ? requestParams + '&' : '') + 'page=' + page;
  if (!_.isNil(page_size))
    requestParams = (!_.isNil(requestParams) ? requestParams + '&' : '') + 'page_size=' + page_size;
  if (!_.isNil(requestParams)) requestParams = '?' + requestParams;
  else requestParams = '';

  return Axios.get(`${API_ENDPOINTS.USER}/${username}/games${requestParams}`).then(
    response => response.data
  );
}

function getTournamentsForUser(username) {
  return Axios.get(`${API_ENDPOINTS.USER}/${username}/tournaments`).then(response => response.data);
}

function getUsers() {
  return Axios.get(`${API_ENDPOINTS.USERS}`).then(response => response.data);
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
