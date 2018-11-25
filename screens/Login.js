import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, Text, FlatList, AsyncStorage } from 'react-native';
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
import { NavigationActions } from 'react-navigation';

import { API_CONF, API_ENDPOINTS } from '../api/config.js';
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

  componentWillMount() {
    let packageMod = require('../package.json');
    this.setState({ appVersion: packageMod.version + 'b' + packageMod.buildNumber, loading: true });

    const t = AsyncStorage.getItem('@Store:token')
      .then(value => JSON.parse(value))
      .then(tokens => {
        if (tokens != null) {
          console.log('Previous access_token found ' + tokens.access_token);
          console.log('Previous refresh_token found ' + tokens.refresh_token);

          testTokenValidity(tokens.access_token)
            .then(response => {
              //this.dropdown.alertWithType('info', 'Info', 'Valid Session Found');

              console.log('Valid Session Found ');
              this.setState({
                loading: false
              });
              this.navigateToHome();
            })
            .catch(error => {
              //this.onError('Previous session is invalid \n' + error);
              refreshToken(tokens.refresh_token)
                .then(response => {
                  this.setState({
                    loading: false
                  });
                  this.onLoggedIn(response.data);
                })
                .catch(error => {
                  //this.onError('Previous refresh is invalid \n' + error);

                  console.log('Previous session is invalid ' + JSON.stringify(error));
                  this.setState({
                    loading: false
                  });
                });
            });
        } else {
          this.setState({
            loading: false
          });
          console.log('No Previous session found ');
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps' + nextProps);
    if (nextProps.error && !this.props.error) {
      this.onError(nextProps.error);
    }
  }

  componentWillUnmount() {}

  async signInWithFacebookAsync() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('1169707689780759', {
      permissions: ['email', 'public_profile']
    });

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
  }

  async signInWithGoogleAsync() {
    try {
      const result = await Expo.Google.logInAsync({
        behavior: 'web',
        androidClientId: '975514203843-4bkrrov84hiepp4a6r8ngci9j1o8lnhk.apps.googleusercontent.com',
        iosClientId: '975514203843-jriblf35irfbh0e8e49ojeq2q4egtc98.apps.googleusercontent.com',
        iosStandaloneAppClientId:
          '975514203843-4iitkt007snetchd63d8v6e96vu7qnle.apps.googleusercontent.com',
        androidStandaloneAppClientId:
          '975514203843-kqho0mtodfj50penbqrt1voq9hs34j57.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      });

      if (result.type === 'success') {
        loginUserWithGoogle(result.idToken)
          .then(response => {
            this.onLoggedIn(response.data);
          })
          .catch(error => {
            this.onError('User failed to log in ' + error);
          });
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  onLoggedIn(data) {
    this.dropdown.alertWithType('info', 'Info', 'User Logged in Successfully');
    Axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
    AsyncStorage.setItem('@Store:token', JSON.stringify(data));

    console.log('Storing ' + data);
    registerForPushNotificationsAsync();
    this.navigateToHome();
  }

  // This function will navigate to the Home screen and remove the login from the stack
  navigateToHome() {
    const resetAction = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'Main' })]
    });
    this.props.navigation.dispatch(resetAction);
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
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <View style={{ justifyContent: 'center', flex: 4, alignItems: 'center' }}>
          <Image
            style={{ width: 256, height: 256 }}
            source={require('../assets/images/icon.png')}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              margin: 16,
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              color: 'darkslategrey'
            }}
          >
            {' '}
            {this.state.welcome_text}{' '}
          </Text>
        </View>
        <View style={{ flex: 2, flexDirection: 'column' }}>
          <SocialIcon
            title="Sign In With Facebook"
            button={true}
            onPress={() => {
              this.signInWithFacebookAsync();
            }}
            type="facebook"
          />
          <SocialIcon
            title="Sign In With Google"
            button={true}
            onPress={() => {
              this.signInWithGoogleAsync();
            }}
            type="google-plus-official"
          />
        </View>
        <Text style={{ textAlign: 'center', position: 'absolute', bottom: 0, width: '100%' }}>
          {' '}
          {'Version : ' +
            this.state.appVersion +
            (API_CONF.BASE_URL == API_CONF.BASE_LOCAL_URL ? 'L' : 'R')}{' '}
        </Text>

        <DropdownAlert ref={ref => (this.dropdown = ref)} onClose={data => this.onClose(data)} />
      </View>
    );
  }
}

export default Login;
