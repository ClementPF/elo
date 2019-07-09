import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import * as Facebook from 'expo-facebook';
import * as GoogleSignIn from 'expo-google-sign-in';
import _ from 'lodash';

import {
  View,
  Image,
  Text,
  FlatList,
  AsyncStorage,
  Alert,
  Platform,
  StyleSheet
} from 'react-native';
import { SocialIcon } from 'react-native-elements';
import {
  loginUserWithFacebook,
  loginUserWithGoogle,
  testTokenValidity,
  refreshToken
} from '../api/login';
import Axios from 'axios';
import DropdownAlert from 'react-native-dropdownalert';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
import { NavigationActions, StackActions } from 'react-navigation';

import { API_CONF, API_ENDPOINTS } from '../api/config.js';

const isInClient = Constants.appOwnership === 'expo';
if (isInClient) {
  GoogleSignIn.allowInClient();
}

const clientIdForUseInTheExpoClient =
  '975514203843-4bkrrov84hiepp4a6r8ngci9j1o8lnhk.apps.googleusercontent.com';

/*
 * Redefine this one with your client ID
 *
 * The iOS value is the one that really matters,
 * on Android this does nothing because the client ID
 * is read from the google-services.json.
 */
const yourClientIdForUseInStandalone = Platform.select({
  android: androidStandaloneAppClientId,
  ios: iosStandaloneAppClientId
});

const androidClientId = '975514203843-4bkrrov84hiepp4a6r8ngci9j1o8lnhk.apps.googleusercontent.com';
const iosClientId = '975514203843-jriblf35irfbh0e8e49ojeq2q4egtc98.apps.googleusercontent.com';
const iosStandaloneAppClientId =
  '975514203843-4iitkt007snetchd63d8v6e96vu7qnle.apps.googleusercontent.com';
const androidStandaloneAppClientId =
  '975514203843-kqho0mtodfj50penbqrt1voq9hs34j57.apps.googleusercontent.com';

const clientId = isInClient ? clientIdForUseInTheExpoClient : yourClientIdForUseInStandalone;

class Login extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    error: PropTypes.object,
    state: PropTypes.object,
    loading: PropTypes.bool
  };

  constructor() {
    super();
    this.state = {
      welcome_text:
        'Welcome to the SHARKULATOR fellow shark, before starting praying on some fishes \nplease Sign in.',
      appVersion: '0.0.0'
    };
  }

  async componentDidMount() {
    //try {
    await GoogleSignIn.initAsync({
      isOfflineEnabled: false,
      isPromptEnabled: true,
      webClientId: '975514203843-orbnpufagngsecqdg13hkm8rloleakre.apps.googleusercontent.com'
    });
    //} catch ({ message }) {
    // alert('GoogleSignIn.initAsync(): ' + message);
    //}
  }

  componentWillMount() {
    let packageMod = require('../package.json');
    this.setState({
      appVersion: packageMod.version + 'b' + packageMod.buildNumber
    });
    this.restoreSession()
      .then(tokens => {
        const { access_token, refresh_token } = tokens;
        console.log('Previous access_token found ' + access_token);
        console.log('Previous refresh_token found ' + refresh_token);
        this.setState({
          loading: true
        });
        return this.validateRestoredSession({ access_token, refresh_token });
      })
      .then(session => {
        this.setState({ loading: false });
        this.onLoggedIn(session);
      })
      .catch(error => {
        console.log(error);
      });
  }

  restoreSession = () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('@Store:token')
        .then(value => JSON.parse(value))
        .then(tokens => {
          if (!_.isNil(tokens)) {
            const { access_token, refresh_token } = tokens;
            resolve({ access_token, refresh_token });
          } else {
            reject(new Error('No previous session found'));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  validateRestoredSession = ({ access_token, refresh_token }) => {
    return new Promise((resolve, reject) => {
      testTokenValidity(access_token)
        .then(response => {
          resolve({ access_token, refresh_token });
        })
        .catch(error => {
          refreshToken(refresh_token)
            .then(response => {
              resolve(response.data);
            })
            .catch(error => {
              reject(error);
            });
        });
    });
  };

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps' + nextProps);
    if (nextProps.error && !this.props.error) {
      this.onError(nextProps.error);
    }
  }

  componentWillUnmount() {}

  signInWithFacebookAsync = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const results = await GoogleSignIn.signInAsync();
      const {
        type,
        user: {
          auth: { accessToken, idToken }
        }
      } = results;
      console.log(results);
      if (type === 'success') {
        loginUserWithGoogle(idToken)
          .then(response => {
            this.onLoggedIn(response.data);
          })
          .catch(error => {
            this.onError('User failed to log in ' + error);
          });
      }
    } catch ({ message }) {
      console.error('login: Error:' + message);
    }
  };

  onLoggedIn = data => {
    this.dropdown.alertWithType('info', 'Info', 'User Logged in Successfully');
    Axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
    AsyncStorage.setItem('@Store:token', JSON.stringify(data));

    console.log('Storing ' + data);
    registerForPushNotificationsAsync();
    this.navigateToHome();
  };

  // This function will navigate to the Home screen and remove the login from the stack
  navigateToHome() {
    console.log('navigateToHome');
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'Main' })]
    });

    this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Main' }));
  }

  onError = error => {
    if (error) {
      this.dropdown.alertWithType('error', 'Error', error);
    }
  };

  onClose(data) {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
  }

  render() {
    if (this.state.loading) {
      return (
        <View>
          <DropdownAlert ref={ref => (this.dropdown = ref)} onClose={data => this.onClose(data)} />
        </View>
      );
    }
    return (
      <View style={loginStyle.container}>
        <View style={loginStyle.imageContainer}>
          <Image style={loginStyle.logo} source={require('../assets/images/icon.png')} />
        </View>
        <View style={loginStyle.welcomeTextContainer}>
          <Text style={loginStyle.welcomeText}>{this.state.welcome_text}</Text>
        </View>
        <View style={loginStyle.buttonsContainer}>
          <SocialIcon
            title="Sign In With Facebook"
            button={true}
            onPress={this.signInWithFacebookAsync}
            type="facebook"
          />
          <SocialIcon
            title="Sign In With Google"
            button={true}
            onPress={this.signInWithFacebookAsync}
            type="google-plus-official"
          />
        </View>
        <Text style={loginStyle.versionText}>
          {`Version : ${this.state.appVersion} ${
            API_CONF.BASE_URL == API_CONF.BASE_LOCAL_URL ? 'L' : 'R'
          }`}
        </Text>

        <DropdownAlert ref={ref => (this.dropdown = ref)} onClose={data => this.onClose(data)} />
      </View>
    );
  }
}

loginStyle = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1 },
  imageContainer: { justifyContent: 'center', flex: 4, alignItems: 'center' },
  welcomeText: {
    margin: 16,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'darkslategrey'
  },
  welcomeTextContainer: { flex: 1 },
  logo: { width: 256, height: 256 },
  buttonsContainer: { flex: 2, flexDirection: 'column' },
  versionText: {
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%'
  }
});

export default Login;
