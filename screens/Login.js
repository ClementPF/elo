import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, FlatList, StatusBar, AsyncStorage} from 'react-native';
import {SocialIcon} from 'react-native-elements';
import {createUserAxios} from '../api/login';
import Axios from 'axios';

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


       this.props.navigation.navigate('Links',{});

       Axios.post('http://localhost:8080/auth/token', {
         fb_access_token: 'EAAQn18tXJhcBAFkSCsE4khy4WWfGDqQvJE5dcqKfKpxY7SCbNl2RY7rer8EqZAmOQZCptkAjAFKsSPCZB5okfo99kE5TiSNVVu8w6U4NCvN3HDHk2eP0JMDppPZAZAFebhj4gtnH2VG5BXZC8hkOZBWZAnoyr0lJv6lXUhuNWDwjofh59FM38LI9a7dOm0wZB6HfulqsTma5bQ2u30bMC3iKX'
       }).then((response) => {
               console.log(response.data);

               this.props.navigation.navigate('MainTabNavigator',{});
           })
           .catch((error) => {
               console.log(error);
               this.setState({
                   returnValueFromApi: 'There was an error!'
               });
           });

     };

  async logIn2() {

    const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync('1169707689780759', {
      permissions: ['email', 'public_profile']
    });
    if (type === 'success') {
      console.log(token);

      createUserAxios(token).then((response) => {
      if(response.error_message == null){
        this.props.navigation.navigate();
      }else{

      }

      console.log(response.error_message);
    }).catch((error) => {
      console.error(error);
    });
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
