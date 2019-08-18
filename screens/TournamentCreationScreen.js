import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import DropdownAlert from 'react-native-dropdownalert';
import { postTournament } from '../api/tournament';
import { invalidateData, dataInvalidated } from '../redux/actions/RefreshAction';
import { connect } from 'react-redux';
import { NavigationActions, StackActions } from 'react-navigation';

class TournamentCreationScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    error: PropTypes.object,
    dispatch: PropTypes.func,
    invalidateData: PropTypes.func,
    dataInvalidated: PropTypes.func
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return {
      title: 'Create a Tournament',
      headerTintColor: 'white'
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      tournamentName: '',
      sportName: ''
    };
  }

  componentWillMount() {
    //console.log("componentWillMount for tournament " + this.state.tournamentName);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && !this.props.error) {
      this.onError(nextProps.error);
    }
  }

  _createTournament = () => {
    postTournament(this.state.tournamentName, this.state.sportName)
      .then(response => {
        //console.log('Successfully Created Tournament for ' + this.state.tournamentName + ' ' + this.state.sportName);
        this.dropdown.alertWithType(
          'info',
          'Great !',
          this.state.tournamentName + ' have been successfully created, good luck !.'
        );
        this.props.invalidateData();
        this.props.dataInvalidated();
      })
      .catch(error => {
        this.onError('failed to create tournament ' + error);
      })
      .done();
  };

  onClose(data) {
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'Tournaments' })]
    });
    this.props.navigation.dispatch(resetAction);
  }

  onError = error => {
    if (error) {
      this.dropdown.alertWithType('error', 'Error', error);
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FormLabel labelStyle={{ color: 'white' }}> Tournament Title </FormLabel>
        <FormInput
          onChangeText={text => {
            this.setState({ tournamentName: text });
          }}
        />
        <FormLabel labelStyle={{ color: 'white' }}> Sport </FormLabel>
        <FormInput
          onChangeText={text => {
            this.setState({ sportName: text });
          }}
        />
        <FormLabel labelStyle={{ color: 'white' }}>Description </FormLabel>
        <FormInput onChangeText={text => {}} />
        <Button
          title="Create Tournament"
          titleStyle={{ color: 'black' }}
          onPress={this._createTournament}
          buttonStyle={{
            backgroundColor: '#CE2728',
            marginTop: 16,
            height: 45,
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 5
          }}
        />
        <DropdownAlert ref={ref => (this.dropdown = ref)} onClose={data => this.onClose(data)} />
      </View>
    );
  }
}

const mapStateToProps = ({ refreshReducer }) => {
  //console.log('TournamentCreationScreen - mapStateToProps ');
  return {};
};

export default connect(
  mapStateToProps,
  { invalidateData, dataInvalidated }
)(TournamentCreationScreen);
