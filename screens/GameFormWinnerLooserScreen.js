import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { Button, SearchBar, Icon, ListItem } from 'react-native-elements';
import SearchableFlatList from '../components/SearchableFlatList';
import UserStatRow from '../components/UserStatRow';
import TournamentRow from '../components/TournamentRow';
import SearchableSectionList from '../components/SearchableSectionList';

import { fetchUser } from '../redux/actions';
import { invalidateData } from '../redux/actions/RefreshAction';
import { connect } from 'react-redux';

class GameFormWinnerLooserScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    user: PropTypes.object,
    tournament: PropTypes.object
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return { title: '' };
  };

  constructor(props) {
    super(props);
    this.state = {
      text:
        "The game is over and it was a good game ? Doesn't matter, now it's time to find out how many points it was worth. \n Did you win or loose ?"
    };
  }

  componentWillMount() {}

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text
          style={{
            margin: 16,
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white'
          }}
        >
          {' '}
          {this.state.text}{' '}
        </Text>

        <Button
          title="WON"
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={gameFormStyle.button}
          onPress={() => {
            if (this.props.tournament != null) {
              this.props.navigation.navigate('GameFormQRCode', {
                tournament: this.props.tournament,
                winner: this.props.user,
                isWinner: true
              });
            } else {
              this.props.navigation.navigate('GameFormTournament', {
                winner: this.props.user,
                isWinner: true
              });
            }
          }}
        />
        <Button
          title="TIED"
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={gameFormStyle.button}
          onPress={() => {
            if (this.props.tournament != null) {
              this.props.navigation.navigate('GameFormTie', {
                tournament: this.props.tournament,
                winner: this.props.user,
                isWinner: true
              });
            } else {
              this.props.navigation.navigate('GameFormTournament', {
                winner: this.props.user,
                isWinner: true
              });
            }
          }}
        />
        <Button
          title="LOST"
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={gameFormStyle.button}
          onPress={() => {
            if (this.props.tournament != null) {
              this.props.navigation.navigate('GameFormQRScanner', {
                tournament: this.props.tournament,
                isWinner: false
              });
            } else {
              this.props.navigation.navigate('GameFormTournament', {
                winner: this.props.user,
                isWinner: false
              });
            }
          }}
        />
      </View>
    );
  }
}

gameFormStyle = StyleSheet.create({
  button: {
    backgroundColor: '#CE2728',
    width: 300,
    height: 45,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 5,
    margin: 8
  }
});

const mapStateToProps = ({ userReducer }) => {
  //console.log('GameFormWinnerLooserScreen - mapStateToProps userReducer:' + JSON.stringify(userReducer));
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
)(GameFormWinnerLooserScreen);
