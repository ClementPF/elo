import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, Button } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements'

import { postTournament } from '../api/tournament';

import { NavigationActions } from 'react-navigation';

class TournamentCreationScreen extends Component {
static propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func
}

static navigationOptions = ({ navigation }) => {
    const  params = navigation.state.params;
    return {
        title: 'Create a Tournament',
        headerTintColor: 'white'
    };
};

constructor(props) {
    super(props);
    this.state = {
        tournamentName: '',
        sportName: '',
    };
}

componentWillMount(){
    console.log("componentWillMount for tournament " + this.state.tournamentName);
}

componentWillReceiveProps(nextProps) {
  if (nextProps.error && !this.props.error) {
    this.props.alertWithType('error', 'Error', nextProps.error);
  }
}

_createTournament = () => {
  console.log("Creating Tournament for " + this.state.tournamentName + " " + this.state.sportName);

  postTournament(this.state.tournamentName, this.state.sportName)
    .then((response) => {
          console.log("Successfully Created Tournament for " + this.state.tournamentName + " " + this.state.sportName);
    })
    .catch((error) => {
      console.log('failed to create tournament ' + error);
    }).done();
};

  render() {

    return (
        <View style={{flex: 1}}>
            <FormLabel> Tournament Title </FormLabel>
            <FormInput onChangeText={(text) => {
                this.setState({tournamentName:text});
            }}/>
            <FormLabel> Sport </FormLabel>
            <FormInput onChangeText={(text) => {
                this.setState({sportName:text});
            }}/>
            <FormLabel> Description </FormLabel>
            <FormInput onChangeText={(text) => {
            }}/>
            <Button title='Create Tournament'
                      onPress={this._createTournament}/>
        </View>
    );
  }
}

export default TournamentCreationScreen;
