import Axios from 'axios';
import {API_CONF, API_ENDPOINTS} from './config.js';

function getStatsForTournament(tournamentName) {
  return Axios.get(`${API_ENDPOINTS.TOURNAMENT}/${tournamentName}/stats`);
}

export {getStatsForTournament};
