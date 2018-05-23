import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StatusBar, StyleSheet, SectionList, TouchableOpacity} from 'react-native';
import {Button, SearchBar, Icon, ListItem} from 'react-native-elements';
import SearchableFlatList from '../components/SearchableFlatList';
import {getTournaments, getUsersForTournament} from '../api/tournament';
import {getTournamentsForUser} from '../api/user';
import {getUser, getUsers} from '../api/user';
import UserStatRow from '../components/UserStatRow';
import TournamentRow from '../components/TournamentRow';
import SearchableSectionList from '../components/SearchableSectionList';
import QRCode from 'react-native-qrcode-svg';
import { fetchUser, fetchGamesForUser } from '../redux/actions';
import { connect } from 'react-redux';

class GameFormQRCodeScreen extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
  };

    static navigationOptions = ({ navigation }) => {
        const  params = navigation.state.params;
        return {
            title: 'Winner',
            headerTintColor: 'white'
        };
    };

  constructor(props) {
      super(props);
      this.state = {
          winnerName: '',
          tournament: props.navigation.state.params.tournament,
          text: "Check you out, you won!\n Well it's not a win until you get them sweet points. Make sure the looser scan this QR code and submit the game."

      };
  }

  componentWillMount(){

    console.log("GameFormQRCodeScreen - componentWillMount");
  }

    componentWillReceiveProps(nextProps) {

      //console.log("GameFormQRCodeScreen - componentWillReceiveProps " + JSON.stringify(nextProps));

      if (nextProps.error && !this.props.error) {
          this.props.alertWithType('error', 'Error', nextProps.error);
      }

      if(nextProps.games != null && nextProps.games.length > 0){
          this.setState(
              { 'tournament':  this.props.games[0].tournament }
          );
      }
    }

// called when navigating back from tournament selection
returnData(data) {
  this.setState({tournament: data});
}


render() {
    let logoFromFile = require('../assets/images/icon.png');
    let jsonObj = {'winner': this.props.user,
                    'tournament': this.state.tournament};

    console.log("QR Code obj : " + JSON.stringify(jsonObj));
    return (
        <View style={ {flex:1,
            backgroundColor:'white',
            justifyContent: 'center',
            alignItems: 'center'} } >

                <View style={ {
                    width:'100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                marginTop: 8} }>

                    <TournamentRow
                        tournament= { this.state.tournament.display_name }
                        tournament_id_name= { this.state.tournament.name }
                        sport= { this.state.tournament.sport.name }
                        />
                    <Button
                        icon={ {name: 'edit'} }
                        title= {'EDIT'}
                        buttonStyle= { {
                        backgroundColor: 'tomato',
                        borderColor: 'transparent',
                        borderWidth: 0,
                        borderRadius: 10
                        } }
                        onPress={ () => {
                            this.props.navigation.navigate('GameFormTournament',  {returnData: this.returnData.bind(this)});
                            }
                        }
                        />
                </View>
                <View style={ {
                    width:'100%',
                    height:1,
                    backgroundColor: 'black',} }/>


            <View style={ {flex:1,
            backgroundColor:'white',
            margin:8,
            justifyContent: 'center',
            alignItems: 'center'} } >

                <Text style= { { 'margin':16,  'justifyContent' : 'center', 'textAlign' : 'center',
                fontSize: 16,
                fontWeight: 'bold',
                color: 'black',} }> { this.state.text} </Text>

                <QRCode
                value={JSON.stringify(jsonObj)}
                size={200}
                logo = {logoFromFile}/>
            </View>
        </View>
    );
}
}


const mapStateToProps = ({ userReducer }) => {
    //console.log('GameFormQRCodeScreen - mapStateToProps userReducer:' + JSON.stringify(userReducer));
    return {
        user : userReducer.user,
        games: userReducer.games,};
};

export default connect(mapStateToProps, { fetchUser, fetchGamesForUser })(GameFormQRCodeScreen);
