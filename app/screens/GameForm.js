import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, KeyboardAvoidingView, FlatList, StatusBar, AsyncStorage} from 'react-native';
import {Button, SearchBar, Icon} from 'react-native-elements'
import {connect} from 'react-redux';

import {ListItem, Separator} from '../components/List';
import {Header} from '../components/Header';
import {InputWithButton} from '../components/TextInput';
import currencies from '../data/currencies';

import {Container} from '../components/Container';
import {changeTournamentName, changeWinnerName, submitGame, loadStatsForTournament} from '../actions/games';

class GameForm extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    winnerName: PropTypes.string,
    tournamentName: PropTypes.string,
    token: PropTypes.string,
    gameValue: PropTypes.string
  };

  constructor() {
        super()
        this.state = {
           gameValue: 'My Original Text',
        }
     }

  componentWillMount() {

    const t = AsyncStorage.getItem('@Store:token').then((value) => {
      this.token = value;
    }).done();

    this.tournamentName = "tournament1";
  }

  handleChangeUserText = (text) => {
    this.winnerName = text;
    this.props.dispatch(changeWinnerName(text));
  };

  handleChangeTournamentText = (text) => {
    this.props.dispatch(changeWinnerName(text));
  };

  submitGame = (winner, tournamentName) => {

    //  this.props.dispatch(submitGame(this.props.winnerName, "tournament1"));

    fetch(`http://localhost:8080/tournament/${this.tournamentName}/games`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      },
      body: JSON.stringify({
        "outcomes": [
          {
            "result": "WIN",
            "user_name": this.winnerName
          }, {
            "result": "LOSS",
            "user_name": "todo_change_to_actual"
          }
        ],
        "tournament_name": this.tournamentName

      })
    }).then((response) => response.json()).then((responseJson) => {
      this.setState({gameValue: responseJson.outcomes[0].score_value})

      this.props.dispatch(loadStatsForTournament('tournament1'));
      return responseJson;
    }).catch((error) => {
      console.error(error);
    });

  };

  close = () => {
    this.props.navigation.goBack(null);
  };

  render() {
    return (
      <Container backgroundColor={this.props.primaryColor}>
        <StatusBar backgroundColor="blue" barStyle="light-content"/>
        <Icon
          name='close' onPress={this.close}/>
        <KeyboardAvoidingView behavior="padding">

          <SearchBar lightTheme={true} round onChangeText={this.handleChangeUserText} placeholder='Whos the lucky one...'/>
        <Text> "YO :" {this.state.gameValue} </Text>
          <Button title='Darn it, I lost!' onPress={this.submitGame}/>

        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export default connect()(GameForm);
