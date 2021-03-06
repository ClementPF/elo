import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getTournaments } from '../api/tournament';
import { getTournamentsForUser } from '../api/user';
import TournamentRow from '../components/TournamentRow';
import SearchBar from '../components/SearchBar';
import EmptyResultsButton from '../components/EmptyResultsButton';
import SearchableSectionList from '../components/SearchableSectionList';
import DropdownAlert from 'react-native-dropdownalert';

import { connect } from 'react-redux';

class GameFormTournamentScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    error: PropTypes.object,
    tournamentName: PropTypes.string,
    user: PropTypes.object
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return { isWinner: null, title: 'Select Tournament', headerTintColor: 'white' };
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      topTournaments: [],
      allTournaments: [],
      tournamentName: '',
      isWinner: props.navigation.state.params.isWinner
    };
  }

  componentWillMount() {
    //console.log("GameFormTournamentScreen - componentWillMount");

    // this line is to load the lists if the user props has been already loaded.
    // ie: resetting navigation after a game is added
    if (this.props.user != null) {
      this.fetchData(this.props.user);
    }
  }

  componentWillReceiveProps(nextProps) {
    //console.log("GameFormTournamentScreen - componentWillReceiveProps " + JSON.stringify(nextProps));
    //console.log("GameFormTournamentScreen - componentWillReceiveProps this.props= " + JSON.stringify(this.props));
    if (nextProps.error && !this.props.error) {
      this.onError(nextProps.error);
    }

    if (nextProps.user != null) {
      this.fetchData(nextProps.user);
    }
  }

  fetchData(user) {
    Promise.all([
      getTournamentsForUser(user.username)
        .then(tournaments => {
          this.setState({ topTournaments: tournaments });
        })
        .catch(error => {
          this.onError('Failed to get your most recent tournaments. ' + error);
          //console.log('failed to get stats for user ' + error);
        }),
      getTournaments()
        .then(tournaments => {
          this.setState({ allTournaments: tournaments, refreshing: false });
        })
        .catch(error => {
          this.onError('Failed all tournaments. ' + error);
          //console.log('failed to get stats for user ' + error);
        })
    ]).then(() => {
      this.setState({ loading: false, refreshing: false });
    });
  }

  handleChangeTournamentText = text => {
    this.props.tournamentName = text;
    this.setState({ tournamentName: text });
    //console.log(" handleChangeTournamentText " + this.props.tournamentName);
  };

  _keyExtractor = (item, index) => item.id;

  onPress(item) {
    const { navigation } = this.props;
    const { isWinner } = this.state;
    if (navigation.state.params.returnData !== undefined) {
      // case of user changing the tournament by clicking EDIT
      navigation.state.params.returnData(item);
      navigation.goBack();
    }
  }

  renderItemTournament = ({ item, index }) => (
    <TouchableOpacity onPress={() => this.onPress(item)}>
      <TournamentRow
        tournament={item.display_name}
        tournamentIdName={item.name}
        sport={item.sport.name}
      />
    </TouchableOpacity>
  );

  _onRefresh() {
    //console.log('refreshing ' + this.props.user.username)
    this.setState({ refreshing: true });
    this.fetchData(this.props.user);
  }

  onError = error => {
    if (error) {
      this.dropdown.alertWithType('error', 'Error', error);
    }
  };

  onClose(data) {
    // data = { type, title, message, action }
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="small" color="white" />
          <DropdownAlert ref={ref => (this.dropdown = ref)} onClose={data => this.onClose(data)} />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <SearchBar
            style={{
              marginLeft: 16,
              marginRight: 16
            }}
            lightTheme={false}
            onChangeText={this.handleChangeTournamentText}
            placeholder={this.state.tournamentName}
          />

          <SearchableSectionList
            style={searchableSectionList.list}
            data={[...this.state.topTournaments, ...this.state.allTournaments]}
            searchProperty={'display_name'}
            searchTerm={this.state.tournamentName}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item, index, section }) => <Text key={index}>{item} </Text>}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={searchableSectionList.sectionHeaderText}>{title} </Text>
            )}
            sections={[
              {
                title: 'RECENT TOURNAMENTS',
                data: this.state.topTournaments,
                renderItem: this.renderItemTournament
              },
              {
                title: 'ALL TOURNAMENTS',
                data: this.state.allTournaments,
                renderItem: this.renderItemTournament
              }
            ]}
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
            ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
            ListEmptyComponent={
              <EmptyResultsButton
                title="Cant' find what you're looking for? why don't you create a new tournament and start praying on some fishes"
                onPress={() => {
                  this.props.navigation.navigate('Tournaments');
                }}
              />
            }
          />
          <DropdownAlert ref={ref => (this.dropdown = ref)} onClose={data => this.onClose(data)} />
        </View>
      );
    }
  }
}

gameFormStyle = StyleSheet.create({
  listHeader: {
    backgroundColor: 'white',
    margin: 4,
    marginHorizontal: 8,
    color: 'slategrey',
    fontSize: 16,
    fontWeight: 'bold',
    textAlignVertical: 'center'
  }
});

const mapStateToProps = state => {
  let user = state.userReducer.user;
  return {
    user: user
  };
};

export default connect(mapStateToProps)(GameFormTournamentScreen);
