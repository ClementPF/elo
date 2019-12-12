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

  onButtonPress = isWinner => {
    const { user, navigation, tournament } = this.props;
    if (tournament != null) {
      navigation.navigate('GameFormQRCode', {
        tournament,
        isWinner
      });
    } else {
      navigation.navigate('GameFormTournament', {
        winner: user,
        isWinner
      });
    }
  };

  render() {
    const { user, navigation, tournament } = this.props;
    const { text } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>

        <Button
          title="WON"
          titleStyle={styles.buttonLabel}
          buttonStyle={styles.button}
          onPress={() => {
            this.onButtonPress(true);
          }}
        />
        {false && (
          <Button
            title="TIED"
            titleStyle={styles.buttonLabel}
            buttonStyle={styles.button}
            onPress={() => {
              this.onButtonPress(false);
            }}
          />
        )}
        <Button
          title="LOST"
          titleStyle={styles.buttonLabel}
          buttonStyle={styles.button}
          onPress={() => {
            this.onButtonPress(false);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: {
    backgroundColor: '#CE2728',
    width: 300,
    height: 45,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 5,
    margin: 8
  },
  buttonLabel: { fontWeight: '700' },
  text: {
    margin: 16,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
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
