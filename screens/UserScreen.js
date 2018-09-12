import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    SectionList,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import {Icon, List, ListItem, Button} from 'react-native-elements';
import GameRow from '../components/GameRow';
import StatsCard from '../components/StatsCard';
import UserTile from '../components/UserTile';
import EmptyResultsButton from '../components/EmptyResultsButton';
import Moment from 'moment';
import { getUser } from '../redux/actions';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import { invalidateData } from '../redux/actions/RefreshAction';
import {NavigationActions} from 'react-navigation';

import PureChart from 'react-native-pure-chart';
import { getGamesForUser, getStatsForUser, challengeUser} from '../api/user';
import { getStatsForUserForTournament, getRivalriesForUserForTournament} from '../api/stats';

class UserScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object,
        dispatch: PropTypes.func,
        error: PropTypes.object,
        user: PropTypes.object, // user logged in
        isDataStale: PropTypes.bool
    }

    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params;
        return {title: params == null ? 'Your Profile' : params.user.username,
                headerTintColor: 'white'};
    };

    constructor(props) {
        super(props);
        const params = props.navigation.state.params;
        if(params){
            this.state = { //case of screen in feed or tournaments StackNavigator
                loading: true,
                refreshing: false,
                //stats: Array(params.userStats),
                games: [],
                user: params.user, // user to display
                tournamentFilter: params.tournamentFilter,
                tournamentName: params.tournamentName,
                tournamentDisplayName: params.tournamentDisplayName,
                challenged: false,
                chartData : []
            };
        }else{
            this.state = { //case of screen in Profile StackNavigator
                loading: true,
                refreshing: false,
                user: null,
                chartData : []
            };
        }
    }

    componentWillMount() {
        //console.log('UserScreen - componentWillMount');
        if(this.state.stats != null){
            this.setState({loading: false, refreshing: false});
        }
        else if(this.state.user != null && this.state.tournamentName != null){
            //case of screen in feed or tournaments StackNavigator
            this.fetchData(this.state.user.username, this.state.tournamentName);
        }
    }

    componentWillReceiveProps(nextProps) {
        //console.log('UserScreen - componentWillReceiveProps ' + JSON.stringify(nextProps));
      if (nextProps.error && !this.props.error) {
        this._onError(nextProps.error);
      }
      if(this.props.user != nextProps.user && nextProps.user != null){
          //console.log('UserScreen - componentWillReceiveProps ' + JSON.stringify(nextProps.user));
          this.setState({user: nextProps.user});
          this.fetchData(nextProps.user.username, this.state.tournamentName);
      }
      if(nextProps.isDataStale == true){
          //console.log('UserScreen - componentWillReceiveProps '' + nextProps.invalidateData == true ? ' invalidateData true' : ' invalidateData false');
          this.fetchData(this.state.user.username, this.state.tournamentName);
      }
    }



    fetchData (username, tournamentName){

        Promise.all([
            this.getStats(username,tournamentName)
                .then((response) => {
                    let wins = 0;
                    let games = 0;

                    if(!Array.isArray(response.data)) // convert a single obj into an array
                        response.data = [response.data];

                    response.data.forEach(function(s) {
                         wins = wins + s.win_count;
                         games = games + s.game_count;
                    });
                    this.setState({stats: response.data,
                        gameCount: games,
                        winCount: wins});
                })
                .catch((error) => {
                    this._onError('failed to get stats for user ' + error);
                }),
            getRivalriesForUserForTournament(username,"testtournament")
                .then((response) => {
                    var temp = [];
                    temp.push(response.data.map((elem) => {
                        var rdmColor = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
                        return {
                            value: -elem.score.toFixed(0),
                            label: elem.rival.username,
                            color: rdmColor
                        }
                    }));

                    //temp = temp[0];
                    this.setState({chartData: temp});
                })
                .catch((error) => {
                    this._onError('failed to get rivalry for user ' + error);
                }),
            getGamesForUser(username, tournamentName)
                .then((response) => {
                    var temp = [];
/*
                    temp.push(response.data.map((elem) => {
                        return {
                            x: Moment(elem.date).fromNow(false),
                            y: parseInt(elem.outcomes[elem.outcomes[0].user.username == this.state.user.username ? 0 : 1].score_value.toFixed(0))
                        }
                    }));


                    temp = temp[0];

                    temp = temp.slice(temp.length - 30);*/
                    this.setState({games: response.data });})
                .catch((error) => {
                    this._onError('failed to get games for user ' + error);
                })
            ]).then(() => {
                this.setState({loading: false, refreshing: false});
            }).catch((error) => {
                this.setState({loading: false, refreshing: false});
                this._onError('failed to fetch page for user ' + error);
            });
    }

    // Encapsulate the two endpoints that are queried depending if the screen is used for the userProfile of for the detail of a user in tournmament
    getStats(username,tournamentName){
        if(tournamentName){
             return getStatsForUserForTournament(username,tournamentName);
        }else {
             return getStatsForUser(username);
        }
    }

    _renderChart = ({ item, index}) => (
        <View>
            <PureChart
                data={ item[0] }
                type='pie' />
        </View>);

    _renderItemUser = ({item, index}) => (
        <View>
            <UserTile
                name= { item.username }
                pictureUrl= { item.picture_url == null ? undefined : item.picture_url }
                wins= { this.state.winCount }
                games={ this.state.gameCount }
                active = { this.state.challenged }
                //onPress = { () => {console.log("plop")} }
                onPress = { () => {
                    if(this.state.challenged){
                        return;
                    }
                    challengeUser(this.props.user,item.username,'I demand a trial by combat.').then(() => {
                        this.setState({challenged: true});
                    }).catch((error) => {
                        this.setState({challenged: false});
                        this._onError('Challenge failed, ' + item.username + ' doesn\'t have push notification turned on.');
                    });
                }}
            />
        </View>);


    _renderItemGame = ({item, index}) => (
        <TouchableOpacity
            onPress= { () => this.props.navigation.navigate('Game', { game: item } ) }>
            <GameRow
                name1= { item.outcomes[1].user.username }
                name2= { item.outcomes[0].user.username }
                pictureUrl1= { item.outcomes[1].user.picture_url }
                pictureUrl2= { item.outcomes[0].user.picture_url }
                result1= { item.outcomes[1].win }
                result2= { item.outcomes[0].win }
                tournament={ item.tournament.display_name }
                result= { item.outcomes[1].win }
                value= { item.outcomes[item.outcomes[0].user.username == this.state.user.username ? 0 : 1].score_value }
                date= { item.date }/>
        </TouchableOpacity>
        );

    _renderItemStats = ({item, index}) => (
        <StatsCard
            title= { item.tournament.display_name }
            name1= { 'Score' }
            value1= { item.score.toFixed(0) }
            name2= { 'Best Score' }
            value2= { item.best_score.toFixed(0) }
            name3= { 'Game Count' }
            value3= { item.game_count }
            name4= { 'Current ' + (item.win_streak > 0 ? 'Winning' : (item.lose_streak > 0 ? 'Losing' : (item.tie_streak > 0 ? 'Tie' : ''))) + ' Streak' }
            value4= { Math.max(item.win_streak, item.lose_streak, item.tie_streak) }
            name5= { 'Longest Winning Streak' }
            value5= { item.longuest_win_streak }
            name6= { 'Longest Losing Streak' }
            value6= { item.longuest_lose_streak }
            name7= { 'The Freaking Shark' }
            value7= { item.worst_rivalry == null ? "❌🦈" : (item.worst_rivalry.rival.username + " (" + item.worst_rivalry.score.toFixed(0) + ")")}
            name8= { 'The Smelly Fish' }
            value8= { item.best_rivalry == null ? "❌🎣" : (item.best_rivalry.rival.username + " (" + item.best_rivalry.score.toFixed(0) + ")")}
        />
);

    _onRefresh() {
        this.setState({refreshing: true});
        this.fetchData(this.state.user.username, this.state.tournamentName);
    }

    _onError = error => {
        if (error) {
            this.dropdown.alertWithType('error', 'Error', error);
        }
    };

    _onClose(data) {
        // data = {type, title, message, action}
        // action means how the alert was closed.
        // returns: automatic, programmatic, tap, pan or cancel
    }

    render() {
        if(this.state.loading){
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
            const { navigate } = this.props.navigation;
            const rows = this.state.stats;
            const userAsList = [this.state.user];
            const chartDataAsList = [this.state.chartData];
            let sections = [
              { title: null, data: userAsList, renderItem: this._renderItemUser },
              //{ title: 'CHARTS', data: chartDataAsList, renderItem: this._renderChart },
              { title: 'STATS', data: this.state.stats, renderItem: this._renderItemStats },
              { title: 'GAME HISTORY', data: this.state.games, renderItem: this._renderItemGame }
            ];
            sections = sections.filter(section => section.data!=null && section.data.length > 0);

            return (
                <View
                    style = { {} }>
                    <SectionList
                        style = { searchableSectionList.list }
                        keyExtractor={ (item, index) => item + index }
                        renderItem={ ({ item, index, section }) => <Text key={ index }>{ item }</Text> }
                        renderSectionHeader={ ({ section: { title } }) => title == null ? null : <Text style={ searchableSectionList.sectionHeaderText }>{title}</Text> }
                        sections={ sections }
                        refreshing={ this.state.refreshing }
                        onRefresh={ this._onRefresh.bind(this) }
                        ItemSeparatorComponent={ ({ section }) =>
                            <View style= { { height : section.title == 'RANKING' ? 1 : 8 } } /> }
                        ListEmptyComponent={
                            <EmptyResultsButton
                                title="Havn't played yet, create a tournament or enter a game"
                                onPress={ () => { this.props.navigation.navigate('Tournaments');} } />
                            }/>
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
    },
});

const mapStateToProps = ({ userReducer, refreshReducer }) => {
    return {
        user: userReducer.user,
        isDataStale: refreshReducer.isDataStale };
};

export default connect(mapStateToProps, { })(UserScreen);
