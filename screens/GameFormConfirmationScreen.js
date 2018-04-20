import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ScrollView, View, Text, KeyboardAvoidingView, FlatList, StatusBar, AsyncStorage} from 'react-native';
import {Button, SearchBar, Icon, List, ListItem} from 'react-native-elements'
import {postGameForTournament} from '../api/tournament'

class GameFormConfirmationScreen extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
  };

  static navigationOptions = ({ navigation }) => {
      const  params = navigation.state.params;
      return {
          title: navigation.state.params.name,
      };
  };

  constructor(props) {
      super(props);
      this.state = {
          winner : props.navigation.state.params.winner,
          tournament: props.navigation.state.params.tournament,
      };
  }

  componentWillMount(){
    console.log("componentWillMount");
  }

  submitGame = (text) => {
      console.log("adding game for " + this.state.winner.username + " " + this.state.tournament.name);

      postGameForTournament(this.state.tournament.name, this.state.winner.username)
        .then((response) => {
            console.log(JSON.stringify(response.data.outcomes[0].score_value));
            this.props.navigation.navigate('GameFormResult', { tournament: this.state.tournament, winner: this.state.winner, game:  response.data});
        })
        .catch((error) => {
          console.log('failed to post game for tournament ' + error);
        }).done();
  };

  render() {
    return (

      <View>
      <Text> Tournament : {this.state.tournament.name} </Text>
      <Text> Winner : {this.state.winner.username} </Text>
      <Button title='Darn it, I lost!'
                  onPress={this.submitGame}/>
      </View>
    );
  }
}

export default GameFormConfirmationScreen;
