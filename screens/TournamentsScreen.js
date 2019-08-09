import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon, Button, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import { NavigationActions } from 'react-navigation';
import SearchableSectionList from '../components/SearchableSectionList';
import EmptyResultsButton from '../components/EmptyResultsButton';
import TournamentRow from '../components/TournamentRow';
import SearchBar from '../components/SearchBar';
import { getTournaments } from '../api/tournament';
import { getSports } from '../api/sport';

class TournamentsScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    error: PropTypes.object,
    isDataStale: PropTypes.bool,
    tournamentName: PropTypes.string
  };

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Explore Tournaments',
      headerTintColor: 'white',
      headerRight: (
        <Button
          icon={{ name: 'add' }}
          buttonStyle={{
            backgroundColor: 'transparent'
          }}
          title="Add"
          onPress={() => {
            navigation.navigate('TournamentCreation');
          }}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      sports: [],
      tournaments: [],
      tournamentName: ''
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    // console.log('TournamentsScreen - componentWillReceiveProps' + JSON.stringify(nextProps));
    if (nextProps.error && !this.props.error) {
      this.onError(nextProps.error);
    }

    if (nextProps.isDataStale == true) {
      // console.log('TournamentsScreen - componentWillReceiveProps ' + nextProps.invalidateData == true ? ' invalidateData true' : ' invalidateData false');
      this.fetchData();
    }
  }

  handleChangeTournamentText = text => {
    this.props.tournamentName = text;
    this.setState({ tournamentName: text });
    // console.log(' handleChangeTournamentText ' + this.props.tournamentName);
  };

  fetchData() {
    Promise.all([
      getTournaments()
        .then(response => {
          this.setState({ tournaments: response.data, refreshing: false });
        })
        .catch(error => {
          this.onError(`failed to get tournaments : ${error}`);
        })
    ]).then(() => {
      this.setState({ loading: false, refreshing: false });
    });
  }

  _onPressRow = (rowID, rowData) => {
    this.props.tournamentName = rowID.name;
    this.props.navigation.navigate('Tournament', {
      tournamentName: rowID.name,
      tournamentDisplayName: rowID.display_name
    });
  };

  renderItemTournament = ({ item, i }) => (
    <TouchableOpacity onPress={this._onPressRow.bind(i, item)}>
      <TournamentRow
        tournament={item.display_name}
        tournamentIdName={item.name}
        sport={item.sport.name}
      />
    </TouchableOpacity>
  );

  _onRefresh() {
    this.fetchData();
  }

  onError = error => {
    if (error) {
      this.dropdown.alertWithType('error', 'Error', error);
    }
  };

  onClose(data) {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
  }

  render() {
    const { tournaments, tournamentName, refreshing } = this.state;
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="small" color="white" />
          <DropdownAlert ref={ref => (this.dropdown = ref)} onClose={data => this.onClose(data)} />
        </View>
      );
    }
    let sections = [
      {
        title: 'ALL TOURNAMENTS',
        data: tournaments,
        renderItem: this.renderItemTournament
      }
    ];
    sections = sections.filter(section => section.data.length > 0);

    return (
      <View style={{ flex: 1 }}>
        <SearchBar
          style={{
            marginLeft: 16,
            marginRight: 16
          }}
          onChangeText={this.handleChangeTournamentText}
          placeholder={tournamentName}
        />

        <SearchableSectionList
          style={searchableSectionList.list}
          data={[tournaments]}
          searchProperty="display_name"
          searchTerm={tournamentName}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={searchableSectionList.sectionHeaderText}>{title}</Text>
          )}
          sections={sections}
          refreshing={refreshing}
          onRefresh={this._onRefresh.bind(this)}
          ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
          ListEmptyComponent={(
            <EmptyResultsButton
              title="Cant' find what you're looking for? why don't you create a new tournament and start praying on some fishes"
              onPress={() => {
                            this.props.navigation.navigate('TournamentCreation');
                          }}
                        />
            )}
        />
        <DropdownAlert ref={ref => (this.dropdown = ref)} onClose={data => this.onClose(data)} />
      </View>
    );
  }
}

const mapStateToProps = ({ refreshReducer }) =>
  // console.log('TournamenstScreen - mapStateToProps ');
  ({ isDataStale: refreshReducer.isDataStale });
export default connect(
  mapStateToProps,
  {}
)(TournamentsScreen);
