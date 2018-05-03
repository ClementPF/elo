import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StatusBar} from 'react-native';
import {Button, Card, ListItem} from 'react-native-elements'
import {postGameForTournament} from '../api/tournament'
import DropdownAlert from 'react-native-dropdownalert';
import { invalidateData } from '../redux/actions/RefreshAction';

class GameFormConfirmationScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object,
        dispatch: PropTypes.func
    };

    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params;
        return {
            title: navigation.state.params.name,
            headerTintColor: 'white'
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            winner: props.navigation.state.params.winner,
            tournament: props.navigation.state.params.tournament
        };
    }

    componentWillMount() {
        console.log("componentWillMount");
    }

    submitGame = (text) => {
        console.log("adding game for " + this.state.winner.username + " " + this.state.tournament.name);

        postGameForTournament(this.state.tournament.name, this.state.winner.username).then((response) => {
            console.log(JSON.stringify(response.data.outcomes[0].score_value));
            this.props.navigation.navigate('GameFormResult', {
                tournament: this.state.tournament,
                winner: this.state.winner,
                game: response.data
            });
            console.log("GameFormConfirmation - invalidating data");
            invalidateData();
        }).catch((error) => {
            this.onError(error);
        }).done();
    };

    onError = error => {
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
        return (
            <View>
                <Card title="SUMMARY">
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'normal',
                        color: 'darkgrey',
                        textAlign: 'center',
                        textAlignVertical: 'center'}}>
                        Tournament : {this.state.tournament.name} </Text>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'normal',
                        color: 'darkgrey',
                        textAlign: 'center',
                        textAlignVertical: 'center'}}
                        > Winner : {this.state.winner.username} </Text>
                </Card>
                <Button title='Darn it, I lost!'
                    onPress={this.submitGame}/>
                <DropdownAlert
                    ref={ref => this.dropdown = ref}
                    onClose={data => this.onClose(data)} />
            </View>
        );
    }
}

export default GameFormConfirmationScreen;
