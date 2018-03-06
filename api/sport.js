import Axios from 'axios';
import {API_CONF, API_ENDPOINTS} from './config.js';

function getSports() {
  return Axios.get(`${API_ENDPOINTS.SPORTS}`);
}

export {getSports};
