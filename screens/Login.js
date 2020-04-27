import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Constants from 'expo-constants';
import * as Facebook from 'expo-facebook';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as AppleAuthentication from 'expo-apple-authentication';
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
  loginUserWithApple,
  testTokenValidity,
  refreshToken
} from '../api/login';
import Axios from 'axios';
import DropdownAlert from 'react-native-dropdownalert';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
import { SwitchActions, NavigationActions, StackActions } from 'react-navigation';

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
        console.log('restoreSession catch', error);
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

  componentWillUnmount() {
    this.dropdown.close();
  }

  signInWithGoogleAsync = async () => {
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

  signInWithFacebookAsync = async () => {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync('1169707689780759', {
      permissions: ['email', 'public_profile']
    }).catch(error => console.error);

    if (type === 'success') {
      console.log('FB login success - token : ' + token);

      loginUserWithFacebook(token)
        .then(response => {
          this.onLoggedIn(response.data);
        })
        .catch(error => {
          this.onError('User failed to log in ' + error);
        });
    }
  };

  signInWithAppleAsync = async () => {
    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      });

      const { identityToken, fullName } = credentials;
      const { givenName = 'sharky', familyName = 'sharko' } = fullName;

      const firstName = fullName.givenName;
      const lastInitial = fullName.familyName[0];
      const rdm = Math.floor(Math.random() * 1000);

      loginUserWithApple(identityToken, `${firstName}${lastInitial}-${rdm}`)
        .then(response => {
          this.onLoggedIn(response.data);
        })
        .catch(error => {
          this.onError('User failed to log in ' + error);
        });
    } catch (e) {
      console.log({ e });
      if (e.code === 'ERR_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
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
    this.props.navigation.dispatch(SwitchActions.jumpTo({ routeName: 'Main' }));
    //this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'Main' }));
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
            style={loginStyle.socialButton}
            title="Sign In With Facebook"
            button={true}
            onPress={this.signInWithFacebookAsync}
            type="facebook"
          />
          {Platform.OS !== 'ios' && (
            <SocialIcon
              style={loginStyle.socialButton}
              title="Sign In With Google"
              button={true}
              onPress={this.signInWithGoogleAsync}
              type="google-plus-official"
            />
          )}
          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={22}
              style={loginStyle.applSignInButton}
              onPress={this.signInWithAppleAsync}
            />
          )}
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
  buttonsContainer: { flex: 2, flexDirection: 'column', alignItems: 'stretch' },
  socialButton: { marginHorizontal: 12 },
  applSignInButton: { height: 54, marginHorizontal: 12, marginVertical: 4 },
  versionText: {
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%'
  }
});

export default Login;
