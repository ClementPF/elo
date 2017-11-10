import Axios from 'axios';
import {API_CONF, API_ENDPOINTS} from './config.js';

function getStatsForTournament(tournamentName) {
  return Axios.get(`${API_ENDPOINTS.TOURNAMENT}/${tournamentName}/stats`);
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

export {getStatsForTournament,postGameForTournament};
