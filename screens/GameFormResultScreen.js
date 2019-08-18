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
    const { name } = navigation.state.params;
    return {
      title: name,
      headerTintColor: 'white'
    };
  };

  constructor(props) {
    super(props);
    const { game } = props.navigation.state.params;
    this.state = {
      game
    };
  }

  componentWillMount() {}

  render() {
    const { game } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Card title="RESULTS">
          <GameRowContainer user={game.outcomes[0].user} game={game} />
        </Card>
      </View>
    );
  }
}

export default GameFormResultScreen;
