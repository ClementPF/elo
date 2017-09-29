import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, FlatList, StatusBar, AsyncStorage} from 'react-native';
import {List} from 'react-native-elements'
import {connect} from 'react-redux';

import {ListItem, Separator} from '../components/List';
import {Header} from '../components/Header';
import currencies from '../data/currencies';

import {Container} from '../components/Container';
import {connectAlert} from '../components/Alert';
import {createUser, restoreSession} from '../actions/auth';

class Login extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    state: PropTypes.object,
  }

  async logIn() {

  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('1169707689780759', {
      permissions: ['email','public_profile'],
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

  /*    const t = AsyncStorage.getItem('@Store:token').then((value) => {

            this.setState({"token": value});
            if(value){

                this.props.dispatch(restoreSession(value));
                this.props.navigation.navigate('Home', { title: 'Home'});
            }
        }).done();*/
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && !this.props.error) {
      this.props.alertWithType('error', 'Error', nextProps.error);

    }
  }

  render() {

    const rows = this.props.stats || [];

    if(this.props.signedIn){
      this.props.navigation.navigate('Home', { title: 'Home'});
    }

    return (
      <View style={{
        flex: 0
      }}>
        <StatusBar translucent={false} barStyle="dark-content"/>
        <Header onPress={this.handlePress}/>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const tournamentName = state.games.tournamentName;

  return {stats: state.games.stats, tournamentName};
};

export default connect(mapStateToProps)(connectAlert(Login));
