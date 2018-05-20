import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StatusBar, StyleSheet, SectionList, TouchableOpacity} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import SearchableFlatList from '../components/SearchableFlatList';
import {getTournaments} from '../api/tournament';
import {getTournamentsForUser} from '../api/user';
import {getUser} from '../api/user';
import TournamentRow from '../components/TournamentRow';
import SearchBar from '../components/SearchBar';
import EmptyResultsButton from '../components/EmptyResultsButton';
import SearchableSectionList from '../components/SearchableSectionList';

import { connect } from 'react-redux';

class GameFormTournamentScreen extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
  };

  static navigationOptions = ({ navigation }) => {
      const  params = navigation.state.params;
      return {
          isWinner: null,
          title: "Select Tournament",
          headerTintColor: 'white'
      };
  };

  constructor(props) {
      super(props);
      this.state = {
          topTournaments : [],
          allTournaments : [],
          tournamentName: '',
          refreshing: false,
          isWinner: props.navigation.state.params.isWinner
      };
  }

  componentWillMount(){

    console.log("GameFormTournamentScreen - componentWillMount");

    // this line is to load the lists if the user props has been already loaded.
    // ie: resetting navigation after a game is added
    if(this.props.user != null){
        this.loadLists(this.props.user);
    }
  }

  componentWillReceiveProps(nextProps) {

      console.log("GameFormTournamentScreen - componentWillReceiveProps " + JSON.stringify(nextProps));
      console.log("GameFormTournamentScreen - componentWillReceiveProps this.props= " + JSON.stringify(this.props));
      if (nextProps.error && !this.props.error) {
          this.props.alertWithType('error', 'Error', nextProps.error);
      }

      if(nextProps.user != null){
          this.loadLists(nextProps.user);
      }
  }


  loadLists(user){

      getTournamentsForUser(user.username).then((response) => {
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

   onPress(item){
       //if(this.state.isWinner == true){
           this.props.navigation.state.params.returnData(item);
           this.props.navigation.goBack();
       //}else{
        //   this.props.navigation.navigate('GameFormQRScanner', { tournament: item })
     //  }
   }

   _renderItemTournament = ({item, index}) => (
      <TouchableOpacity onPress = { () => this.onPress(item) }>
           <TournamentRow
               tournament= { item.display_name }
               tournament_id_name= { item.name }
               sport= { item.sport.name }
           />
       </TouchableOpacity>
  );

  _onRefresh() {
    console.log('refreshing ' + this.props.user.username)
    this.setState({refreshing: true});
    this.loadLists(this.props.user);
}


render() {
    return (
        <View style={{flex:1}} >
            <SearchBar
                style = { {
                    marginLeft : 16,
                    marginRight: 16 } }
                lightTheme={false}
                onChangeText={this.handleChangeTournamentText}
                placeholder={this.state.tournamentName} />

            <SearchableSectionList
                style = { searchableSectionList.list }
                data={ [...this.state.topTournaments, ...this.state.allTournaments] }
                   searchProperty={"display_name"}
                   searchTerm={this.state.tournamentName}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
                renderSectionHeader={({ section: { title } }) => <Text style={ searchableSectionList.sectionHeaderText }>{title}</Text>}
                sections={[
                { title: 'RECENT TOURNAMENTS', data: this.state.topTournaments, renderItem: this._renderItemTournament },
                { title: 'ALL TOURNAMENTS', data: this.state.allTournaments, renderItem: this._renderItemTournament },
                ]}
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
                ListEmptyComponent={
                <EmptyResultsButton
                title="Cant' find what you're looking for? why don't you create a new tournament and start praying on some fishes"
                onPress={ () => { this.props.navigation.navigate('Tournaments');}}/>
            }/>
        </View>
    );
}
}

gameFormStyle = StyleSheet.create({
    listHeader: {
        backgroundColor: 'white',
        margin:4,
        marginHorizontal:8,
        color:'slategrey',
            fontSize: 16,
            fontWeight: 'bold',
            textAlignVertical: 'center'
    }
})

const mapStateToProps = state => {
    console.log('GameFormTournamentScreen - mapStateToProps');

  let user = state.userReducer.user;
  return {
    user: user
  };
};

export default connect(mapStateToProps)(GameFormTournamentScreen);
