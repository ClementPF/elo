import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ScrollView, View, Text, StatusBar, StyleSheet} from 'react-native';
import {Button, SearchBar, Icon, List, ListItem} from 'react-native-elements';
import SearchableFlatList from '../components/SearchableFlatList';
import {getTournaments} from '../api/tournament';

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
          tournaments : [],
          tournamentName: '',
      };
  }

  componentWillMount(){

    console.log("componentWillMount");
    getTournaments().then((response) => {
      this.setState({
          tournaments: response.data
      });
    })
    .catch((error) => {
      console.log('failed to get all tournaments ' + error);
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
      this.props.navigation.navigate('GameFormUser', { tournament: rowID })
   }

   _keyExtractor = (item, index) => item.id;

   _renderItemTournament = ({item, i}) => (
         <ListItem
          key={i}
          title={item.display_name}
          subtitle = {item.name}
          hideChevron = {true}
          onPress={this._onPressRow.bind(i, item)}
         />
   );

   render() {
      return (
         <View style={{flex:1}} >
            <SearchBar
               lightTheme={true} round
               onChangeText={this.handleChangeTournamentText}
               placeholder={this.state.tournamentName} />

            <Text style={gameFormStyle.listHeader }>
                Top Tournaments </Text>
            <ScrollView contentContainerStyle={{flex:1}} >
               <SearchableFlatList style={{flex:1}}
                  searchProperty={"name"}
                  searchTerm={this.state.tournamentName}
                  data={ this.state.tournaments }
                  keyExtractor={ this._keyExtractor }
                  renderItem={ this._renderItemTournament }
                  ListEmptyComponent={
                      <Button raised
                          icon={{name: 'add'}}
                          title="Can't find what you're looking for ? Just create your tournament."
                          onPress={ () => { this.props.navigation.navigate('TournamentCreation');}}
                          buttonStyle={{
                            backgroundColor: "tomato",
                            borderColor: "transparent",
                            borderWidth: 0,
                            borderRadius: 10
                          }}/>
                      }
                      />
            </ScrollView>
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
