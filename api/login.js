import Axios from 'axios';
import {API_CONF, API_ENDPOINTS} from './config.js';

async function createUser(fb_token) {
  try {
    let response = await fetch(`${API_CONF.BASE_URL}/${API_ENDPOINTS.USERS}`
      , {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"fb_access_token": fb_token})
      });
    let responseJson = await response.json();
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}


async function createUserAxios(fb_token) {
  console.log('here');
  return await Axios.post(`${API_CONF.BASE_URL}/${API_ENDPOINTS.USERS}`, {
    fb_access_token: fb_token
  });
}



export {createUser};
