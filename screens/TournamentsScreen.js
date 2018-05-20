import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Icon, Button , ListItem} from 'react-native-elements'
import SearchableSectionList from '../components/SearchableSectionList';
import EmptyResultsButton from '../components/EmptyResultsButton';
import TournamentRow from '../components/TournamentRow';
import SearchBar from '../components/SearchBar';
import { invalidateData } from '../redux/actions/RefreshAction';
import { connect } from 'react-redux';

import { getTournaments } from '../api/tournament';
import { getSports } from '../api/sport';

import { NavigationActions } from 'react-navigation';

class TournamentsScreen extends Component {
static propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func
}

static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            title: 'Explore Tournaments',
            headerTintColor: 'white',
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

  this.fetchData();
    }

    handleChangeTournamentText = (text) => {
      this.props.tournamentName = text;
      this.setState({tournamentName: text})
      console.log(" handleChangeTournamentText " + this.props.tournamentName);
    }

    componentWillReceiveProps(nextProps) {
        console.log("TournamentScreen - componentWillReceiveProps" + JSON.stringify(nextProps));
      if (nextProps.error && !this.props.error) {
        this.props.alertWithType('error', 'Error', nextProps.error);
      }

      if(nextProps.invalidateData == true){
          console.log("TournamentsScreen - componentWillReceiveProps " + nextProps.invalidateData == true ? ' invalidateData true' : ' invalidateData false');
          this.fetchData();
      }
    }

    fetchData(){
        getTournaments().then((response) => {
              this.setState({
                  tournaments: response.data,
                  refreshing: false
              });
            })
            .catch((error) => {
              console.log('failed to get tournaments : ' +  + error);
            }).done();
    }

  _onPressRow = (rowID, rowData)  => {

      console.log(rowID);

      this.props.tournamentName = rowID.name;

      console.log("Tournament selected named : " + rowID.name);
      this.props.navigation.navigate('Tournament', { tournamentName: rowID.name, tournamentDisplayName: rowID.display_name })
   }

   _keyExtractor = (item, index) => item.id;

   _renderItemTournament = ({item, i}) => (
         <TouchableOpacity onPress={this._onPressRow.bind(i, item)}>
              <TournamentRow
                  tournament= { item.display_name }
                  tournament_id_name= { item.name }
                  sport= { item.sport.name }
              />
          </TouchableOpacity>
   );

   _onRefresh() {
     this.fetchData();
 }

   render() {

         var sections = [
             { title: 'ALL TOURNAMENTS', data: this.state.tournaments, renderItem: this._renderItemTournament }
         ];
         sections = sections.filter(section => section.data.length > 0);

      return (
         <View style={{flex:1 } } >
            <SearchBar
                style = { {
                        marginLeft : 16,
                        marginRight: 16 } }
               onChangeText={this.handleChangeTournamentText}
               placeholder={this.state.tournamentName} />

               <SearchableSectionList
                   style = { searchableSectionList.list }
                   data={ [this.state.tournaments] }
                   searchProperty={"display_name"}
                   searchTerm={this.state.tournamentName}
                   keyExtractor={(item, index) => item + index}
                   renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
                   renderSectionHeader={({ section: { title } }) => <Text style={ searchableSectionList.sectionHeaderText }>{title}</Text>}
                   sections={ sections }
                   refreshing={this.state.refreshing}
                   onRefresh={this._onRefresh.bind(this)}
                   ListEmptyComponent={
                   <EmptyResultsButton
                   title="Cant' find what you're looking for? why don't you create a new tournament and start praying on some fishes"
                   onPress={ () => { this.props.navigation.navigate('TournamentCreation');}} />
               }/>
         </View>
       );
     }
}

const mapStateToProps = ({ refreshReducer }) => {
    console.log('TournamenstScreen - mapStateToProps ');
    const { invalidateData } = refreshReducer;
    return { invalidateData };
};

export default connect(mapStateToProps, { invalidateData })(TournamentsScreen);
