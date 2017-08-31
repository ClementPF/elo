import React, { Component, PropTypes }  from 'react';
import { View, FlatList, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import { ListItem, Separator } from '../components/List';
import { Header } from '../components/Header';
import currencies from '../data/currencies';

import { Container } from '../components/Container';
import { getStatsForTournament } from '../actions/games';

class Home extends Component {
static propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
}

componentWillMount(){
  console.log("componentWillMount");
  this.props.dispatch(getStatsForTournament('tournament1'));
}

  handlePress = () => {
    this.props.navigation.navigate('GameForm', { title: 'Game Form'});
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar translucent={false} barStyle="dark-content" />
      <Header onPress={this.handlePress}/>
      <FlatList
          data={currencies}
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


export default connect()(Home);
