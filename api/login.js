import Axios from 'axios';
import {API_CONF, API_ENDPOINTS} from './config.js';

Axios.defaults.baseURL = API_CONF.BASE_URL;
Axios.defaults.headers.common['Authorization'] = '';
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Axios.defaults.headers.post['Accept'] = 'application/json';

function logtest(fb_token) {
  console.log(fb_token);
}

function loginUser(fb_token) {
  return Axios.post(API_ENDPOINTS.AUTH, {
    fb_access_token: fb_token
  });
}

function testTokenValidity(token) {
  Axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return Axios.get(API_ENDPOINTS.USER);
}




export {loginUser,testTokenValidity};
