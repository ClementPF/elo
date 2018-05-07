import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StatusBar, StyleSheet, SectionList, TouchableOpacity} from 'react-native';
import {Button, SearchBar, Icon, ListItem} from 'react-native-elements';
import SearchableFlatList from '../components/SearchableFlatList';
import {getTournaments, getUsersForTournament} from '../api/tournament';
import {getTournamentsForUser} from '../api/user';
import {getUser, getUsers} from '../api/user';
import UserStatRow from '../components/UserStatRow';
import EmptyResultsButton from '../components/EmptyResultsButton';
import SearchableSectionList from '../components/SearchableSectionList';
import QRCode from 'react-native-qrcode';

class GameFormQRCodeScreen extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
  };

    static navigationOptions = ({ navigation }) => {
        const  params = navigation.state.params;
        return {
            title: navigation.state.params.tournament.name,
        };
    };

  constructor(props) {
      super(props);
      this.state = {
          user : {},
          topPlayers : [],
          allPlayers : [],
          winnerName: '',
          refreshing: false,
          tournament: props.navigation.state.params.tournament,
      };
  }

  componentWillMount(){

    console.log("GameFormQRCodeScreen - componentWillMount");
  }


  _onPressRow = (rowID, rowData)  => {

   console.log("Selected user :" + rowID.username);

   this.props.navigation.navigate('GameFormConfirmation', { tournament: this.state.tournament , winner: rowID})
 }



render() {
    let logoFromFile = require('../assets/images/icon.png');
    return (
        <View style={{flex:1,
            backgroundColor:'white',
            padding:40,
        alignItems: 'center'}} >
        <QRCode
          value={'http://facebook.github.io/react-native/'}
          size={200}
          bgColor='purple'
          fgColor='white'/>
      </View>
    //    </View>
    );
}
}

export default GameFormQRCodeScreen;
