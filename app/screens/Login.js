import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, FlatList, StatusBar, AsyncStorage} from 'react-native';
import {SocialIcon} from 'react-native-elements';
import {connect} from 'react-redux';

import {ListItem, Separator} from '../components/List';
import {Header} from '../components/Header';
import currencies from '../data/currencies';

import {Container} from '../components/Container';
import {connectAlert} from '../components/Alert';
import {createUser, restoreSession, testSession} from '../actions/auth';

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
      console.log(token);
      this.props.dispatch(createUser(token));
      // Get the user's name using Facebook's Graph API
      /*const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`);
      console.log((await response.json()));*/
    }
  };

  handlePress = () => {
    this.logIn();
  };

  componentWillMount() {

      const t = AsyncStorage.getItem('@Store:token').
      then((value) => {
            this.testSession(value);
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

    fetch(`http://localhost:8080/users`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then((responseJson) => {
      if(responseJson.error_message == null){
              this.props.dispatch(restoreSession(token));
              this.props.navigation.navigate('Home', {title: 'Home'});
      }else{

      }

      console.log(responseJson.error_message);
    }).catch((error) => {
      console.error(error);
    });

  };

  render() {

    const rows = this.props.stats || [];

    if (this.props.signedIn) {
      //this.props.navigation.navigate('Home', {title: 'Home'});
    }

    return (
      <Container>
        <StatusBar translucent={ false } barStyle="dark-content"/>
        <Text> {this.state.welcome_text} </Text>
        <SocialIcon title="Sign In With Facebook" button={ true } onPress={ this.handlePress } type="facebook"/>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const tournamentName = state.games.tournamentName;

  return {stats: state.games.stats, tournamentName};
};

export default connect(mapStateToProps)(connectAlert(Login));
