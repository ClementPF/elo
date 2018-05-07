import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StatusBar, StyleSheet, SectionList, TouchableOpacity} from 'react-native';
import {Button, SearchBar, Icon, ListItem} from 'react-native-elements';
import SearchableFlatList from '../components/SearchableFlatList';
import UserStatRow from '../components/UserStatRow';
import EmptyResultsButton from '../components/EmptyResultsButton';
import SearchableSectionList from '../components/SearchableSectionList';

class GameFormWinnerLooserScreen extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
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
          user : {},
          topPlayers : [],
          allPlayers : [],
          winnerName: '',
          refreshing: false,
          tournament: props.navigation.state.params.tournament,
      };
  }

  componentWillMount(){

    console.log("componentWillMount");
  }


  _onPressRow = (rowID, rowData)  => {

   console.log("Selected user :" + rowID.username);

   this.props.navigation.navigate('GameFormConfirmation', { tournament: this.state.tournament , winner: rowID})
 }



render() {
    return (
        <View style={{flex:1}} >
            <Button
              title="WINNER"
              titleStyle={{ fontWeight: "700" }}
              buttonStyle={{
              backgroundColor: "rgba(92, 99,216, 1)",
              width: 300,
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5
              }}
              style={{ marginTop: 20 }}
              onPress={ () => { this.props.navigation.navigate('GameFormQRCode', {
                  tournament: this.state.tournament,
                  winner: this.state.tournament
              });}}
            />
            <Button
              title="LOOSER"
              titleStyle={{ fontWeight: "700" }}
              buttonStyle={{
              backgroundColor: "rgba(92, 99,216, 1)",
              width: 300,
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5
              }}
              style={{ marginTop: 20 }}
            />
        </View>
    );
}
}

export default GameFormWinnerLooserScreen;
