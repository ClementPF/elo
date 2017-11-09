import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, StatusBar } from 'react-native';
import { List , ListItem} from 'react-native-elements'

import { getStatsForTournament } from '../api/tournament';

import { NavigationActions } from 'react-navigation';

class TournamentScreen extends Component {
static propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func
}

constructor(props) {
    super(props);
    this.state = {
        stats: []
    };
}

componentWillMount(){

  console.log("componentWillMount");


  getStatsForTournament('tournament1').then((response) => {
    this.setState({
        stats: response.data
    });
  })
  .catch((error) => {
    console.log('failed to get stats for tournament ' + error);
  }).done();
}

componentWillReceiveProps(nextProps) {
  if (nextProps.error && !this.props.error) {
    this.props.alertWithType('error', 'Error', nextProps.error);
  }
}

  handlePress = () => {
    this.props.navigation.navigate('GameForm', { title: 'Game Form'});
  };




  render() {

  const rows = this.state.stats;
    return (
      <View style={{ flex: 0 }}>
        <StatusBar translucent={false} barStyle="dark-content" />

        <List>
          {
            rows.map((item, i) => (
              <ListItem
                key={i}
                title={item.username}
                subtitle = {item.score.toFixed(0)}
                hideChevron = {true}
              />
            ))
          }
        </List>
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
