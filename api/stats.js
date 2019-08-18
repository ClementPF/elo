import Axios from 'axios';
import { API_CONF, API_ENDPOINTS } from './config.js';

function getStatsForUserForTournament(username, tournamentName) {
  console.log('getStatsForUserForTournament ' + username + tournamentName);
  if (tournamentName)
    return Axios.get(
      `${API_ENDPOINTS.STATS}?userName=${username}&tournamentName=${tournamentName}`
    ).then(response => response.data);
  else
    return Axios.get(`${API_ENDPOINTS.STATS}?userName=${username}`).then(response => response.data);
}

function getRivalriesForUserForTournament(username, tournamentName) {
  console.log('API getRivalryForUserForRivalForTournament ' + username + tournamentName);
  return Axios.get(
    `${API_ENDPOINTS.RIVALRIES}?userName=${username}&tournamentName=${tournamentName}`
  ).then(response => response.data);
}

function getRivalryForUserForRivalForTournament(username, rivalName, tournamentName) {
  console.log(
    'API getRivalryForUserForRivalForTournament ' + username + rivalName + tournamentName
  );
  return Axios.get(
    `${
      API_ENDPOINTS.RIVALRY
    }?userName=${username}&rivalName=${rivalName}&tournamentName=${tournamentName}`
  )
    .then(response => response.data)
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(console.error);
}

export {
  getStatsForUserForTournament,
  getRivalriesForUserForTournament,
  getRivalryForUserForRivalForTournament
};
