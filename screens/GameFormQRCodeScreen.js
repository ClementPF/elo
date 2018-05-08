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
import QRCode from 'react-native-qrcode-svg';
import { connect } from 'react-redux';

class GameFormQRCodeScreen extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
  };

    static navigationOptions = ({ navigation }) => {
        const  params = navigation.state.params;
        return {
            title: navigation.state.params.tournament.name,
            headerTintColor: 'white'
        };
    };

  constructor(props) {
      super(props);
      this.state = {
          winnerName: '',
          tournament: props.navigation.state.params.tournament,
          text: "Check you out, you won!\n Well it's not a win until you get them sweet points. Make sure the looser scan this QR code and submit the game."

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
    let jsonObj = {'winner': this.props.user,
                    'tournament': this.state.tournament};

    console.log("QR Code obj : " + JSON.stringify(jsonObj));
    return (
        <View style={{flex:1,
            backgroundColor:'white',
            padding:40,
            justifyContent: 'center',
            alignItems: 'center'}} >

        <Text style= { { 'padding':16,  'justifyContent' : 'center', 'textAlign' : 'center',
            fontSize: 16,
            fontWeight: 'bold',
            color: 'black',} }> {this.state.text} </Text>

        <QRCode
          value={JSON.stringify(jsonObj)}
          size={200}
          logo = {logoFromFile}/>
      </View>
    //    </View>
    );
}
}

const mapStateToProps = ({ authReducer }) => {
    console.log('GameFormQRCodeScreen - mapStateToProps ');
    const { user } = authReducer;
    return { user };
};

export default connect(mapStateToProps)(GameFormQRCodeScreen);
