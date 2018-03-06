import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, StatusBar, ScrollView } from 'react-native';
import { Icon, List , ListItem} from 'react-native-elements'


import { getTournaments } from '../api/tournament';
import { getSports } from '../api/sport';

import { NavigationActions } from 'react-navigation';

class TournamentScreen extends Component {
static propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func
}

static navigationOptions = ({ navigation }) => {
    const  params = navigation.state.params;
    return {
        title: 'Tournaments'
    };
};

constructor(props) {
    super(props);
    this.state = {
        sports: [],
        tournaments: [],
    };
}

componentWillMount(){

  console.log("componentWillMount for tournaments ");
/*
  getSports().then((response) => {
    this.setState({
        sports: response.data
    });
  })
  .catch((error) => {
    console.log('failed to get sports : ' +  + error);
}).done();*/

  getTournaments().then((response) => {
    this.setState({
        tournaments: response.data
    });
  })
  .catch((error) => {
    console.log('failed to get tournaments : ' +  + error);
  }).done();
}

componentWillReceiveProps(nextProps) {
  if (nextProps.error && !this.props.error) {
    this.props.alertWithType('error', 'Error', nextProps.error);
  }
}

  render() {

      const { navigate } = this.props.navigation;
  const rows = this.state.tournaments;
    return (
        <View style={{flex: 1}}>
            <StatusBar translucent={false} barStyle="dark-content" />
            <ScrollView>
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
