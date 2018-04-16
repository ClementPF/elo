import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, StatusBar, ScrollView, Button } from 'react-native';
import { Icon, SearchBar, List , ListItem} from 'react-native-elements'


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
            headerRight: <Button title="Add" onPress={ () => params.handleSave() } />
        };
    };

constructor(props) {
    super(props);
    this.state = {
        sports: [],
        tournaments: [],
        tournamentSearch: 'Search for tournament',

    };
}

componentWillMount(){

  console.log("componentWillMount for tournaments ");

  //this.props.navigation.setParams({ handleSave: this._saveDetails });
  getTournaments().then((response) => {
    this.setState({
        tournaments: response.data
    });
  })
  .catch((error) => {
    console.log('failed to get tournaments : ' +  + error);
  }).done();
}
_saveDetails = () => {
        console.log('clicked save');
    }

handleChangeUserText = (text) => {
    this.props.winnerName = text;
    console.log(" handleChangeUserText " + this.props.tournamentSearch);
};


componentWillReceiveProps(nextProps) {
  if (nextProps.error && !this.props.error) {
    this.props.alertWithType('error', 'Error', nextProps.error);
  }
}

saveDetails() {
    alert('Save Details');
}

  render() {

      const { navigate } = this.props.navigation;
  const rows = this.state.tournaments;
    return (
        <View style={{flex: 1}}>
            <StatusBar translucent={false} barStyle="dark-content" />
            <ScrollView>
                <SearchBar lightTheme={true} round
                    onChangeText={this.handleChangeUserText}
                    placeholder={this.state.tournamentSearch} />
                <List style={{flex: 1}}>
                    {
                    rows.map((item, i) => (
                    <ListItem
                    key={i}
                    title={item.display_name}
                    rightTitle={item.sport.name}
                    hideChevron = {true}
                    onPress = { () => navigate('Tournament', { name: item.name })}
                    />
                    ))
                    }
                </List>
            </ScrollView>
        </View>
    );
  }
}

  /*
  render() {

  const rows = [{username:'a',score:10, stats_id: 1}];
  console.log('rendering : ' + rows);
    return (
      <View style={{ flex: 0 }}>
        <StatusBar translucent={false} barStyle="dark-content" />

      <FlatList
          data={this.state.stats}
          renderItem={({ item , index }) => (
            <ListItem
              index={index + 1}
              text={item.username}
              subText={item.score}
              onPress={this.handlePress}
            />
          )}
          keyExtractor={item => item.stats_id}
          ItemSeparatorComponent={Separator}
        />
      </View>
    );
  }
} */

const mapStateToProps = (state) => {
  const tournamentName = state.games.tournamentName;

  return {
  };
};

export default TournamentScreen;
