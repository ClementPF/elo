import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    SectionList,
    FlatList,
    StatusBar,
    TouchableOpacity,
    RefreshControl,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import {Icon, List, ListItem, Button} from 'react-native-elements';
import GameRow from '../components/GameRow';
import UserStatRow from '../components/UserStatRow';
import EmptyResultsButton from '../components/EmptyResultsButton';
import Moment from 'moment';
import { getUser } from '../redux/actions';
import { invalidateData } from '../redux/actions/RefreshAction';
import { connect } from 'react-redux';

import {NavigationActions} from 'react-navigation';

import { getStatsForUser, getGamesForUser} from '../api/user';

class FeedScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object,
        dispatch: PropTypes.func
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
            invalidateData: false,
            stats: [],
            games: [],
        };
    }

    componentWillMount() {
        console.log("FeedScreen - componentWillMount");
        this.props.getUser();
    }

    componentWillReceiveProps(nextProps) {

        console.log("FeedScreen - componentWillReceiveProps " + JSON.stringify(nextProps));

        if (nextProps.error && !this.props.error) {
            this.props.alertWithType('error', 'Error', nextProps.error);
        }

        if(nextProps.user != null){
            this.fetchData(nextProps.user.username);
        }
        if(nextProps.invalidateData == true){
            this.setState({'invalidateData':false});
            this.fetchData(this.props.user.username);
        }
    }

    fetchData(username){
        getStatsForUser(username).then((response) => {
                this.setState({stats: response.data});
                this.setState({refreshing: false});
                this.setState({loading: false});
            }).catch((error) => {
                console.log('failed to get stats for user ' + error);
            }).done();

            getGamesForUser(username).then((response) => {
                this.setState({games: response.data});
                this.setState({refreshing: false});
                this.setState({loading: false});
            }).catch((error) => {
                console.log('failed to get stats for user ' + error);
            }).done();
    }

    textForGameResult(game) {
        var player_one = game.outcomes[0].user_name;
        var player_two = game.outcomes[1].user_name;
        var result = game.outcomes[0].result;

        var str = `${player_one} ${result} against ${player_two}`;
        //var str = Moment(game.date).format('d MMM');

        return str;
    }

    _renderItem = ({item, index}) => {
    }

    _renderItemGame = ({item, index}) => (
        <GameRow
            name1= { item.outcomes[item.outcomes[0].result == "WIN" ? 0 : 1].user_name }
            name2= { item.outcomes[item.outcomes[0].result != "WIN" ? 0 : 1].user_name }
            tournament={ item.tournament_display_name }
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
        console.log('refreshing ')
        this.setState({refreshing: true});

        this.props.invalidateData();
        this.fetchData(this.props.user.username);
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

        const sectionListData = [];
        if(this.state.stats.length > 0){
            sectionListData.push({ title: 'YOUR TOURNAMENTS', data: this.state.stats, renderItem: this._renderItemTournament });
        }if(this.state.games.length > 0){
            sectionListData.push({ title: 'YOUR HISTORY', data: this.state.games, renderItem: this._renderItemGame });
        }

        return (
            <View
                style = { feedScreenStyle.container }>
                <StatusBar translucent={ false } barStyle="light-content" />
                <SectionList
                    style = { feedScreenStyle.list }
                    keyExtractor={ (item, index) => item + index }
                    renderItem={ ({ item, index, section }) => <Text key={ index }>{ item }</Text> }
                    renderSectionHeader={ ({ section: { title } }) => <Text style={ feedScreenStyle.sectionHeaderText }>{title}</Text> }
                    sections={ sectionListData }
                    refreshing={ this.state.refreshing }
                    onRefresh={ this._onRefresh.bind(this) }
                    ListEmptyComponent={
                        <EmptyResultsButton
                            title= { 'Hey, welcome to the SHARKULATOR,\n Your feed is empty so far, \n go play a game, treat yourself,\n you deserve it Champ.' }
                            onPress={ () => { this.props.navigation.navigate('Tournaments');} }/>
                        }/>
            </View>
        );
    }
}

feedScreenStyle = StyleSheet.create({
    container: {
    },
    list: {
        paddingRight: 16,
        paddingLeft: 16
    },
    sectionHeaderText: {
        padding: 8,
        fontSize: 28,
        fontWeight: 'normal',
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'black'
    }
})

const mapStateToProps = ({ authReducer, refreshReducer }) => {
    console.log('FeedScreen - mapStateToProps authReducer:' + JSON.stringify(authReducer) + ' refreshReducer : ' + JSON.stringify(refreshReducer));
    return { user : authReducer.user, invalidateData: refreshReducer.invalidateData};
};

export default connect(mapStateToProps, { getUser, invalidateData })(FeedScreen);
