import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StatusBar, StyleSheet, SectionList, TouchableOpacity} from 'react-native';
import {Button, SearchBar, Icon, ListItem} from 'react-native-elements';
import SearchableFlatList from '../components/SearchableFlatList';
import UserStatRow from '../components/UserStatRow';
import TournamentRow from '../components/TournamentRow';
import SearchableSectionList from '../components/SearchableSectionList';

import { fetchUser, fetchGamesForUser } from '../redux/actions';
import { invalidateData } from '../redux/actions/RefreshAction';
import { connect } from 'react-redux';

class GameFormWinnerLooserScreen extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
  };

    static navigationOptions = ({ navigation }) => {
        const  params = navigation.state.params;
        return {
            title: '',
        };
    };

  constructor(props) {
      super(props);
      this.state = {
          text: "The game is over and it was a good game ? Doesn't matter, now it's time to find out how many points it was worth. \n Did you win or loose ?"
      };
  }

  componentWillMount(){
  }


  _onPressRow = (rowID, rowData)  => {

   console.log("Selected user :" + rowID.username);

   this.props.navigation.navigate('GameFormConfirmation', { tournament: this.state.tournament , winner: rowID})
 }



render() {
    return (
        <View style={{flex:1,
            justifyContent: 'center', alignItems: 'center', }} >

            <Text style= { { 'padding':16,  'justifyContent' : 'center', 'textAlign' : 'center',
                fontSize: 16,
                fontWeight: 'bold',
                color: 'white',} }> {this.state.text} </Text>

            <Button
              title="WIN"
              titleStyle={{ fontWeight: "700" }}
              buttonStyle={{
              backgroundColor: "tomato",
              width: 300,
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5
              }}
              style={{ marginTop: 20 }}
              onPress={ () => {
                if (this.props.tournament != null) {
                    this.props.navigation.navigate('GameFormQRCode', {
                        tournament: this.props.tournament,
                        winner: this.props.user,
                        isWinner: true});
                }else {
                    this.props.navigation.navigate('GameFormTournament', {
                        winner: this.props.user,
                        isWinner: true});
                    }
                }
            }
            />
            <Button
              title="LOOSE"
              titleStyle={{ fontWeight: "700" }}
              buttonStyle={{
              backgroundColor: "tomato",
              width: 300,
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5
              }}
              style={{ marginTop: 20 }}
              onPress={ () => { this.props.navigation.navigate('GameFormTournament', {
                  tournament: this.state.tournament,
                  winner: this.props.user,
                  isWinner: false
              });}}
            />
        </View>
    );
}
}


const mapStateToProps = ({ userReducer }) => {
    console.log('GameFormQRCodeScreen - mapStateToProps userReducer:' + JSON.stringify(userReducer));
    return {
        user : userReducer.user,
        tournament: ( userReducer.games != null && userReducer.games.length > 0 ) ? userReducer.games[0].tournament : null};
};

export default connect(mapStateToProps, { fetchUser, fetchGamesForUser })(GameFormWinnerLooserScreen);
