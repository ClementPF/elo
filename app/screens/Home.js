import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, StatusBar } from 'react-native';
import { List, ListItem } from 'react-native-elements'
import { connect } from 'react-redux';

import { ListItem, Separator } from '../components/List';
import { Header } from '../components/Header';
import currencies from '../data/currencies';

import { Container } from '../components/Container';
import { connectAlert } from '../components/Alert';
import { loadStatsForTournament, swapCurrency } from '../actions/games';

class Home extends Component {
static propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
}

componentWillMount(){
  console.log("componentWillMount");
  this.props.dispatch(loadStatsForTournament('tournament1'));
}

componentWillReceiveProps(nextProps) {
  if (nextProps.error && !this.props.error) {
    this.props.alertWithType('error', 'Error', nextProps.error);
  }
}

  handlePress = () => {

    this.props.dispatch(loadStatsForTournament('tournament1'));
  //  this.props.navigation.navigate('GameForm', { title: 'Game Form'});
  };

  render() {


  const rows = this.props.stats || [];
    return (
      <View style={{ flex: 1 }}>
        <StatusBar translucent={false} barStyle="dark-content" />
      <Header onPress={this.handlePress}/>
      <FlatList
          data={this.props.stats}
          renderItem={({ item }) => (
            <ListItem
              text={item.statsId.toString()}
              subText={item.score}
              onPress={this.handlePress}
            />
          )}
          keyExtractor={item => item.statsId}
          ItemSeparatorComponent={Separator}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const tournamentName = state.games.tournamentName;

  return {
    stats : state.games.stats,
    tournamentName,
  };
};

export default connect(mapStateToProps)(connectAlert(Home));
