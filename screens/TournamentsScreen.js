import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Icon, SearchBar, Button , ListItem} from 'react-native-elements'
import SearchableSectionList from '../components/SearchableSectionList';
import EmptyResultsButton from '../components/EmptyResultsButton';
import TournamentRow from '../components/TournamentRow';


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
        refreshing: false,
        sports: [],
        tournaments: [],
        tournamentName: '',
    };
}

componentWillMount(){

  console.log("TournamentScreen - componentWillMount");
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
         <TouchableOpacity onPress={this._onPressRow.bind(i, item)}>
              <TournamentRow
                  tournament= { item.display_name }
                  sport= { item.sport.name }
              />
          </TouchableOpacity>
   );

   _onRefresh() {
     console.log('refreshing ')
     getTournaments().then((response) => {
           this.setState({
               tournaments: response.data
           });
           this.setState({refreshing: false});
         })
         .catch((error) => {
           console.log('failed to get tournaments : ' +  + error);
         }).done();
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
                   data={ [this.state.tournaments] }
                      searchProperty={"display_name"}
                      searchTerm={this.state.tournamentName}
                   keyExtractor={(item, index) => item + index}
                   renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
                   renderSectionHeader={({ section: { title } }) => <Text style={ feedScreenStyle.sectionHeaderText }>{title}</Text>}
                   sections={[
                   { title: 'ALL TOURNAMENTS', data: this.state.tournaments, renderItem: this._renderItemTournament },
                   ]}
                   refreshing={this.state.refreshing}
                   onRefresh={this._onRefresh.bind(this)}
                   ListEmptyComponent={
                   <EmptyResultsButton
                   title="Looks pretty empty in here, why don't you create a tournament and start praying on some fish"
                   onPress={ () => { this.props.navigation.navigate('TournamentCreation');}} />
               }/>
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
