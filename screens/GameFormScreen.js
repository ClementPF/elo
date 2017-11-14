import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ScrollView, View, Text, KeyboardAvoidingView, FlatList, StatusBar, AsyncStorage} from 'react-native';
import {Button, SearchBar, Icon, List, ListItem} from 'react-native-elements'
import {postGameForTournament, getUsersForTournament} from '../api/tournament'

class GameFormScreen extends Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    winnerName: PropTypes.string,
    tournamentName: PropTypes.string,
    //gameValue: PropTypes.string
  };

  static navigationOptions = ({ navigation }) => {
      const  params = navigation.state.params;
      return {
          title: 'Game',
          headerTitleStyle :{color:'#FFFFFF'},
          headerStyle: {backgroundColor:'#3c3c3c'},
          headerRight: <Icon style={{ marginLeft:15,color:'#fff' }} name={'close'} size={25} onPress={() => params.handlePress()} />
      };
  };

  constructor(props) {
      super(props);
      this.state = {
          users : [],
          gameValue : '0',
          winnerName : 'Who\'s the lucky one',
      };
  }

  componentWillMount(){

    console.log("componentWillMount");
    getUsersForTournament('tournament1').then((response) => {
      this.setState({
          users: response.data
      });
    })
    .catch((error) => {
      console.log('failed to get stats for tournament ' + error);
    }).done();
  }

  handleChangeUserText = (text) => {
            this.props.winnerName = text;
                      console.log(" handleChangeUserText " + this.props.winnerName);
  };

  handleChangeTournamentText = (text) => {
  };

  submitGame = (text) => {

      console.log("adding game for " + this.props.tournamentName + " " + this.props.winnerName);

    postGameForTournament(this.props.tournamentName, this.props.winnerName)
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

      console.log(rowID);
      this.setState({
          winnerName: rowID.username
      });
   console.log(this.state.winnerName);
 }

onPlayerSelected (item) {
    winnerName = item.username;
        console.log('click ' + winnerName + item.username);
}

  render() {
            const rows = this.state.users;
    return (

      <View>
        <StatusBar backgroundColor="blue" barStyle="dark-content"/>


          <SearchBar lightTheme={true} round
              onChangeText={this.handleChangeUserText}
              placeholder={this.state.winnerName} />

              <ScrollView>
                  <List>
                    {
                      rows.map((item, i) => (
                        <ListItem
                          key={i}
                          title={item.first_name + " " + item.last_name}
                          subtitle = {item.username}
                          hideChevron = {true}
                          onPress={this._onPressRow.bind(i, item)}
                        />
                      ))
                    }
                  </List>
</ScrollView>


        <Text> Match value : {this.state.gameValue} </Text>
          <Button title='Darn it, I lost!'
              onPress={this.submitGame}/>

      </View>
    );
  }
}

export default GameFormScreen;
