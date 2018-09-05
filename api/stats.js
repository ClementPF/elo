import Axios from 'axios';
import {API_CONF, API_ENDPOINTS} from './config.js';


function getStatsForUserForTournament(username,tournamentName) {
    console.log('getStatsForUserForTournament ' + username + tournamentName);
    if(tournamentName)
        return Axios.get(`${API_ENDPOINTS.STATS}?userName=${username}&tournamentName=${tournamentName}`);
    else
        return Axios.get(`${API_ENDPOINTS.STATS}?userName=${username}`);
}

function getRivalriesForUserForTournament(username, tournamentName) {
    console.log('getRivalryForUserForRivalForTournament ' + username +tournamentName);
    return Axios.get(`${API_ENDPOINTS.RIVALRIES}?userName=${username}&tournamentName=${tournamentName}`);
}

function getRivalryForUserForRivalForTournament(username, rivalName, tournamentName) {
    console.log('getRivalryForUserForRivalForTournament ' + username + rivalName +tournamentName);
    return Axios.get(`${API_ENDPOINTS.RIVALRY}?userName=${username}&rivalName=${rivalName}&tournamentName=${tournamentName}`);
}


export {getStatsForUserForTournament, getRivalriesForUserForTournament, getRivalryForUserForRivalForTournament};
