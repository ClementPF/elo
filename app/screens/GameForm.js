import React, { Component, PropTypes }  from 'react';
import { View,KeyboardAvoidingView, FlatList, StatusBar } from 'react-native';
import { Button } from 'react-native-elements'
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
  this.props.dispatch(changeWinnerName(text));
};

handleChangeTournamentText = (text) => {
  this.props.dispatch(changeWinnerName(text));
};

submitGame = (text) => {
  console.log('here')
  this.props.dispatch(submitGame(text));
};

  render() {
    return (
      <Container backgroundColor={this.props.primaryColor}>
        <StatusBar backgroundColor="blue" barStyle="light-content" />
        <Header onPress={this.handleOptionsPress} />
        <KeyboardAvoidingView behavior="padding">
          <InputWithButton
            buttonText={this.props.winnerName}
            onPress={this.handlePressBaseCurrency}
            defaultValue={this.props.winnerName}
            onChangeText={this.handleChangeUserText}
            textColor={this.props.primaryColor}
          />
          <InputWithButton
            editable={false}
            buttonText={this.props.tournamentName}
            onPress={this.handlePressQuoteCurrency}
            defaultValue={this.props.tournamentName}
            onChangeText={this.handleChangeTournamentText}
            textColor={this.props.primaryColor}
          />
        <Button
        title='Darn it, I lost!' onPress={this.submitGame}/>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}


export default connect()(GameForm);
