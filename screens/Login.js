import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Image, Text, FlatList, StatusBar, AsyncStorage} from 'react-native';
import {SocialIcon} from 'react-native-elements';
import {loginUser, testTokenValidity} from '../api/login';
import Axios from 'axios';
import DropdownAlert from 'react-native-dropdownalert';

import { NavigationActions } from 'react-navigation';

import {API_CONF, API_ENDPOINTS} from '../api/config.js';

class Login extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    state: PropTypes.object,
  }

  constructor() {
        super()
        this.state = {
           welcome_text: 'Welcome to the SHARKULATOR fellow shark, before starting praying on some fishes \nplease Sign in with Facebook.',
           appVersion: '0.0.0'
        }
     }

     async logIn() {

       const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync('1169707689780759', {
         permissions: ['email', 'public_profile']
       });

       if (type === 'success') {
         console.log('FB login success - token : ' + token);

         loginUser(token)
         .then((response) => {
                  this.dropdown.alertWithType('info', 'Info', 'User Logged in Successfully');
                 Axios.defaults.headers.common['Authorization'] = 'Bearer '+response.data.access_token;
                 AsyncStorage.setItem('@Store:token', response.data.access_token);
                 this.navigateToHome();
             })
             .catch((error) => {
                  this.onError('User failed to log in ' + error);
             });
       };
  };

// This function will navigate to the Home screen and remove the login from the stack
  navigateToHome() {
    const resetAction = NavigationActions.reset({
      index: 0,
      key: null,
      actions:
          [
            NavigationActions.navigate({ routeName: 'Main' })
      ]
    })
    this.props.navigation.dispatch(resetAction)
  }


  handlePress = () => {
    this.logIn();
  };

  componentWillMount() {

   var packageMod = require('../package.json');
   this.setState({'appVersion':packageMod.version});

    const t = AsyncStorage.getItem('@Store:token').then((value) => {
      console.log('Previous session found ' + value);
      testTokenValidity(value).then((response) => {
        //this.dropdown.alertWithType('info', 'Info', 'Valid Session Found');
        this.navigateToHome();
        //this.props.navigation.navigate('Main',{});
      })
      .catch((error) => {
        this.onError('Previous session is invalid \n' + error);
      });
    }).done();
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps' + nextProps);
    if (nextProps.error && !this.props.error) {
      this.props.alertWithType('error', 'Error', nextProps.error);
    }
    if(nextProps.signedIn){
      this.props.navigation.navigate('Home', { title: 'Home'});
    }
  }

  testSession = (token) => {

  };

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

    componentWillUnmount() {

    }


  render() {

    const rows = this.props.stats || [];

    if (this.props.signedIn) {
      //this.props.navigation.navigate('Home', {title: 'Home'});
    }

    return (
      <View style= { { 'backgroundColor' : 'white', 'flex' : 1 } }>
        <StatusBar translucent={ false } barStyle="dark-content"/>
        <View style= { {'justifyContent' : 'center', 'flex' : 5,
            alignItems: 'center' } }>
            <Image style={{width: 256, height: 256}}
                 source={require('../assets/images/icon.png')} />
         </View>
         <View style= { { 'flex' : 1 } }>
            <Text style= { { 'padding':16,  'justifyContent' : 'center', 'textAlign' : 'center',
                fontSize: 16,
                fontWeight: 'bold',
                color: 'darkslategrey',} }> {this.state.welcome_text} </Text>

        </View>
         <View style= { { 'flex' : 2,
        flexDirection: 'column',
        justifyContent: 'space-between', } }>
            <SocialIcon title="Sign In With Facebook" button={ true } onPress={ this.handlePress } type="facebook"/>
            <Text style= { {'textAlign' : 'center'} }> { 'Version : ' + this.state.appVersion + (API_CONF.BASE_URL == API_CONF.BASE_LOCAL_URL ? "L" : "R")} </Text>
        </View>
       <DropdownAlert
           ref={ref => this.dropdown = ref}
           onClose={data => this.onClose(data)} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const tournamentName = state.games.tournamentName;

  return {stats: state.games.stats, tournamentName};
};

export default Login;
