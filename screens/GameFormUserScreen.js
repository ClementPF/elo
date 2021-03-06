import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { Button, SearchBar, Icon, ListItem } from 'react-native-elements';
import SearchableFlatList from '../components/SearchableFlatList';
import { getTournaments, getUsersForTournament } from '../api/tournament';
import { getTournamentsForUser } from '../api/user';
import { getUser, getUsers } from '../api/user';
import UserStatRow from '../components/UserStatRow';
import EmptyResultsButton from '../components/EmptyResultsButton';
import SearchableSectionList from '../components/SearchableSectionList';
import * as R from 'constants';

class GameFormUserScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return {
      title: 'Select the winner',
      headerTintColor: 'white'
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      topPlayers: [],
      allPlayers: [],
      winnerName: '',
      refreshing: false,
      tournament: props.navigation.state.params.tournament
    };
  }

  componentWillMount() {
    console.log('componentWillMount');
    this.loadLists();
  }

  loadLists() {
    getUsersForTournament(this.state.tournament.name)
      .then(users => {
        console.log(' ' + users[0].first_name + ' ' + users[0].stats[0].score);

        this.setState({
          topPlayers: users
        });
      })
      .catch(error => {
        console.log('failed to get stats for user ' + error);
      })
      .done();

    getUsers()
      .then(users => {
        this.setState({
          allPlayers: users,
          refreshing: false
        });
      })
      .catch(error => {
        //console.log('failed to get stats for user ' + error);
      })
      .done();
  }

  handleChangeUserText = text => {
    this.props.winnerName = text;
    this.setState({ winnerName: text });
    //console.log(" handleChangeUserText " + this.props.winnerName);
  };

  _onPressRow = (rowID, rowData) => {
    //console.log('Selected user :' + rowID.username);

    this.props.navigation.navigate('GameFormConfirmation', {
      tournament: this.state.tournament,
      winner: rowID
    });
  };

  renderItem = ({ item, i }) => (
    <TouchableOpacity onPress={this._onPressRow.bind(i, item)}>
      <UserStatRow
        tournament={item.first_name + ' ' + item.last_name}
        position={1}
        score={item.stats != null ? item.stats[0].score : 1000}
      />
    </TouchableOpacity>
  );

  _onRefresh() {
    //console.log('refreshing ')
    this.setState({ refreshing: true });
    this.loadLists();
  }

  render() {
    let sections = [
      { title: 'TOP PLAYERS', data: this.state.topPlayers, renderItem: this.renderItem },
      { title: 'ALL PLAYERS', data: this.state.allPlayers, renderItem: this.renderItem }
    ];
    sections = sections.filter(section => section.data.length > 0);

    return (
      <View style={{ flex: 1 }}>
        <SearchBar
          lightTheme={false}
          onChangeText={this.handleChangeUserText}
          placeholder={this.state.winnerName}
        />

        <SearchableSectionList
          style={R.palette.sectionList}
          data={[...this.state.topPlayers, ...this.state.allPlayers]}
          searchProperty={'username'}
          searchTerm={this.state.winnerName}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={R.palette.sectionHeaderText}>{title}</Text>
          )}
          sections={sections}
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}
          ListEmptyComponent={
            <EmptyResultsButton
              title="No player here ? Go find some people and tell them how great the sharkulator is."
              onPress={() => {
                this.props.navigation.navigate('Tournaments');
              }}
            />
          }
        />
      </View>
    );
  }
}

export default GameFormUserScreen;
