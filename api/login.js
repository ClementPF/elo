import Axios from 'axios';
import { API_CONF, API_ENDPOINTS } from './config.js';

import { AsyncStorage } from 'react-native';

Axios.defaults.baseURL = API_CONF.BASE_URL;
Axios.defaults.headers.common['Authorization'] = '';
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Axios.defaults.headers.post['Accept'] = 'application/json';

function logtest(fb_token) {
  console.log(fb_token);
}

function loginUserWithFacebook(fb_token) {
  return Axios.post(`${API_ENDPOINTS.AUTH}/token`, {
    provider_access_token: fb_token,
    token_provider: 'facebook'
  });
}

function loginUserWithGoogle(google_token) {
  return Axios.post(`${API_ENDPOINTS.AUTH}/token`, {
    provider_access_token: google_token,
    token_provider: 'google'
  });
}

function testTokenValidity(token) {
  Axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  return Axios.get(API_ENDPOINTS.USER);
}

function refreshToken(token) {
  Axios.defaults.headers.common['Authorization'] = 'Bearer ';
  return Axios.post(`${API_ENDPOINTS.AUTH}/refresh`, {
    access_token: 'plop',
    refresh_token: token
  });
}

function logoutUser() {
  Axios.defaults.headers.common['Authorization'] = '';

  console.log('Loging out ');

  return AsyncStorage.removeItem('@Store:token');
}

export { loginUserWithFacebook, loginUserWithGoogle, testTokenValidity, refreshToken, logoutUser };
