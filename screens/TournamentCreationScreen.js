import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements'

import DropdownAlert from 'react-native-dropdownalert';
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

  this.dropdown.alertWithType('info', 'Great !', this.state.tournamentName + ' have been successfully created, good luck !.');

/*
  postTournament(this.state.tournamentName, this.state.sportName)
    .then((response) => {
          console.log("Successfully Created Tournament for " + this.state.tournamentName + " " + this.state.sportName);
    })
    .catch((error) => {
      console.log('failed to create tournament ' + error);
    }).done();*/
};

onClose(data){

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Tournaments'})
  ]
})
this.props.navigation.dispatch(resetAction)
}

  render() {

    return (
        <View style={{flex: 1}} >
            <FormLabel
              labelStyle={{color: 'white'}}> Tournament Title </FormLabel>
            <FormInput onChangeText={(text) => {
                this.setState({tournamentName:text});
            }}/>
            <FormLabel
              labelStyle={{color: 'white'}}> Sport </FormLabel>
            <FormInput onChangeText={(text) => {
                this.setState({sportName:text});
            }}/>
            <FormLabel
              labelStyle={{color: 'white'}}>
              Description </FormLabel>
            <FormInput onChangeText={(text) => {
            }}/>
            <Button
                title='Create Tournament'
                titleStyle={{ color: 'black' }}
                onPress={this._createTournament}
                buttonStyle={{
                    backgroundColor: "tomato",
                    marginTop: 16,
                    height: 45,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 5
                }}/>
             <DropdownAlert
                 ref={ref => this.dropdown = ref}
                 onClose={data => this.onClose(data)}  />
        </View>
    );
  }
}

export default TournamentCreationScreen;
