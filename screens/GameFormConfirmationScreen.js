import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Card, ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { OutcomesColumns } from '../components';
import { postGameForTournament } from '../api/tournament';
import DropdownAlert from 'react-native-dropdownalert';
import { invalidateData, dataInvalidated } from '../redux/actions/RefreshAction';
import { NavigationActions, StackActions } from 'react-navigation';
import { connect } from 'react-redux';

class GameFormConfirmationScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    invalidateData: PropTypes.func,
    dataInvalidated: PropTypes.func,
    user: PropTypes.object
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return {
      title: 'Confirmation',
      headerTintColor: 'white'
    };
  };

  constructor(props) {
    super(props);
    const { outcomes, tournament, isTie } = props.navigation.state.params;

    this.state = {
      outcomes,
      tournament,
      isTie,
      loading: false
    };
  }

  componentWillMount() {}

  submitGame = text => {
    //console.log("adding game for " + this.state.winnerName + " " + this.state.tournamentName + " " + this.props.user.username);

    const {
      isTie,
      outcomes,
      tournament: { name: tournamentName }
    } = this.state;

    this.setState({ loading: true });
    postGameForTournament(tournamentName, outcomes, isTie)
      .then(game => {
        const resetAction = StackActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: 'GameFormWinnerLooser' }),
            NavigationActions.navigate({
              routeName: 'GameFormResult',
              params: {
                game
              }
            })
          ]
        });
        this.props.navigation.dispatch(resetAction);

        //this.props.invalidateData().then(() => this.props.dataInvalidated());

        this.props.invalidateData();
        this.props.dataInvalidated();
      })
      .catch(error => {
        this.setState({ loading: false });
        this.onError(error);
      })
      .done();
  };

  onError = error => {
    console.log('GameFormConfirmation - ' + JSON.stringify(error));
    if (error) {
      this.dropdown.alertWithType('error', 'Error', error.message);
    }
  };

  onClose(data) {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
  }
  render() {
    const {
      isTie,
      outcomes,
      loading,
      tournament: { display_name: displayName }
    } = this.state;
    let buttonStr = isTie ? 'We tied' : `Darn it, ${outcomes.length > 2 ? 'We' : 'I'} lost!`;

    return (
      <View>
        <Card style={{ flex: 1 }} title="SUMMARY">
          <Text style={styles.text}>Tournament : {displayName} </Text>
          <View style={{ flex: 1 }}>
            <OutcomesColumns outcomes={outcomes} />
          </View>
        </Card>
        <Button
          loading={loading}
          disabled={loading}
          title={buttonStr}
          onPress={this.submitGame}
          buttonStyle={styles.button}
        />
        <DropdownAlert ref={ref => (this.dropdown = ref)} onClose={data => this.onClose(data)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: 'normal',
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  button: {
    backgroundColor: '#CE2728',
    height: 45,
    borderColor: 'transparent',
    marginTop: 8,
    borderWidth: 0,
    borderRadius: 5
  }
});

const mapStateToProps = ({ userReducer, refreshReducer }) => {
  //console.log('GameFormConfirmationScreen - mapStateToProps userReducer:' + JSON.stringify(userReducer) + ' refreshReducer : ' + JSON.stringify(refreshReducer));
  return {
    user: userReducer.user
  };
};

export default connect(
  mapStateToProps,
  { invalidateData, dataInvalidated }
)(GameFormConfirmationScreen);
