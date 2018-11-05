import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    SectionList,
    TouchableOpacity,
    RefreshControl,
    StyleSheet,
    ActivityIndicator,
    ItemSeparator
} from 'react-native';
import GameRow from '../components/GameRow';
import UserStatRow from '../components/UserStatRow';
import RivalryCard from '../components/RivalryCard';
import EmptyResultsButton from '../components/EmptyResultsButton';
import EmptyResultsScreen from '../components/EmptyResultsScreen';
import { fetchUser, fetchGamesForUser } from '../redux/actions';
import { invalidateData } from '../redux/actions/RefreshAction';
import {getRivalryForUserForRivalForTournament} from '../api/stats';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import {Notifications} from 'expo';
import {NavigationActions} from 'react-navigation';

import { getStatsForUser } from '../api/user';

class FeedScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object,
        dispatch: PropTypes.func,
        error: PropTypes.object,
        isDataStale: PropTypes.bool,
        games: PropTypes.array,
        user: PropTypes.object,
        fetchGamesForUser: PropTypes.func,
        fetchUser: PropTypes.func,
    }

    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params;
        return {title: 'Feed'};
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing: false,
            stats: [],
            games: [],
        };
    }

    componentWillMount() {
        //console.log('FeedScreen - componentWillMount');
        this.props.fetchUser();
    }

    componentDidMount() {
        this._notificationSubscription = this._registerForPushNotifications();
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.error && !this.props.error) {
            this._onError(nextProps.error);
        }

        if(this.props.user != nextProps.user && nextProps.user != null){
            //console.log('FeedScreen - componentWillReceiveProps ' + JSON.stringify(nextProps.user));
            this.fetchData(nextProps.user.username);
        }
        if(this.props.games != nextProps.games && nextProps.games != null){
            //console.log('FeedScreen - componentWillReceiveProps ' + nextProps.games.length);
            this.setState({games: nextProps.games});
        }
        if(nextProps.isDataStale == true){
            //console.log('FeedScreen - componentWillReceiveProps ' + JSON.stringify(nextProps.isDataStale));
            this.fetchData(this.props.user.username);
        }
    }

    componentWillUnmount() {
        this._notificationSubscription && this._notificationSubscription.remove();
    }

    _registerForPushNotifications() {
        // Watch for incoming notifications
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
    }

    _handleNotification = ({ origin, data }) => {
        console.log(`Push notification ${origin} with data: ${JSON.stringify(data)}`);
    };

    fetchData(username){
        //console.log('fetching data for  ' + JSON.stringify(username));
        this.setState({loading: true});
        Promise.all([
            getStatsForUser(username).then((response) => {
                this.setState({stats: response.data});
            }).catch((error) => {
                this._onError('failed to get stats for user ' + error);
            }),
            this.props.fetchGamesForUser(username)
        ]).then(() => {
                this.setState({loading: false, refreshing: false});
        });
    }

    _renderItem = ({item, index}) => {

    }

    _renderRivarlry = (rivalry,index) => {

        return <RivalryCard
            title= { 'RIVALRY' }
            username1= { rivalry.user.username }
            username2= { rivalry.rival.username }
            pictureUrl1= { rivalry.user.picture_url }
            pictureUrl2= { rivalry.rival.picture_url }
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
        />;
    }

    _insertRivalryAtIndex = (index) => {

        getRivalryForUserForRivalForTournament(
            this.state.games[index].outcomes[0].user.username,
            this.state.games[index].outcomes[1].user.username,
            this.state.games[index].tournament.name).then((response) => {
                let games = this.state.games;
                games.splice(index + 1, 0, response.data);
                this.setState({games:games});
        }).catch((error) => {
            this._onError('failed to get tournaments : ' + error);
        });

        this.sectionList.scrollToLocation({'animated':true, 'itemIndex':index, 'sectionIndex': 1, 'viewOffset':48, 'viewPosition':0});
    }

    _renderItemGame = ({item, index}) => (
        <TouchableOpacity
            onPress= { () => this.sectionList.scrollToLocation({'animated':true, 'itemIndex':index, 'sectionIndex': 1, 'viewOffset':48, 'viewPosition':0}) }>
            <GameRow
                name1= { this.props.user.username }
                name2= { item.outcomes[0].user.username == this.props.user.username ? item.outcomes[1].user.username : item.outcomes[0].user.username }
                pictureUrl1= { this.props.user.picture_url }
                pictureUrl2= { item.outcomes[0].user.username == this.props.user.username ? item.outcomes[1].user.picture_url : item.outcomes[0].user.picture_url }
                result1= { item.outcomes[item.outcomes[0].user.username == this.props.user.username ? 0 : 1].win }
                result2= { item.outcomes[item.outcomes[0].user.username == this.props.user.username ? 1 : 0].win }
                tournamentDisplayName={ item.tournament.display_name }
                tournamentName={ item.tournament.name }
                value= { item.outcomes[item.outcomes[0].user.username == this.props.user.username ? 0 : 1].score_value }
                date= { item.date }
            />
        </TouchableOpacity>
    );

    _renderGameSection = ({item, index}) => {
        if(false)
            return this._renderItemGame({item,index});
        else {
            if(typeof item.game_id !== 'undefined'){
                return this._renderItemGame({item,index});
            }else if (item.rivalry_stats_id !== 'undefined'){
                return this._renderRivarlry(item,index);
            }
        }
    }
/*
    _renderGameSection = ({item, index}) => {
        if(typeof item.game_id !== 'undefined'){
            return this._renderItemGame(item,index);
        }else if (item.rivalry_stats_id !== 'undefined'){
            return this._renderRivarlry(item);
        }
    }
*/
    _renderItemTournament = ({item, index}) => (
        <TouchableOpacity
            onPress= { () => this.props.navigation.navigate('Tournament', { userStats: item,tournamentName: item.tournament.name, tournamentDisplayName: item.tournament.display_name}) }>
            <UserStatRow
                tournament={ item.tournament.display_name }
                position={ 1 }
                score={ item.score }
            />
        </TouchableOpacity>
);

    _onRefresh() {
        //console.log('refreshing ')
        this.setState({refreshing: true});
        this.fetchData(this.props.user.username);
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
        const { navigate } = this.props.navigation;

        let section0 = { title: 'YOUR TOURNAMENTS', data: this.state.stats, renderItem: this._renderItemTournament };
        let section1 = { title: 'YOUR HISTORY', data: this.state.games, renderItem: this._renderGameSection };
        let sections = [ section0, section1 ];
        sections = sections.filter(section => section.data.length > 0 );

        let rendered = null;
        if(this.state.loading){
            rendered = (
                    <ActivityIndicator  size="small" color="white"/>
            );
        }else if(this.state.games.length == 0){
            rendered = (
                    <EmptyResultsScreen
                        title= { 'Hey, welcome to the SHARKULATOR,\n Your feed is empty so far, \n go play a game, treat yourself,\n you deserve it Champ.' }
                        onPress={ () => { this.props.navigation.navigate('Tournaments');} }/>
                    )
        }else{
            rendered = (
                    <SectionList
                        ref={ ref => this.sectionList = ref }
                        style = { feedScreenStyle.list }
                        keyExtractor={ (item, index) => item + index }
                        renderItem={ ({ item, index, section }) => <Text key={ index }>{ item }</Text> }
                        renderSectionHeader={ ({ section: { title } }) => <Text style={ feedScreenStyle.sectionHeaderText }>{title}</Text> }
                        sections={ sections }
                        refreshing={ this.state.refreshing }
                        onRefresh={ this._onRefresh.bind(this) }
                        ItemSeparatorComponent={ ({ section }) =>
                            <View style= { { height : section.title == 'RANKING' ? 1 : 8 } } /> }
                        ListEmptyComponent={
                            <EmptyResultsButton
                                title= { 'Hey, welcome to the SHARKULATOR,\n Your feed is empty so far, \n go play a game, treat yourself,\n you deserve it Champ.' }
                                onPress={ () => { this.props.navigation.navigate('Tournaments');} }/>
                            }/>
            );
        }

        return (
            <View
                style = { feedScreenStyle.container } >
                {rendered}
                <DropdownAlert
                    ref={ ref => this.dropdown = ref }
                    onClose={ data => this._onClose(data) } />
            </View>);
    }
}

feedScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center'
    },
    list: {
        marginRight: 8,
        marginLeft: 8
    },
    sectionHeaderText: {
        padding: 8,
        height: 48,
        fontSize: 28,
        fontWeight: 'normal',
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'black'
    }
});

const mapStateToProps = ({ userReducer, refreshReducer }) => {
    //console.log('FeedScreen - mapStateToProps userReducer:' + JSON.stringify(userReducer.user != null ? userReducer.user : 'userReducer') + ' refreshReducer : ' + JSON.stringify(refreshReducer));

    // if(this.props != null){ // avoid NPE on first run
    // console.log('FeedScreen - mapStateToProps userReducer:' +
    //     (userReducer.games != null ? (userReducer.games.length + ' games' : 'no games') : 'No games received : ') +
    //     + (this.props.games != null ? ' there was ' + this.props.games.length : 'no') + ' in props '
    //     + (this.state.games != null ? ' there was ' + this.state.games.length : 'no') + ' in state ' );
    // }
    return {
        user : userReducer.user,
        games: userReducer.games,
        isDataStale: refreshReducer.isDataStale};
};

export default connect(mapStateToProps, { fetchUser, fetchGamesForUser, invalidateData })(FeedScreen);
