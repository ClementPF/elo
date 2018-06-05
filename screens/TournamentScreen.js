import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, SectionList, ActivityIndicator } from 'react-native';
import { Card} from 'react-native-elements';
import GameRow from '../components/GameRow';
import RankRow from '../components/RankRow';
import EmptyResultsButton from '../components/EmptyResultsButton';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import { getStatsForTournament, getGamesForTournament } from '../api/tournament';
import { NavigationActions } from 'react-navigation';

import { invalidateData } from '../redux/actions/RefreshAction';

class TournamentScreen extends Component {
    static propTypes = {
      navigation: PropTypes.object,
      dispatch: PropTypes.func,
      error: PropTypes.object,
      isDataStale: PropTypes.bool,
    }

    static navigationOptions = ({ navigation }) => {
        const  params = navigation.state.params;
        return {
            title: params.tournamentDisplayName,
            headerTintColor: 'white'
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            refreshing: false,
            stats: [],
            games: [],
            userStats: props.navigation.state.params.userStats,
            tournamentName: props.navigation.state.params.tournamentName,
            tournamentDisplayName: props.navigation.state.params.tournamentDisplayName
        };
    }

    componentWillMount(){
        //console.log("componentWillMount for tournament " + this.state.tournamentName);
        this.fetchData(this.state.tournamentName);
    }
    componentWillReceiveProps(nextProps) {
        //console.log("TournamentScreen - componentWillReceiveProps " + JSON.stringify(nextProps));
        if (nextProps.error && !this.props.error) {
            this._onError(nextProps.error);
        }
        if (nextProps.isDataStale == true) {
            //console.log("TournamentScreen - componentWillReceiveProps " + nextProps.invalidateData == true ? ' invalidateData true': ' invalidateData false');
            this.fetchData(this.state.tournamentName);
        }
    }

    _renderItemGame = ({item}) => (
        <TouchableOpacity
            onPress= { () => this.props.navigation.navigate('Game', { game: item } ) }>
              <GameRow
                  name1= { item.outcomes[item.outcomes[0].result == 'WIN' ? 0 : 1].user_name }
                  name2= { item.outcomes[item.outcomes[0].result != 'WIN' ? 0 : 1].user_name }
                  tournament= { item.tournament.display_name }
                  result= { true }
                  value= { item.outcomes[0].score_value > 0 ? item.outcomes[0].score_value : item.outcomes[1].score_value }
                  date= { item.date }
              />
        </TouchableOpacity>
     );

    _renderItemRank = ({item, index}) => (
        <TouchableOpacity
            onPress= { () => this.props.navigation.navigate('User', { userStats: item, userName: item.user.username, tournamentName: item.tournament.name, tournamentDisplayName: item.tournament.display_name }) }>
            <RankRow
                name= { item.user.username }
                position= { index + 1 }
                score= { item.score }
            />
        </TouchableOpacity>
    );

    fetchData(tournamentName) {
        Promise.all([
            getStatsForTournament(tournamentName).then((response) => {
                this.setState({stats: response.data});
            }).catch((error) => {
                this._onError('failed to get stats for tournament : ' + + error);
            }),
            getGamesForTournament(tournamentName).then((response) => {
                this.setState({games: response.data});
            }).catch((error) => {
                this._onError('failed to get games for tournament : ' + + error);
            })
        ]).then(() => {
            this.setState({loading: false, refreshing: false});
        });
    }

    _onRefresh() {
      //console.log('refreshing ')
      this.setState({refreshing: true});
      this.fetchData(this.state.tournamentName);
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
              const userStats = this.state.userStats;

              let sections = [
                  { title: 'RANKING', data: this.state.stats, renderItem: this._renderItemRank },
                  { title: 'HISTORY', data: this.state.games, renderItem: this._renderItemGame }
              ];
              sections = sections.filter(section => section.data.length > 0);

              return (
                <View style={ {flex: 1} }>
                            <SectionList
                              style = { searchableSectionList.list }
                              keyExtractor={ ( item, index) => item + index }
                              renderItem={ ({ item, index, section }) => <Text key={ index }>{ item }</Text> }
                              renderSectionHeader={ ({ section: { title } }) => <Text style={ searchableSectionList.sectionHeaderText }>{title}</Text> }
                              sections={ sections }
                              refreshing={ this.state.refreshing }
                              onRefresh={ this._onRefresh.bind(this) }
                              ListEmptyComponent={
                                <EmptyResultsButton
                                  title="No Games have been played for this tournament, let's change that."
                                  onPress={ () => { this.props.navigation.navigate('GameFormWinnerLooser');} }/>
                            }/>
                    <DropdownAlert
                        ref={ ref => this.dropdown = ref }
                        onClose={ data => this._onClose(data) } />
                </View>
            );
        }
    }
}

const mapStateToProps = ({ refreshReducer }) => {
    //console.log('TournamentScreen - mapStateToProps ');
    return { isDataStale: refreshReducer.isDataStale};
};

export default connect(mapStateToProps, { invalidateData })(TournamentScreen);
