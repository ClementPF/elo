import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StatusBar, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { Button, SearchBar, Icon, ListItem } from 'react-native-elements';
import { TournamentRow } from '../components';
import { getTournaments, getUsersForTournament } from '../api/tournament';
import { getTournamentsForUser, getUser, getUsers } from '../api/user';
import QRCode from 'react-native-qrcode-svg';
import { fetchUser } from '../redux/actions';
import { connect } from 'react-redux';
import LZString from 'lz-string';

class GameFormQRCodeScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return {
      title: 'Winner',
      headerTintColor: 'white'
    };
  };

  constructor(props) {
    super(props);
    const { tournament } = props.navigation.state.params;
    this.state = {
      tournament,
      text:
        "Check you out, you won!\n Well it's not a win until you get them sweet points. Make sure the looser scan this QR code and submit the game."
    };
  }

  componentWillMount() {
    console.log('GameFormQRCodeScreen - componentWillMount');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && !this.props.error) {
      this.props.alertWithType('error', 'Error', nextProps.error);
    }

    if (nextProps.games != null && nextProps.games.length > 0) {
      this.setState({ tournament: nextProps.games[0].tournament });
    }
  }

  // called when navigating back from tournament selection
  returnData = data => {
    this.setState({ tournament: data });
  };

  render() {
    const {
      user: { username },
      navigation
    } = this.props;
    const { tournament, text } = this.state;
    const { display_name: displayName, name, sport } = tournament;

    const logoFromFile = require('../assets/images/icon.png');

    const qrData = {
      username,
      tournamentName: tournament.name,
      tournament: { name: tournament.name },
      result: 'WIN'
    };

    console.log('QR Code obj : ' + JSON.stringify(qrData));
    return (
      <View style={styles.container}>
        <View style={styles.tournamentHeader}>
          <TournamentRow tournament={displayName} tournamentIdName={name} sport={sport.name} />
          <Button
            icon={{ name: 'edit' }}
            title={'EDIT'}
            buttonStyle={styles.button}
            onPress={() => {
              navigation.navigate('GameFormTournament', returnData);
            }}
          />
        </View>
        <View style={styles.separator} />
        <View style={styles.QRContainer}>
          <Text style={styles.text}>{text}</Text>
          <QRCode value={JSON.stringify(qrData)} size={200} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tournamentHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  button: {
    backgroundColor: '#CE2728',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 10
  },
  text: {
    margin: 16,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'black'
  },
  QRContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = ({ userReducer }) => {
  //console.log('GameFormQRCodeScreen - mapStateToProps userReducer:' + JSON.stringify(userReducer));
  return {
    user: userReducer.user,
    games: userReducer.games
  };
};

export default connect(
  mapStateToProps,
  { fetchUser }
)(GameFormQRCodeScreen);
