import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    SectionList,
    StatusBar,
    TouchableOpacity,
    RefreshControl,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import GameRow from '../components/GameRow';
import UserStatRow from '../components/UserStatRow';
import EmptyResultsButton from '../components/EmptyResultsButton';
import { fetchUser, fetchGamesForUser } from '../redux/actions';
import { invalidateData } from '../redux/actions/RefreshAction';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';

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

    fetchData(username){
        //console.log('fetching data for  ' + JSON.stringify(username));
        this.setState({loading: true});
        Promise.all([
            getStatsForUser(username).then((response) => {
                this.setState({stats: response.data});
                this.setState({refreshing: false});
                this.setState({loading: false});
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

    _renderItemGame = ({item, index}) => (
        <GameRow
            name1= { item.outcomes[item.outcomes[0].result == 'WIN' ? 0 : 1].user_name }
            name2= { item.outcomes[item.outcomes[0].result != 'WIN' ? 0 : 1].user_name }
            tournament={ item.tournament.display_name }
            result= { item.outcomes[item.outcomes[0].user_name == this.props.user.username ? 0 : 1].score_value < 0 }
            value= { item.outcomes[item.outcomes[0].user_name == this.props.user.username ? 0 : 1].score_value }
            date= { item.date }/>);

    _renderItemTournament = ({item, index}) => (
        <TouchableOpacity
            onPress= { () => this.props.navigation.navigate('Tournament', { userStats: item,tournamentName: item.tournament_name, tournamentDisplayName: item.tournament_display_name}) }>
        <UserStatRow
            tournament={ item.tournament_display_name }
            position={ 1 }
            score={ item.score }/>
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
        const rows = this.state.stats;

        if(this.state.loading){
            return (
                <View style={ { flex: 1,
                    justifyContent: 'center'} }>
                    <ActivityIndicator  size="small" color="white"/>
                </View>
            );
        }

        let sections = [
          { title: 'YOUR TOURNAMENTS', data: this.state.stats, renderItem: this._renderItemTournament },
          { title: 'YOUR HISTORY', data: this.state.games, renderItem: this._renderItemGame }
        ];
        sections = sections.filter(section => section.data.length > 0 );

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
                    return (
                        <View
                            style = { feedScreenStyle.container }>
                            <StatusBar translucent={ false } barStyle="light-content" />
                            <SectionList
                                style = { feedScreenStyle.list }
                                keyExtractor={ (item, index) => item + index }
                                renderItem={ ({ item, index, section }) => <Text key={ index }>{ item }</Text> }
                                renderSectionHeader={ ({ section: { title } }) => <Text style={ searchableSectionList.sectionHeaderText }>{title}</Text> }
                                sections={ sections }
                                refreshing={ this.state.refreshing }
                                onRefresh={ this._onRefresh.bind(this) }
                                ListEmptyComponent={
                                    <EmptyResultsButton
                                        title= { 'Hey, welcome to the SHARKULATOR,\n Your feed is empty so far, \n go play a game, treat yourself,\n you deserve it Champ.' }
                                        onPress={ () => { this.props.navigation.navigate('Tournaments');} }/>
                                    }/>
                            <DropdownAlert
                                ref={ ref => this.dropdown = ref }
                                onClose={ data => this._onClose(data) } />
                        </View>
                    );
                }
    }
}

feedScreenStyle = StyleSheet.create({
    container: {
    },
    list: {
        marginRight: 8,
        marginLeft: 8
    },
    sectionHeaderText: {
        margin: 8,
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
