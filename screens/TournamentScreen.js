import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, SectionList, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Icon, List, Card} from 'react-native-elements';
import GameRow from '../components/GameRow';
import RankRow from '../components/RankRow';
import EmptyResultsButton from '../components/EmptyResultsButton';
import TournamentRow from '../components/TournamentRow';
import { invalidateData } from '../redux/actions/RefreshAction';
import { connect } from 'react-redux';

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
        title: params.tournamentDisplayName,
        headerTintColor: 'white'
    };
};

constructor(props) {
    super(props);

    this.state = {
        refreshing: false,
        stats: [],
        games: [],
        userStats: props.navigation.state.params.userStats,
        tournamentName: props.navigation.state.params.tournamentName,
        tournamentDisplayName: props.navigation.state.params.tournamentDisplayName
    };
}

componentWillMount(){

    console.log("componentWillMount for tournament " + this.state.tournamentName);
    this.fetchData();
}

_keyExtractor = (item, index) => item.id;

_renderItemGame = ({item}) => (
  <GameRow
      name1= { item.outcomes[item.outcomes[0].result == 'WIN' ? 0 : 1].user_name }
      name2= { item.outcomes[item.outcomes[0].result != 'WIN' ? 0 : 1].user_name }
      tournament= { item.tournament_display_name }
      result= { true }
      value= { item.outcomes[0].score_value > 0 ? item.outcomes[0].score_value : item.outcomes[1].score_value }
      date= { item.date }
  />
 );

_renderItemRank = ({item, index}) => (

    <TouchableOpacity
        onPress= { () => this.props.navigation.navigate('User', { userStats: item, userName: item.username, tournamentName: item.tournament_name, tournamentDisplayName: item.tournament_display_name }) }>
        <RankRow
            name= { item.username }
            position= { index + 1 }
            score= { item.score }
        />
    </TouchableOpacity>
);

fetchData(){
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

_onRefresh() {
  console.log('refreshing ')
  this.setState({refreshing: true});
  this.fetchData();
}

componentWillReceiveProps(nextProps) {
    console.log("TournamentScreen - componentWillReceiveProps " + JSON.stringify(nextProps));
  if (nextProps.error && !this.props.error) {
    this.props.alertWithType('error', 'Error', nextProps.error);
  }
  if(nextProps.invalidateData == true){
      console.log("TournamentScreen - componentWillReceiveProps " + nextProps.invalidateData == true ? ' invalidateData true' : ' invalidateData false');
      this.fetchData();
  }
}

  render() {
      const userStats = this.state.userStats;

      var sections = [
          { title: 'RANKING', data: this.state.stats, renderItem: this._renderItemRank },
          { title: 'HISTORY', data: this.state.games, renderItem: this._renderItemGame }
      ];
      sections = sections.filter(section => section.data.length > 0);

      return (
        <View style={{flex: 1}}>
            <StatusBar translucent={ false } barStyle="light-content" />

                    <SectionList
                      style = { feedScreenStyle.list }
                      keyExtractor={ ( item, index) => item + index }
                      renderItem={ ({ item, index, section }) => <Text key={ index }>{ item }</Text> }
                      renderSectionHeader={ ({ section: { title } }) => <Text style={ feedScreenStyle.sectionHeaderText }>{title}</Text> }
                      sections={ sections }
                      refreshing={ this.state.refreshing }
                      onRefresh={ this._onRefresh.bind(this) }
                      ListEmptyComponent={
                        <EmptyResultsButton
                          title="No Games have been played for this tournament, let's change that."
                          onPress={ () => { this.props.navigation.navigate('GameFormWinnerLooser');} }/>
                    }/>

        </View>
    );
  }
}

const mapStateToProps = ({ refreshReducer }) => {
    console.log('TournamentScreen - mapStateToProps ');
    const { invalidateData } = refreshReducer;
    return { invalidateData };
};

export default connect(mapStateToProps, { invalidateData })(TournamentScreen);
