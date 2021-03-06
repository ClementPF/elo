import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, SectionList, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import { NavigationActions } from 'react-navigation';
import GameRowContainer from '../containers/GameRowContainer';
import RankRow from '../components/RankRow';
import { EmptyResultsButton, EmptyResultsScreen } from '../components';
import { getStatsForTournament, getGamesForTournament } from '../api/tournament';
import * as R from 'constants';

import { invalidateData } from '../redux/actions/RefreshAction';

class TournamentScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    error: PropTypes.object,
    isDataStale: PropTypes.bool
  };

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
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
      paginating: false,
      endReached: false,
      stats: [],
      games: [],
      pageCount: 0,
      pageSize: 10,
      userStats: props.navigation.state.params.userStats,
      tournamentName: props.navigation.state.params.tournamentName,
      tournamentDisplayName: props.navigation.state.params.tournamentDisplayName
    };
  }

  componentWillMount() {
    // console.log("componentWillMount for tournament " + this.state.tournamentName);
    this.fetchData(this.state.tournamentName);
  }

  componentWillReceiveProps(nextProps) {
    // console.log("TournamentScreen - componentWillReceiveProps " + JSON.stringify(nextProps));
    if (nextProps.error && !this.props.error) {
      this.onError(nextProps.error);
    }
    if (nextProps.isDataStale == true) {
      // console.log("TournamentScreen - componentWillReceiveProps " + nextProps.invalidateData == true ? ' invalidateData true': ' invalidateData false');
      this.fetchData(this.state.tournamentName);
    }
  }

  renderItemGame = ({ item }) => (
    <TouchableOpacity onPress={() => this.props.navigation.navigate('Game', { game: item })}>
      <GameRowContainer user={item.outcomes[0].user} game={item} />
    </TouchableOpacity>
  );

  renderItemRank = ({ item, index }) => (
    <TouchableOpacity
      onPress={() =>
        this.props.navigation.navigate('User', {
          /* userStats: item, */ user: item.user,
          tournamentName: item.tournament.name,
          tournamentDisplayName: item.tournament.display_name
        })
      }
    >
      <RankRow name={item.user.username} position={index + 1} score={item.score} />
    </TouchableOpacity>
  );

  fetchData = tournamentName => {
    const { pageCount, pageSize } = this.state;
    Promise.all([
      getStatsForTournament(tournamentName)
        .then(stats => {
          this.setState({ stats });
        })
        .catch(error => {
          this.onError(`failed to get stats for tournament : ${+error}`);
        }),
      getGamesForTournament(tournamentName, pageCount, pageSize)
        .then(games => {
          this.setState({
            games,
            endReached: games.length < pageCount
          });
        })
        .catch(error => {
          this.onError(`failed to get games for tournament : ${+error}`);
        })
    ]).then(() => {
      this.setState({ loading: false, refreshing: false });
    });
  };

  onRefresh = () => {
    // console.log('refreshing ')
    this.setState({ refreshing: true, pageCount: 0, endReached: false }, () => {
      this.fetchData(this.state.tournamentName);
    });
  };

  onEndReached = () => {
    const { paginating, endReached } = this.state;
    if (paginating || endReached) return;
    this.setState(
      (previousState, currentProps) => ({
        paginating: true,
        pageCount: previousState.pageCount + 1
      }),
      () => {
        const { tournamentName, pageSize, pageCount } = this.state;
        getGamesForTournament(tournamentName, pageCount, pageSize).then(loadedGames => {
          if (loadedGames.length == 0) {
            this.setState({ endReached: true, paginating: false });
          } else {
            const { games } = this.state;
            games.push(...loadedGames);
            this.setState({ games, paginating: false });
          }
        });
      }
    );
  };

  onClose = data => {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
  };

  render() {
    let rendered = null;
    if (this.state.loading) {
      rendered = <ActivityIndicator size="small" color="white" />;
    } else if (this.state.games.length == 0) {
      rendered = (
        <EmptyResultsScreen
          title={"No Games have been played for this tournament, let's change that."}
          onPress={() => {
            this.props.navigation.navigate('Tournaments');
          }}
        />
      );
    } else {
      const { stats, games, refreshing, pageCount, pageSize } = this.state;

      let sections = [
        { title: 'RANKING', data: stats, renderItem: this.renderItemRank },
        { title: 'HISTORY', data: games, renderItem: this.renderItemGame }
      ];
      sections = sections.filter(section => section.data.length > 0);

      rendered = (
        <SectionList
          style={searchableSectionList.list}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={searchableSectionList.sectionHeaderText}>{title}</Text>
          )}
          sections={sections}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={1.5}
          ItemSeparatorComponent={({ section }) => (
            <View style={{ height: section.title == 'RANKING' ? 1 : 8 }} />
          )}
          ListEmptyComponent={
            <EmptyResultsButton
              title="No Games have been played for this tournament, let's change that."
              onPress={() => {
                this.props.navigation.navigate('GameFormWinnerLooser');
              }}
            />
          }
          ListFooterComponent={
            this.state.endReached && (
              <Text style={searchableSectionList.sectionHeaderText}> This is the end. </Text>
            )
          }
        />
      );
    }

    return (
      <View style={R.palette.sectionListContainer}>
        {rendered}
        <DropdownAlert ref={ref => (this.dropdown = ref)} onClose={data => this.onClose(data)} />
      </View>
    );
  }
}

const mapStateToProps = ({ refreshReducer }) =>
  // game_id('TournamentScreen - mapStateToProps ');
  ({ isDataStale: refreshReducer.isDataStale });
export default connect(
  mapStateToProps,
  { invalidateData }
)(TournamentScreen);
