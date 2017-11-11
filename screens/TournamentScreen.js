import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, StatusBar } from 'react-native';
import { Icon, List , ListItem} from 'react-native-elements'


import { getStatsForTournament } from '../api/tournament';

import { NavigationActions } from 'react-navigation';

class TournamentScreen extends Component {
static propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func
}

static navigationOptions = ({ navigation }) => {
    const  params = navigation.state.params;
    return {
        title: 'Tournament',
        headerTitleStyle :{color:'#FFFFFF'},
        headerStyle: {backgroundColor:'#3c3c3c'},
        headerRight: <Icon style={{ marginLeft:15,color:'#fff' }} name={'bars'} size={25} onPress={() => params.handlePress()} />
    };
};

constructor(props) {
    super(props);
    this.state = {
        stats: []
    };
}

componentWillMount(){

  console.log("componentWillMount");


  this.props.navigation.setParams({ handlePress: this._handlePress });

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

  _handlePress(){
  console.log("click");

  const navigateAction = NavigationActions.navigate({

    routeName: 'Main',

    params: {},

    action: NavigationActions.navigate({ routeName: 'GameForm'})
  })

  this.props.navigation.dispatch(navigateAction)

    //NavigationActions.navigate({ routeName: 'Main' })
  };




  render() {

  const rows = this.state.stats;
    return (
      <View>
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
