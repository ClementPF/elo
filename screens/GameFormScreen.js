import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, KeyboardAvoidingView, FlatList, StatusBar, AsyncStorage} from 'react-native';
import {Button, SearchBar, Icon} from 'react-native-elements'
import {postGameForTournament} from '../api/tournament'

class GameFormScreen extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    winnerName: PropTypes.string,
    tournamentName: PropTypes.string,
    //gameValue: PropTypes.string
  };

  constructor(props) {
      super(props);
      this.state = {
          gameValue : '0'
      };
  }

  componentWillMount() {
      this.props.tournamentName = 'tournament1'
                console.log(" componentWillMount " + this.props.tournamentName);
  }

  handleChangeUserText = (text) => {
            this.props.winnerName = text;
                      console.log(" handleChangeUserText " + this.props.winnerName);
  };

  handleChangeTournamentText = (text) => {
  };

  submitGame = (text) => {

      console.log("adding game for " + this.props.tournamentName + " " + this.props.winnerName);

    postGameForTournament(this.props.tournamentName, this.props.winnerName)
    .then((response) => {
        console.log(JSON.stringify(response.data.outcomes[0].score_value));
        this.setState({
            gameValue: response.data.outcomes[0].score_value
        });
        this.props.gameValue = response.data.outcomes[0].score_value;
    })
    .catch((error) => {
      console.log('failed to get stats for tournament ' + error);
    }).done();

  };

  render() {
    return (
      < View>
        <StatusBar backgroundColor="blue" barStyle="dark-content"/>


          <SearchBar lightTheme={true} round
              onChangeText={this.handleChangeUserText}
              placeholder="Who's the lucky one?" />
        <Text> Match value : {this.state.gameValue} </Text>
          <Button title='Darn it, I lost!'
              onPress={this.submitGame}/>

      </View>
    );
  }
}

export default GameFormScreen;
