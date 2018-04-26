import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StatusBar, StyleSheet, SectionList, TouchableOpacity} from 'react-native';
import {Button, SearchBar, Icon} from 'react-native-elements';
import SearchableFlatList from '../components/SearchableFlatList';
import {getTournaments} from '../api/tournament';
import {getTournamentsForUser} from '../api/user';
import {getUser} from '../api/user';
import TournamentRow from '../components/TournamentRow';
import EmptyResultsButton from '../components/EmptyResultsButton';
import SearchableSectionList from '../components/SearchableSectionList';

class GameFormTournamentScreen extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
  };

  static navigationOptions = ({ navigation }) => {
      const  params = navigation.state.params;
      return {
          title: "Select Tournament",
      };
  };

  constructor(props) {
      super(props);
      this.state = {
          user : {},
          topTournaments : [],
          allTournaments : [],
          tournamentName: '',
          refreshing: false
      };
  }

  componentWillMount(){

    console.log("componentWillMount");

    getUser().then((response) => {
      this.setState({
          user: response.data
      });
      this.loadLists();
    })
  }

  loadLists(){

      getTournamentsForUser(this.state.user.username).then((response) => {
        this.setState({
            topTournaments: response.data,
        });
      })
      .catch((error) => {
        console.log('failed to get stats for user ' + error);
        }).done();

        getTournaments().then((response) => {
          this.setState({
              allTournaments: response.data,
              refreshing: false,
          });
        })
        .catch((error) => {
          console.log('failed to get stats for user ' + error);
        }).done();
  }

  handleChangeTournamentText = (text) => {
      this.props.tournamentName = text;
      this.setState({tournamentName: text})
      console.log(" handleChangeTournamentText " + this.props.tournamentName);
  }

  _onPressRow = (rowID, rowData)  => {

      console.log(rowID);

      this.props.tournamentName = rowID.name;

      console.log("Tournament selected named : " + rowID.name);

   }

   _keyExtractor = (item, index) => item.id;

   _renderItemTournament = ({item, index}) => (
      <TouchableOpacity onPress = { () => this.props.navigation.navigate('GameFormUser', { tournament: item })}>
           <TournamentRow
               tournament= { item.display_name }
               sport= { item.sport.name }
           />
       </TouchableOpacity>
  );

  _onRefresh() {
    console.log('refreshing ')
    this.setState({refreshing: true});
    this.loadLists();
}


render() {
    return (
        <View style={{flex:1}} >
            <SearchBar
                lightTheme={true} round
                onChangeText={this.handleChangeTournamentText}
                placeholder={this.state.tournamentName} />

            <SearchableSectionList
                style = { feedScreenStyle.list }
                data={ [...this.state.topTournaments, ...this.state.allTournaments] }
                   searchProperty={"display_name"}
                   searchTerm={this.state.tournamentName}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
                renderSectionHeader={({ section: { title } }) => <Text style={ feedScreenStyle.sectionHeaderText }>{title}</Text>}
                sections={[
                { title: 'RECENT TOURNAMENTS', data: this.state.topTournaments, renderItem: this._renderItemTournament },
                { title: 'ALL TOURNAMENTS', data: this.state.allTournaments, renderItem: this._renderItemTournament },
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

gameFormStyle = StyleSheet.create({
    listHeader: {
        backgroundColor: 'whitesmoke',
        padding:4,
        paddingHorizontal:8,
        color:'slategrey',
            fontSize: 16,
            fontWeight: 'bold',
            textAlignVertical: 'center'
    }
})

export default GameFormTournamentScreen;
