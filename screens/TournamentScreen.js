import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, StatusBar, ScrollView } from 'react-native';
import { Icon, List , ListItem, Card} from 'react-native-elements'


import { getStatsForTournament, getGamesForTournament } from '../api/tournament';

import { NavigationActions } from 'react-navigation';

class TournamentScreen extends Component {
static propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func
}

static navigationOptions = ({ navigation }) => {
    const  params = navigation.state.params;
    return {
        title: params.name,
    };
};

constructor(props) {
    super(props);
    this.state = {
        stats: [],
        games: [],
        tournamentName: props.navigation.state.params.name
    };
}

componentWillMount(){

    console.log("componentWillMount for tournament " + this.state.tournamentName);

    getStatsForTournament(this.state.tournamentName).then((response) => {
        this.setState({stats: response.data})
    }).catch((error) => {
        console.log('failed to get stats for tournament : ' + + error);
    }).done();

    getGamesForTournament(this.state.tournamentName).then((response) => {
        this.setState({games: response.data})
    }).catch((error) => {
        console.log('failed to get games for tournament : ' + + error);
    }).done();
}


textForGameResult(game){
    var player_one = game.outcomes[0].user_name;
    var player_two = game.outcomes[1].user_name;
    var result = game.outcomes[0].result;

    var str = `${player_one} ${result} against ${player_two}`;

    return str;
}

componentWillReceiveProps(nextProps) {
  if (nextProps.error && !this.props.error) {
    this.props.alertWithType('error', 'Error', nextProps.error);
  }
}

  render() {

  const stats = this.state.stats;
  const games = this.state.games;
    return (
        <View style={{flex: 1}}>
            <StatusBar translucent={false} barStyle="dark-content" />
            <ScrollView>
                    <Card title="RANKING">
                        <List style={{flex: 1}}>
                            {
                            stats.map((item, i) => (
                            <ListItem
                            key={i}
                            title={item.username}
                            subtitle = {item.score.toFixed(0)}
                            hideChevron = {true}
                            />
                            ))
                            }
                        </List>
                    </Card>
                    <Card title="HISTORY">
                        <List style={{flex: 1}}>
                            {
                            games.map((item, i) => (
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

  /*
  render() {

  const rows = [{username:'a',score:10, stats_id: 1}];
  console.log('rendering : ' + rows);
    return (
      <View style={{ flex: 0 }}>
        <StatusBar translucent={false} barStyle="dark-content" />

      <FlatList
          data={this.state.stats}
          renderItem={({ item , index }) => (
            <ListItem
              index={index + 1}
              text={item.username}
              subText={item.score}
              onPress={this.handlePress}
            />
          )}
          keyExtractor={item => item.stats_id}
          ItemSeparatorComponent={Separator}
        />
      </View>
    );
  }
} */

const mapStateToProps = (state) => {
  const tournamentName = state.games.tournamentName;

  return {
  };
};

export default TournamentScreen;
