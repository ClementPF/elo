import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, StatusBar, ScrollView, Text } from 'react-native';
import { Icon, SearchBar, Button , ListItem} from 'react-native-elements'
import SearchableFlatList from '../components/SearchableFlatList';


import { getTournaments } from '../api/tournament';
import { getSports } from '../api/sport';

import { NavigationActions } from 'react-navigation';

class TournamentScreen extends Component {
static propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func
}

static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Explore Tournaments',
            headerRight: <Button icon
                icon={{name: 'add'}}
                buttonStyle= { {
                    backgroundColor: "transparent",
                } }
                 title="Add" onPress={ () => { navigation.navigate('TournamentCreation');}} />
        };
    };

constructor(props) {
    super(props);
    this.state = {
        sports: [],
        tournaments: [],
        tournamentName: '',
    };
}

componentWillMount(){

  console.log("componentWillMount for tournaments ");
  getTournaments().then((response) => {
        this.setState({
            tournaments: response.data
        });
      })
      .catch((error) => {
        console.log('failed to get tournaments : ' +  + error);
      }).done();
    }

    handleChangeTournamentText = (text) => {
      this.props.tournamentName = text;
      this.setState({tournamentName: text})
      console.log(" handleChangeTournamentText " + this.props.tournamentName);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.error && !this.props.error) {
        this.props.alertWithType('error', 'Error', nextProps.error);
      }
    }

    saveDetails() {
        alert('Save Details');
    }


  _onPressRow = (rowID, rowData)  => {

      console.log(rowID);

      this.props.tournamentName = rowID.name;

      console.log("Tournament selected named : " + rowID.name);
      this.props.navigation.navigate('Tournament', { name: rowID.name })
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
                All Tournaments </Text>
            <ScrollView contentContainerStyle={{flex:1}} >
               <SearchableFlatList style={{flex:1}}
                  searchProperty={"name"}
                  searchTerm={this.state.tournamentName}
                  data={ this.state.tournaments }
                  keyExtractor={ this._keyExtractor }
                  renderItem={ this._renderItemTournament }
                  ListEmptyComponent={
                      <Button title="Looks pretty empty in here, why don't you create a tournament and start praying on some fish"
                          onPress={ () => { this.props.navigation.navigate('TournamentCreation');}} />}/>
            </ScrollView>
         </View>
       );
     }
}

const mapStateToProps = (state) => {
  const tournamentName = state.games.tournamentName;

  return {
  };
};

export default TournamentScreen;
