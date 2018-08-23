import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text } from 'react-native';
import {Button, Card, ListItem} from 'react-native-elements';
import {postGameForTournament} from '../api/tournament';
import DropdownAlert from 'react-native-dropdownalert';
import { invalidateData, dataInvalidated } from '../redux/actions/RefreshAction';

import { connect } from 'react-redux';

import { NavigationActions } from 'react-navigation';

class GameFormConfirmationScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object,
        dispatch: PropTypes.func,
        invalidateData: PropTypes.func,
        dataInvalidated: PropTypes.func,
        user: PropTypes.object
    };

    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params;
        return {
            title: 'Confirmation',
            headerTintColor: 'white'
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            winnerName: props.navigation.state.params.winnerName,
            tournamentName: props.navigation.state.params.tournamentName,
            isTie: props.navigation.state.params.isTie,
            loading: false
        };
    }

    componentWillMount() {
    }

    submitGame = (text) => {
        //console.log("adding game for " + this.state.winnerName + " " + this.state.tournamentName + " " + this.props.user.username);

        this.setState({loading: true});
        postGameForTournament(this.state.tournamentName, this.state.winnerName, this.props.user.username, this.state.isTie).then((response) => {
            //console.log(JSON.stringify(response.data.outcomes[0].score_value));

            const resetAction = NavigationActions.reset({
              index: 1,
              actions: [
                NavigationActions.navigate({ routeName: 'GameFormWinnerLooser' }),
                NavigationActions.navigate({
                  routeName: 'GameFormResult',
                  params : {
                game: response.data} })
              ]
          });
            this.props.navigation.dispatch(resetAction);

            //console.log("GameFormConfirmation - invalidating data");
            //this.props.invalidateData().then(() => this.props.dataInvalidated());

            this.props.invalidateData();
            this.props.dataInvalidated();
        }).catch((error) => {
            this.setState({loading: false});
            this.onError(error);
        }).done();
    };

    onError = error => {
        console.log('GameFormConfirmation - ' + JSON.stringify(error));
        if (error) {
            //this.dropdown.alertWithType('error', 'Error', error.response.data.error_message);
            this.dropdown.alertWithType('error', 'Error', error.message);
        }
    };

    onClose(data) {
        // data = {type, title, message, action}
        // action means how the alert was closed.
        // returns: automatic, programmatic, tap, pan or cancel
    }
    render() {

        let str =  (this.state.isTie ? 'Tied with' : 'Winner') + " " + this.state.winnerName;
        let buttonStr =  (this.state.isTie ? 'We tied' : 'Darn it, I lost!');

        return (
            <View>
                <Card title="SUMMARY">
                    <Text style={ {
                        fontSize: 16,
                        fontWeight: 'normal',
                        color: 'black',
                        textAlign: 'center',
                        textAlignVertical: 'center'} }>
                        Tournament : { this.state.tournament} </Text>
                    <Text style={ {
                        fontSize: 16,
                        fontWeight: 'normal',
                        color: 'black',
                        textAlign: 'center',
                        textAlignVertical: 'center'} }
                        > { str } </Text>
                </Card>
                <Button
                    loading= { this.state.loading }
                    disabled = { this.state.loading }
                    title= { buttonStr }
                    onPress={ this.submitGame }
                    buttonStyle={ {
                        backgroundColor: 'tomato',
                        height: 45,
                        borderColor: 'transparent',
                        marginTop: 8,
                        borderWidth: 0,
                        borderRadius: 5
                        } }
                    />
                <DropdownAlert
                    ref={ ref => this.dropdown = ref }
                    onClose={ data => this.onClose(data) } />
            </View>
        );
    }
}

const mapStateToProps = ({ userReducer, refreshReducer }) => {
        //console.log('GameFormConfirmationScreen - mapStateToProps userReducer:' + JSON.stringify(userReducer) + ' refreshReducer : ' + JSON.stringify(refreshReducer));
        return {
            user : userReducer.user};
};

export default connect(mapStateToProps, { invalidateData, dataInvalidated })(GameFormConfirmationScreen);
