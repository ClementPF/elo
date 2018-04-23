import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, Text, FlatList, StatusBar, ScrollView,TouchableOpacity } from 'react-native';
import { Icon, List , ListItem, Card, Button} from 'react-native-elements';
import GameRow from '../components/GameRow';
import TournamentRow from '../components/TournamentRow';
import Moment from 'moment';

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

  getStatsForUser("").then((response) => {
    this.setState({
        stats: response.data
    });
  })
  .catch((error) => {
    console.log('failed to get stats for user ' + error);
    }).done();

    getGamesForUser("").then((response) => {
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
    //var str = Moment(game.date).format('d MMM');

    return str;
}

  _keyExtractor = (item, index) => item.id;

  _renderItemGame = ({item}) => (
      <GameRow
          name1= { item.outcomes[0].user_name }
          name2= { item.outcomes[1].user_name }
          tournament= { item.tournament_name }
          result= { item.outcomes[1].result }
          value= { item.outcomes[0].score_value }
          date= { item.date }
      />
     );

     _renderItemTournament = ({item}) => (
         <TouchableOpacity onPress = { () => this.props.navigation.navigate('Tournament', { name: item.tournament_name })}>
             <TournamentRow
                 tournament= { item.tournament_display_name }
                 position= { 1 }
                 score= { item.score }
             />
         </TouchableOpacity>
    );

  render() {
      const { navigate } = this.props.navigation;
      const rows = this.state.stats;
    return (
      <View>
        <StatusBar translucent={ false } barStyle="light-content" />
        <ScrollView>
            <Card title="YOUR TOURNAMENTS">
                <FlatList
                data={ this.state.stats }
                keyExtractor={ this._keyExtractor }
                renderItem={ this._renderItemTournament }
                ListEmptyComponent={
                    <Button raised
                        icon={{name: 'add'}}
                        title="Havn't played yet, create a tournament or enter a game"
                        onPress={ () => { this.props.navigation.navigate('Tournaments');}}
                        buttonStyle={{
                          backgroundColor: "tomato",
                          borderColor: "transparent",
                          borderWidth: 0,
                          borderRadius: 10
                        }}/>
                    }
              //onPress = { () => navigate('Tournament', { name: item.tournament_name })
          />

          </Card>
          <Card title="GAME HISTORY">
                <FlatList
                    data={ this.state.games }
                    keyExtractor={ this._keyExtractor }
                    renderItem={ this._renderItemGame }
                    ListEmptyComponent={
                        <Button raised
                            icon={{name: 'add'}}
                            title="Looks pretty emtpy, why don't you just go play a game, treat yourself, you deserve it"
                            onPress={ () => { this.props.navigation.navigate('GameFormTournament');}}
                            buttonStyle={{
                              backgroundColor: "tomato",
                              borderColor: "transparent",
                              borderWidth: 0,
                              borderRadius: 10
                            }}/>
                        }
                    />
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
