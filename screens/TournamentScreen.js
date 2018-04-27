import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, SectionList, StatusBar, Text } from 'react-native';
import { Icon, List , ListItem} from 'react-native-elements';
import GameRow from '../components/GameRow';
import RankRow from '../components/RankRow';
import EmptyResultsButton from '../components/EmptyResultsButton';

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
        refreshing: false,
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

_keyExtractor = (item, index) => item.id;

_renderItemGame = ({item}) => (
  <GameRow
      name1= { item.outcomes[item.outcomes[0].result == "WIN" ? 0 : 1].user_name}
      name2= { item.outcomes[item.outcomes[0].result != "WIN" ? 0 : 1].user_name }
      tournament= { item.tournament_name }
      result= { "WIN" }
      value= { item.outcomes[0].score_value > 0 ? item.outcomes[0].score_value : item.outcomes[1].score_value }
      date= { item.date }
  />
 );

_renderItemRank = ({item, index}) => (
    <RankRow
        name= { item.username }
        position= { index + 1 }
        score= { item.score }
    />
);


_onRefresh() {
  console.log('refreshing ')
  this.setState({refreshing: true});
  getStatsForTournament(this.state.tournamentName).then((response) => {
    this.setState({stats: response.data})
  }).catch((error) => {
    console.log('failed to get stats for tournament : ' + + error);
  }).done();

  getGamesForTournament(this.state.tournamentName).then((response) => {
    this.setState({games: response.data})
    this.setState({refreshing: false});
  }).catch((error) => {
    console.log('failed to get games for tournament : ' + + error);
  }).done();
}

componentWillReceiveProps(nextProps) {
  if (nextProps.error && !this.props.error) {
    this.props.alertWithType('error', 'Error', nextProps.error);
  }
}

  render() {

    return (
        <View style={{flex: 1}}>
            <StatusBar translucent={false} barStyle="light-content" />
                    <SectionList
                      style = { feedScreenStyle.list }
                      data={ [...this.state.stats, ...this.state.games]}
                      keyExtractor={(item, index) => item + index}
                      renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
                      renderSectionHeader={({ section: { title } }) => <Text style={ feedScreenStyle.sectionHeaderText }>{title}</Text>}
                      sections={[
                        { title: 'RANKING', data: this.state.stats, renderItem: this._renderItemRank },
                        { title: 'HISTORY', data: this.state.games, renderItem: this._renderItemGame }
                      ]}
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh.bind(this)}
                      ListEmptyComponent={
                        <EmptyResultsButton
                          title="Havn't played yet, create a tournament or enter a game"
                          onPress={ () => { this.props.navigation.navigate('Tournaments');}}/>
                    }/>

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
