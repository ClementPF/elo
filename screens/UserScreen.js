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
    StyleSheet
} from 'react-native';
import {Icon, List, ListItem, Button} from 'react-native-elements';
import GameRow from '../components/GameRow';
import StatsCard from '../components/StatsCard';
import EmptyResultsButton from '../components/EmptyResultsButton';
import Moment from 'moment';
import { getUser } from '../redux/actions';
import { connect } from 'react-redux';
import { invalidateData } from '../redux/actions/RefreshAction';
import {NavigationActions} from 'react-navigation';

import { getStatsForUser, getGamesForUser} from '../api/user';

class UserScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object,
        dispatch: PropTypes.func
    }

    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params;
        return {title: params.userName,
                headerTintColor: 'white'};
    };

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            stats: Array(props.navigation.state.params.userStats),
            games: [],
            userName: props.navigation.state.params.userName,
            tournamentName: props.navigation.state.params.tournamentName,
            tournamentDisplayName: props.navigation.state.params.tournamentDisplayName
        };
    }

    componentWillMount() {

        console.log('UserScreen - componentWillMount');
        this.fetchData();
    }

    componentWillReceiveProps(nextProps) {
        console.log("UserScreen - componentWillReceiveProps " + JSON.stringify(nextProps));
      if (nextProps.error && !this.props.error) {
        this.props.alertWithType('error', 'Error', nextProps.error);
      }

      if(nextProps.invalidateData == true){
          console.log("UserScreen - componentWillReceiveProps " + nextProps.invalidateData == true ? ' invalidateData true' : ' invalidateData false');
          this.fetchData();
      }
    }

    fetchData (){
        if (this.state.stats == null || this.state.stats.size == 0) {
            getStatsForUser(this.state.userName).then((response) => {
                    this.setState({stats: response.data});
                }).catch((error) => {
                    console.log('failed to get stats for user ' + error);
                }).done();
        }

        getGamesForUser(this.state.userName, this.state.tournamentName).then((response) => {
            this.setState({games: response.data});
            this.setState({refreshing: false});
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
        console.log('UserScreen - _renderItem ' + index);
    }

    _renderItemGame = ({item, index}) => (
        <GameRow
            name1= { item.outcomes[item.outcomes[0].result == 'WIN' ? 0 : 1].user_name }
            name2= { item.outcomes[item.outcomes[0].result != 'WIN' ? 0 : 1].user_name }
            tournament={ item.tournament.display_name }
            result= { item.outcomes[item.outcomes[0].user_name == this.state.userName ? 0 : 1].score_value < 0 }
            value= { item.outcomes[item.outcomes[0].user_name == this.state.userName ? 0 : 1].score_value }
            date= { item.date }/>);

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
            name5= { 'Longuest Winning Streak' }
            value5= { item.longuest_win_streak }
            name6= { 'Longuest Losing Streak' }
            value6= { item.longuest_lose_streak }
        />
);

    _onRefresh() {
        console.log('refreshing ')
        this.setState({refreshing: true});
        this.fetchData();
    }

    render() {
        const { navigate } = this.props.navigation;
        const rows = this.state.stats;

          var sections = [
              { title: 'STATS', data: this.state.stats, renderItem: this._renderItemStats },
              { title: 'GAME HISTORY', data: this.state.games, renderItem: this._renderItemGame }
          ];
          sections = sections.filter(section => section.data.length > 0);

        return (
            <View
                style = { UserScreenStyle.container }>
                <StatusBar translucent={ false } barStyle= "light-content" />
                <SectionList
                    style = { UserScreenStyle.list }
                    keyExtractor={ (item, index) => item + index }
                    renderItem={ ({ item, index, section }) => <Text key={ index }>{ item }</Text> }
                    renderSectionHeader={ ({ section: { title } }) => <Text style={ UserScreenStyle.sectionHeaderText }>{title}</Text> }
                    sections={ sections }
                    refreshing={ this.state.refreshing }
                    onRefresh={ this._onRefresh.bind(this) }
                    ListEmptyComponent={
                        <EmptyResultsButton
                            title="Havn't played yet, create a tournament or enter a game"
                            onPress={ () => { this.props.navigation.navigate('Tournaments');} } />
                        }/>
            </View>
        );
    }
}

UserScreenStyle = StyleSheet.create({
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

const mapStateToProps = ({ userReducer, refreshReducer }) => {
    console.log('UserScreen - mapStateToProps ');
    const { user } = userReducer;
    const { invalidateData } = refreshReducer;
    return { user, invalidateData };
};

export default connect(mapStateToProps, { getUser,invalidateData })(UserScreen);
