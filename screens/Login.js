import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, FlatList, StatusBar, AsyncStorage} from 'react-native';
import {SocialIcon} from 'react-native-elements';
import {loginUser, testTokenValidity} from '../api/login';
import Axios from 'axios';

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
           welcome_text: 'Welcome please log in',
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
                 console.log('User Logged in Successfully');
                 Axios.defaults.headers.common['Authorization'] = 'Bearer '+response.data.access_token;
                 AsyncStorage.setItem('@Store:token', response.data.access_token);
                 this.navigateToHome();
             })
             .catch((error) => {
                  console.log('User failed to log in ' + error);
             });

         console.log(response.error_message);
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

    const t = AsyncStorage.getItem('@Store:token').then((value) => {
      console.log('Previous session found ' + value);
      testTokenValidity(value).then((response) => {
        console.log('session is valid lets skip this screen');

        this.navigateToHome();
        //this.props.navigation.navigate('Main',{});



      })
      .catch((error) => {
        console.log('session invalid ' + error);
      });
    }).done();
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps' + nextProps);
    if (nextProps.error && !this.props.error) {
      this.props.alertWithType('error', 'Error', nextProps.error);

    }
    if(nextProps.signedIn){
    //  this.props.navigation.navigate('Home', { title: 'Home'});
    }
  }

  testSession = (token) => {

  };

  render() {

    const rows = this.props.stats || [];

    if (this.props.signedIn) {
      //this.props.navigation.navigate('Home', {title: 'Home'});
    }

    return (
      <View style= { { 'alignItems': 'center', 'justifyContent' : 'center', 'flex' : 1 } }>
        <StatusBar translucent={ false } barStyle="dark-content"/>
        <Text> {this.state.welcome_text} </Text>
        <SocialIcon  title="Sign In With Facebook" button={ true } onPress={ this.handlePress } type="facebook"/>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const tournamentName = state.games.tournamentName;

  return {stats: state.games.stats, tournamentName};
};

export default Login;
