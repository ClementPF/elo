import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ScrollView, View, Text, StyleSheet, FlatList, StatusBar, ActivityIndicator} from 'react-native';
import {Button, SearchBar, Icon, List, ListItem} from 'react-native-elements'
import SearchableFlatList from '../components/SearchableFlatList';
import {postGameForTournament, getUsersForTournament} from '../api/tournament'

class GameFormUserScreen extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    //gameValue: PropTypes.string
  };

  static navigationOptions = ({ navigation }) => {
      const  params = navigation.state.params;
      return {
          title: navigation.state.params.tournament.name,
      };
  };

  constructor(props) {
      super(props);
      this.state = {
          isLoading: true,
          users : [],
          gameValue : '0',
          winnerName : '',
          tournament: props.navigation.state.params.tournament,
      };
  }

  componentWillMount(){

    console.log("componentWillMount " + this.state.tournament.name);
    getUsersForTournament(this.state.tournament.name).then((response) => {
      this.setState({
          users: response.data,
          isLoading: false,
      });
    })
    .catch((error) => {
        isLoading: false,
        console.log('failed to get stats for tournament ' + error);
    }).done();
  }

  handleChangeUserText = (text) => {
      this.props.winnerName = text;
      this.setState({winnerName: text})
      console.log(" handleChangeUserText " + this.props.winnerName);
  };

  submitGame = (text) => {
      console.log("adding game for " + this.state.winnerName + " " + this.state.tournament.name);

      postGameForTournament(this.state.tournament.name, this.state.winnerName)
        .then((response) => {
            console.log(JSON.stringify(response.data.outcomes[0].score_value));
            this.setState({
                gameValue: response.data.outcomes[0].score_value
            });
            this.props.gameValue = response.data.outcomes[0].score_value;
        })
        .catch((error) => {
          console.log('failed to get stats for tournament ' + error);
        }).done();
  };

//rowID actually has the object
  _onPressRow = (rowID, rowData)  => {

   console.log("Selected user :" + rowID.username);

   this.props.navigation.navigate('GameFormConfirmation', { tournament: this.state.tournament , winner: rowID})
 }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({item, i}) => (
          <ListItem
           key={i}
           title={item.first_name + ' ' + item.last_name}
           subtitle = {item.username}
           hideChevron = {true}
           onPress={this._onPressRow.bind(i, item)}
          />
    );

    render() {
        if (this.state.isLoading) {
          return (
            <View style={{flex: 1, paddingTop: 20}}>
              <ActivityIndicator />
            </View>
          );
        }

       return (
          <View style={{flex:1}} >
             <SearchBar
                lightTheme={true} round
                onChangeText={this.handleChangeUserText}
                placeholder={this.state.winnerName} />

             <Text style= { gameFormStyle.listHeader }>
                 Top Players </Text>
             <ScrollView contentContainerStyle={{flex:1}} >
                <SearchableFlatList style={{flex:1}}
                   searchProperty={"username"}
                   searchTerm={this.state.winnerName}
                   data={ this.state.users }
                   keyExtractor={ this._keyExtractor }
                   renderItem={ this._renderItem }/>
             </ScrollView>
          </View>
        );
      }
 }

export default GameFormUserScreen;
