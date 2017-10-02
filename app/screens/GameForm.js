import React, { Component, PropTypes }  from 'react';
import { View,KeyboardAvoidingView, FlatList, StatusBar } from 'react-native';
import { Button, SearchBar } from 'react-native-elements'
import { connect } from 'react-redux';

import { ListItem, Separator } from '../components/List';
import { Header } from '../components/Header';
import { InputWithButton } from '../components/TextInput';
import currencies from '../data/currencies';

import { Container } from '../components/Container';
import { changeTournamentName, changeWinnerName, submitGame } from '../actions/games';

class GameForm extends Component {

static propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
  winnerName: PropTypes.string,
  tournamentName: PropTypes.string,
};

handleChangeUserText = (text) => {
  this.props.winnerName = text;
  this.props.dispatch(changeWinnerName(text));
};

handleChangeTournamentText = (text) => {
  this.props.dispatch(changeWinnerName(text));
};

submitGame = (winner, tournamentName) => {
  console.log('here')
  this.props.dispatch(submitGame(this.props.winnerName, "tournament1"));


};

  render() {
    return (
      <Container backgroundColor={this.props.primaryColor}>
        <StatusBar backgroundColor="blue" barStyle="light-content" />
        <Header onPress={this.handleOptionsPress} />
        <KeyboardAvoidingView behavior="padding">


          <SearchBar
  lightTheme = {true}
  round
  onChangeText={this.handleChangeUserText}
  placeholder='Whos the lucky one...' />

        <Button
        title='Darn it, I lost!' onPress={this.submitGame}/>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}


export default connect()(GameForm);
