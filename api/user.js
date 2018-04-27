import Axios from 'axios';
import {API_CONF, API_ENDPOINTS} from './config.js';

function getUser() {
  return Axios.get(`${API_ENDPOINTS.USER}`);
}

function getStatsForUser(username) {
  return Axios.get(`${API_ENDPOINTS.USER}/${username}/stats`);
}

function getGamesForUser(username) {
  return Axios.get(`${API_ENDPOINTS.USER}/${username}/games`);
}

function getTournamentsForUser(username) {
  return Axios.get(`${API_ENDPOINTS.USER}/${username}/tournaments`);
}

function getUsers() {
  return Axios.get(`${API_ENDPOINTS.USERS}`);
}

export {getUser, getTournamentsForUser, getStatsForUser, getGamesForUser, getUsers};
