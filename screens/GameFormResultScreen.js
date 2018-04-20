import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ScrollView, View, Text, KeyboardAvoidingView, FlatList, StatusBar, AsyncStorage} from 'react-native';
import {Button, SearchBar, Icon, List, ListItem} from 'react-native-elements'
import {postGameForTournament, getUsersForTournament} from '../api/tournament'

class GameFormResultScreen extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    //gameValue: PropTypes.string
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
          game : props.navigation.state.params.game,
          winner : props.navigation.state.params.winner,
          tournament: props.navigation.state.params.tournament,
      };
  }

  componentWillMount(){

    console.log("componentWillMount");
  }

  render() {
     return (
      <View>
      <Text> Tournament : {this.state.tournament.name} </Text>
      <Text> Winner : {this.state.winner.username} </Text>
        <Text> Match value : {this.state.game.outcomes[0].score_value} </Text>
      </View>
    );
  }
}

export default GameFormResultScreen;
