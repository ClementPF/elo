import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import {getRivalryForUserForRivalForTournament} from '../api/stats';
import GameRow from '../components/GameRow';
import RivalryCard from '../components/RivalryCard';

class GameScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object,
        dispatch: PropTypes.func,
        error: PropTypes.object,
    }

    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params;
        return {title: 'Game',
                headerTintColor: 'white'};
    };

    constructor(props) {
        super(props);
        const params = props.navigation.state.params;
        this.state = {
            loading: true,
            refreshing: false,
            game: params.game,
            rivalry: null,
            error: null,
        };
    }

    componentWillMount() {
        this.fetchData();
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.error && !this.props.error) {
        this._onError('error', 'Error', nextProps.error);
      }
    }

    fetchData (){
        Promise.all([
                getRivalryForUserForRivalForTournament(
                    this.state.game.outcomes[0].user_name,
                    this.state.game.outcomes[1].user_name,
                    this.state.game.tournament.name).then((response) => {
                        this.setState({rivalry: response.data});
                }).catch((error) => {
                    this._onError('failed to get tournaments : ' + error);
                })
            ]).then(() => {
                this.setState( {loading: false, refreshing: false} );
            });
    }

    _renderItem = ({item, index}) => {

    }

    _onRefresh() {
        this.setState({refreshing: true});
        this.fetchData();
    }

    _onError = error => {
        if (error) {
            this.setState({error: error})
            this.dropdown.alertWithType('error', 'Error', error);
        }
    };

    _onClose(data) {
        // data = {type, title, message, action}
        // action means how the alert was closed.
        // returns: automatic, programmatic, tap, pan or cancel
    }

    render() {
        if(this.state.loading || this.state.error){
            return (
                <View style={ { flex: 1,
                    justifyContent: 'center'} }>
                    <ActivityIndicator  size="small" color="white"/>
                    <DropdownAlert
                        ref={ ref => this.dropdown = ref }
                        onClose={ data => this._onClose(data) } />
                </View>
            );
        }else{
            let game = this.state.game;
            let rivalry = this.state.rivalry;

            console.log('rivalry : ' + JSON.stringify(rivalry));
            console.log('game : ' + JSON.stringify(game));
            return (
                <View
                    style = { UserScreenStyle.container }>
                    <GameRow
                        name1= { game.outcomes[0].user_name }
                        name2= { game.outcomes[1].user_name }
                        tournament= { game.tournament.name }
                        result= { game.outcomes[0].win }
                        value= { game.outcomes[0].score_value }
                        date= { game.date }
                    />

                    <View style = { { height: 4,
                    backgroundColor: 'transparent'}
                }/>

                    <RivalryCard
                        title= { 'RIVALRY' }
                        username1= { rivalry.user.username }
                        username2= { rivalry.rival.username }
                        name1= { 'Total Points' }
                        value1name1= { rivalry.score.toFixed(0) }
                        value2name1= { - rivalry.score.toFixed(0) }
                        name2= { 'Game Count' }
                        value1name2= { rivalry.game_count }
                        value2name2= { rivalry.game_count }
                        name3= { 'Win Count' }
                        value1name3= { rivalry.win_count }
                        value2name3= { rivalry.lose_count }
                        name4= { 'Current ' + (rivalry.win_streak > 0 ? 'Winning' : (rivalry.lose_streak > 0 ? 'Losing' : (rivalry.tie_streak > 0 ? 'Tie' : ''))) + ' Streak' }
                        value1name4= { Math.max(rivalry.win_streak, rivalry.lose_streak, rivalry.tie_streak) }
                        value2name4= { Math.min(rivalry.win_streak, rivalry.lose_streak, rivalry.tie_streak) }
                        name5= { 'Longest Win Streak' }
                        value1name5= { rivalry.longuest_win_streak }
                        value2name5= { rivalry.longuest_lose_streak }
                    />

                    <DropdownAlert
                        ref={ ref => this.dropdown = ref }
                        onClose={ data => this._onClose(data) } />
                </View>
            );
        }
    }
}

UserScreenStyle = StyleSheet.create({
    container: {
        margin : 8
    },
});

export default GameScreen;
