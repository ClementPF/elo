import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Card } from 'react-native-elements';
import { postGameForTournament, getUsersForTournament } from '../api/tournament';
import GameRowContainer from '../containers/GameRowContainer';

class GameFormResultScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func
    //gameValue: PropTypes.string
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return {
      title: navigation.state.params.name,
      headerTintColor: 'white'
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      game: props.navigation.state.params.game
    };
  }

  componentWillMount() {}

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Card title="RESULTS">
          <GameRowContainer user={this.state.game.outcomes[0].user} game={this.state.game} />
        </Card>
      </View>
    );
  }
}

export default GameFormResultScreen;
