import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, Text, FlatList, StatusBar, ScrollView } from 'react-native';
import { Icon, List , ListItem, Card} from 'react-native-elements'

import { NavigationActions } from 'react-navigation';

import { getStatsForUser, getGamesForUser } from '../api/user';

class TournamentScreen extends Component {
static propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func
}

static navigationOptions = ({ navigation }) => {
    const  params = navigation.state.params;
    return {
        title: 'Feed'
    };
};

constructor(props) {
    super(props);
    this.state = {
        stats: [],
        games: []
    };
}

componentWillMount(){

  console.log("componentWillMount");

  getStatsForUser("clement-frequency").then((response) => {
    this.setState({
        stats: response.data
    });
  })
  .catch((error) => {
    console.log('failed to get stats for user ' + error);
    }).done();

    getGamesForUser("clement-frequency").then((response) => {
      this.setState({
          games: response.data
      });
    })
    .catch((error) => {
      console.log('failed to get stats for user ' + error);
    }).done();

}

componentWillReceiveProps(nextProps) {
  if (nextProps.error && !this.props.error) {
    this.props.alertWithType('error', 'Error', nextProps.error);
  }
}

textForGameResult(game){
    var player_one = game.outcomes[0].user_name;
    var player_two = game.outcomes[1].user_name;
    var result = game.outcomes[0].result;

    var str = `${player_one} ${result} against ${player_two}`;

    return str;
}

  render() {
      const { navigate } = this.props.navigation;
      const rows = this.state.stats;
    return (
      <View>
        <StatusBar translucent={false} barStyle="dark-content" />
        <ScrollView>
            <Card title="YOUR TOURNAMENTS">
            <List style={{flex: 1}}>
            {
            this.state.stats.map((item, i) => (
                <ListItem
                key={i}
                title={item.tournament_name}
                subtitle = {item.score.toFixed(0)}
                hideChevron = {true}
                onPress = { () => navigate('Tournament', { name: item.tournament_name })}
                />
            ))
            }
            </List>

          </Card>

                <Card title="RECENT STUFFS RELATED TO YOU">
            <List style={{flex: 3}}>
            {
            this.state.games.map((item, i) => (
                <ListItem
                key={i}
                title={this.textForGameResult(item)}
                subtitle = {item.outcomes[0].score_value.toFixed(0)}
                subtitleStyle = {{textAlign: 'right'}}
                hideChevron = {true}
                />
            ))
            }
            </List>

        </Card>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const tournamentName = state.games.tournamentName;

  return {
  };
};

export default TournamentScreen;
