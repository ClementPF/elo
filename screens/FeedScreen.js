import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, Text,SectionList, FlatList, StatusBar,TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import { Icon, List , ListItem, Button} from 'react-native-elements';
import GameRow from '../components/GameRow';
import UserStatRow from '../components/UserStatRow';
import EmptyResultsButton from '../components/EmptyResultsButton';
import Moment from 'moment';

import { NavigationActions } from 'react-navigation';

import { getUser, getStatsForUser, getGamesForUser } from '../api/user';

class TournamentScreen extends Component {
static propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func
}

static navigationOptions = ({ navigation }) => {
    const  params = navigation.state.params;
    return {
        title: 'Feed',
    };
};

constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      stats: [],
      games: [],
      user: {}
    };
}

componentWillMount(){

  console.log("componentWillMount");

  getUser().then((response) => {
    this.setState({
        user: response.data
    });
    getStatsForUser(this.state.user.username).then((response) => {
      this.setState({
          stats: response.data,
      });
    })
    .catch((error) => {
      console.log('failed to get stats for user ' + error);
      }).done();

      getGamesForUser(this.state.user.username).then((response) => {
        this.setState({
            games: response.data,
        });
      })
      .catch((error) => {
        console.log('failed to get stats for user ' + error);
      }).done();
  })
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
    //var str = Moment(game.date).format('d MMM');

    return str;
}

  _renderItem = ({ item , index }) => {
     console.log("_renderItem " + index);
 }

  _renderItemGame = ({item, index}) => (
      <GameRow
          name1= { item.outcomes[item.outcomes[0].result == "WIN" ? 0 : 1].user_name}
          name2= { item.outcomes[item.outcomes[0].result != "WIN" ? 0 : 1].user_name }
          tournament= { item.tournament_name }
          result= { item.outcomes[item.outcomes[0].user_name == this.state.user.username ? 0 : 1] }
          value= { item.outcomes[item.outcomes[0].user_name == this.state.user.username ? 0 : 1].score_value }
          date= { item.date }
      />
     );

     _renderItemTournament = ({item, index}) => (
        <TouchableOpacity onPress = { () => this.props.navigation.navigate('Tournament', { name: item.tournament_name })}>
             <UserStatRow
                 tournament= { item.tournament_display_name }
                 position= { 1 }
                 score= { item.score }
             />
         </TouchableOpacity>
    );

    _onRefresh() {
      console.log('refreshing ')
    this.setState({refreshing: true});

    getStatsForUser(this.state.user.username).then((response) => {
      this.setState({
          stats: response.data
      });
    })
    .catch((error) => {
      console.log('failed to get stats for user ' + error);
      }).then(() => {
        this.setState({refreshing: false});
      });

      getGamesForUser(this.state.user.username).then((response) => {
        this.setState({
            games: response.data
        });
      })
      .catch((error) => {
        console.log('failed to get stats for user ' + error);
     }).done();
  }


  render() {
      const { navigate } = this.props.navigation;
      const rows = this.state.stats;
      return (
      <View
        style = { feedScreenStyle.container }>
        <StatusBar translucent={ false } barStyle="light-content" />
        <SectionList
          style = { feedScreenStyle.list }
          data={ [...this.state.stats, ...this.state.games]}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
          renderSectionHeader={({ section: { title } }) => <Text style={ feedScreenStyle.sectionHeaderText }>{title}</Text>}
          sections={[
            { title: 'YOUR TOURNAMENTS', data: this.state.stats, renderItem: this._renderItemTournament },
            { title: 'YOUR HISTORY', data: this.state.games, renderItem: this._renderItemGame }
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

feedScreenStyle = StyleSheet.create({
    container: {
        paddingTop: 8,
    },
    list: {
        paddingRight: 16,
        paddingLeft: 16,
    },
    sectionHeaderText: {
        padding: 8,
        fontSize: 20,
        fontWeight: 'normal',
        color: 'grey',
        textAlign: 'center',
        backgroundColor:'gainsboro'
    }
})

export default TournamentScreen;
