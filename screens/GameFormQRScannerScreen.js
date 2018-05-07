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
import { Camera, Permissions } from 'expo';
import QRCodeScanner from 'react-native-qrcode-scanner';

class GameFormQRScannerScreen extends Component {

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
          hasCameraPermission: null,
          type: Camera.Constants.Type.back,
      };
  }

  async componentWillMount(){

    console.log("componentWillMount");
    //const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }


  _onPressRow = (rowID, rowData)  => {

   console.log("Selected user :" + rowID.username);

   this.props.navigation.navigate('GameFormConfirmation', { tournament: this.state.tournament , winner: rowID})
 }



render() {
   const { hasCameraPermission } = this.state;
   if (hasCameraPermission === null) {
     return <View />;
   } else if (hasCameraPermission === false) {
     return <Text>No access to camera</Text>;
   } else {
      return (
          <View style={{flex:1}} >
          <QRCodeScanner
            onRead={this.onSuccess.bind(this)}
            topContent={
              <Text style={styles.centerText}>
                Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
              </Text>
            }
            bottomContent={
              <TouchableOpacity style={styles.buttonTouchable}>
                <Text style={styles.buttonText}>OK. Got it!</Text>
              </TouchableOpacity>
            }
          />
          </View>
      );
    }
}
}

export default GameFormQRScannerScreen;
