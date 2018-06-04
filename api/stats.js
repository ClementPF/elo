import Axios from 'axios';
import {API_CONF, API_ENDPOINTS} from './config.js';


function getStatsForUserForTournament(username,tournamentName) {
    console.log('getStatsForUserForTournament ' + username + tournamentName);
    return Axios.get(`${API_ENDPOINTS.STATS}?username=${username}&tournamentName=${tournamentName}`);
}

function getRivalryForUserForRivalForTournament(username, rivalName, tournamentName) {
    console.log('getRivalryForUserForRivalForTournament ' + username + rivalName +tournamentName);
    return Axios.get(`${API_ENDPOINTS.RIVALRY}?userName=${username}&rivalName=${rivalName}&tournamentName=${tournamentName}`);
}


export {getStatsForUserForTournament, getRivalryForUserForRivalForTournament};
