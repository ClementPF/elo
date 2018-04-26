import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, StatusBar } from 'react-native';
import { Icon, List , ListItem, Card} from 'react-native-elements';
import GameRow from '../components/GameRow';
import RankRow from '../components/RankRow';

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

componentWillReceiveProps(nextProps) {
  if (nextProps.error && !this.props.error) {
    this.props.alertWithType('error', 'Error', nextProps.error);
  }
}

  render() {

    return (
        <View style={{flex: 1}}>
            <StatusBar translucent={false} barStyle="light-content" />

                    <Card title="RANKING">
                        <FlatList
                            data={ this.state.stats }
                            keyExtractor={ this._keyExtractor }
                            renderItem={ this._renderItemRank }/>
                    </Card>
                    <Card title="HISTORY">
                        <FlatList
                            data={ this.state.games }
                            keyExtractor={ this._keyExtractor }
                            renderItem={ this._renderItemGame }/>
                    </Card>

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
