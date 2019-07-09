import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, SearchBar, Icon, ListItem } from 'react-native-elements';
import SearchableFlatList from '../components/SearchableFlatList';
import { getTournaments, getUsersForTournament } from '../api/tournament';
import { getStatsForUserForTournament } from '../api/stats';
import { getTournamentsForUser } from '../api/user';
import UserStatRow from '../components/UserStatRow';
import TournamentRow from '../components/TournamentRow';
import SearchableSectionList from '../components/SearchableSectionList';
import QRCode from 'react-native-qrcode-svg';
import { fetchUser } from '../redux/actions';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';

class GameFormTieScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    tournament: PropTypes.object,
    user: PropTypes.object
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return {
      title: 'Tied',
      headerTintColor: 'white'
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      winnerName: '',
      tournament: props.navigation.state.params.tournament,
      loading: true,
      text: 'Hey, tie is not so bad! Make sure you both scan your QR code to submit the game.'
    };
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted'
    });
    if (this.state.tournament != null) {
      this.fetchData(this.props.user.username, this.state.tournament.name);
    }
  }

  componentWillReceiveProps(nextProps) {
    //console.log("GameFormTieScreen - componentWillReceiveProps " + JSON.stringify(nextProps));
    /*
      if(nextProps.tournament != null){
          this.setState(
              { 'tournament':  nextProps.tournament }
          );
          fetchData(this.props.user.username,nextProps.tournament.name);
      }*/
  }

  fetchData(username, tournamentName) {
    //console.log('fetching data for  ' + JSON.stringify(username));
    this.setState({ loading: true });
    Promise.all([
      getStatsForUserForTournament(username, tournamentName)
        .then(response => {
          this.setState({ score: response.data.score });
          this.setState({ loading: false });
        })
        .catch(error => {
          this.onError('failed to get stats for user ' + error);
        })
    ]).then(() => {
      this.setState({ loading: false });
    });
  }

  // called when navigating back from tournament selection
  returnData(data) {
    this.setState({ tournament: data });
    this.fetchData(this.props.user.username, data.name);
  }

  _handleBarCodeRead = ({ type, data }) => {
    if (!this.state.qrCodeRead) {
      let jsonData = JSON.parse(data);
      this.setState({ qrCodeRead: true });
      if (jsonData.tournament.name != this.state.tournament.name) {
        this.onError(
          "It looks like you havn't selected the same tournament, get your fishes together guys!"
        );
      } else if (
        this.state.score > jsonData.score ||
        (this.state.score == jsonData.score && this.state.userId < jsonData.userId)
      ) {
        console.log(`Bar code with type ${type} and data ${data} !`);
        this.props.navigation.navigate('GameFormConfirmation', {
          tournament: jsonData.tournament,
          winner: jsonData.user,
          isTie: true
        });
      } else {
        this.dropdown.alertWithType(
          'info',
          'Info',
          'The other player has to submit the game as he has a highest score, or you have the same score but he has been using the sharkualtor longer than you'
        );
      }
    }
  };

  onError = error => {
    if (error) {
      this.dropdown.alertWithType('error', 'Error', error);
    }
  };

  onClose(data) {
    this.setState({ qrCodeRead: false });
  }

  render() {
    let logoFromFile = require('../assets/images/icon.png');
    let jsonObj = {
      user: this.props.user,
      tournament: this.state.tournament,
      score: this.state.score
    };

    console.log('QR Code obj : ' + JSON.stringify(jsonObj));

    const { hasCameraPermission } = this.state;
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="small" color="white" />
          <DropdownAlert
            closeInterval={10000}
            ref={ref => (this.dropdown = ref)}
            onClose={data => this.onClose(data)}
          />
        </View>
      );
    } else if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              marginTop: 8
            }}
          >
            <TournamentRow
              tournament={this.state.tournament.display_name}
              tournament_id_name={this.state.tournament.name}
              sport={this.state.tournament.sport.name}
            />
            <Button
              icon={{ name: 'edit' }}
              title={'EDIT'}
              buttonStyle={{
                backgroundColor: '#CE2728',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 10
              }}
              onPress={() => {
                this.props.navigation.navigate('GameFormTournament', {
                  returnData: this.returnData.bind(this)
                });
              }}
            />
          </View>
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: 'black'
            }}
          />

          <Text
            style={{
              margin: 16,
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              color: 'black'
            }}
          >
            {' '}
            {this.state.text}{' '}
          </Text>

          <QRCode value={JSON.stringify(jsonObj)} size={200} logo={logoFromFile} />

          <View
            style={{
              width: '100%',
              height: 8,
              backgroundColor: 'white'
            }}
          />

          <BarCodeScanner
            onBarCodeRead={this._handleBarCodeRead}
            style={{ flex: 1, margin: 8, width: '94%', backgroundColor: 'cyan' }}
          />

          <DropdownAlert
            closeInterval={6000}
            ref={ref => (this.dropdown = ref)}
            onClose={data => this.onClose(data)}
          />
        </View>
      );
    }
  }
}

const mapStateToProps = ({ userReducer }) => {
  //console.log('GameFormTieScreen - mapStateToProps userReducer:' + JSON.stringify(userReducer));
  return {
    user: userReducer.user,
    tournament:
      userReducer.games != null && userReducer.games.length > 0
        ? userReducer.games[0].tournament
        : null
  };
};

export default connect(
  mapStateToProps,
  { fetchUser }
)(GameFormTieScreen);
