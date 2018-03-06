import Axios from 'axios';
import {API_CONF, API_ENDPOINTS} from './config.js';

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

function postGameForTournament(tournamentName, winnerName) {
  return Axios.post(`${API_ENDPOINTS.TOURNAMENT}/${tournamentName}/games`,
      {
   "outcomes": [
     {
       "result": "WIN",
       "user_name": winnerName
     },
     {
       "result": "LOSS",
       "user_name": "this_has_to_be_changed_in_react"
     }
   ],
 "tournament_name": tournamentName

 })
;}

export {getTournaments, getTournamentsForSport, getStatsForTournament, getUsersForTournament,postGameForTournament};
