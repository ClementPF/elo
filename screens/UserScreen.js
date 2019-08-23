import React, { Component } from 'react';
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
import { Icon, List, ListItem, Button } from 'react-native-elements';
import Moment from 'moment';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import { NavigationActions } from 'react-navigation';
import GameRowContainer from '../containers/GameRowContainer';
import StatsCardContainer from '../containers/StatsCardContainer';
import UserTile from '../components/UserTile';
import EmptyResultsButton from '../components/EmptyResultsButton';
import RivalriesPieChart from '../components/RivalriesPieChart';
import { getUser } from '../redux/actions';
import { invalidateData } from '../redux/actions/RefreshAction';
import { Dimensions } from 'react-native';
import Svg from 'react-native-svg';
import _ from 'lodash';
import * as R from 'constants';

//import {PieChart} from 'react-native-chart-kit';
import {
  VictoryPie,
  VictoryChart,
  VictoryTheme,
  VictoryContainer,
  VictoryLabel,
  VictoryTooltip
} from 'victory-native';
import { getGamesForUser, getStatsForUser, challengeUser } from '../api/user';
import { getStatsForUserForTournament, getRivalriesForUserForTournament } from '../api/stats';

class UserScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    error: PropTypes.object,
    user: PropTypes.object, //  user logged in
    isDataStale: PropTypes.bool
  };

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params == null ? 'Your Profile' : params.user.username,
      headerTintColor: 'white'
    };
  };

  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
    //this.chartRef = {};
    this.viewabilityConfig = {
      waitForInteraction: true,
      viewAreaCoveragePercentThreshold: 5,
      minimumViewTime: 0
    };
    if (params) {
      this.state = {
        //  case of screen in feed or tournaments StackNavigator
        isProfileScreen: false,
        loading: true,
        refreshing: false,
        paginating: false,
        endReached: false,
        pageCount: 0,
        pageSize: 10,
        games: [],
        user: params.user, //  user to display
        tournamentName: params.tournamentName,
        challenged: false,
        chartData: []
      };
    } else {
      this.state = {
        //  case of screen in Profile StackNavigator
        isProfileScreen: true,
        loading: true,
        refreshing: false,
        paginating: false,
        endReached: false,
        pageCount: 0,
        pageSize: 10,
        user: null,
        chartData: []
      };
    }
  }

  componentWillMount() {
    // console.log('UserScreen - componentWillMount');
    const { stats, user, tournamentName } = this.state;
    if (stats != null) {
      this.setState({ loading: false, refreshing: false });
    } else if (user != null && tournamentName != null) {
      //  case of screen in feed or tournaments StackNavigator
      this.fetchData(user.username, tournamentName);
    } else if (this.props.user != null) {
      //  case of screen in feed or tournaments StackNavigator
      this.setState({ user: this.props.user });
      this.fetchData(this.props.user.username);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { user, tournamentName } = this.state;
    const { error } = this.props;
    //  console.log('UserScreen - componentWillReceiveProps ' + JSON.stringify(nextProps));
    if (nextProps.error && !error) {
      this.onError(nextProps.error);
    }
    if (this.props.user !== nextProps.user && nextProps.user !== null) {
      //  console.log('UserScreen - componentWillReceiveProps ' + JSON.stringify(nextProps.user));
      this.setState({ user: nextProps.user });
      this.fetchData(nextProps.user.username, tournamentName);
    }
    if (nextProps.isDataStale === true) {
      //  console.log('UserScreen - componentWillReceiveProps '' + nextProps.invalidateData == true ? ' invalidateData true' : ' invalidateData false');
      this.fetchData(user.username, tournamentName);
    }
  }

  onError = error => {
    if (error) {
      this.dropdown.alertWithType('error', 'Error', error);
    }
  };

  onRefresh = () => {
    const { user, tournamentName } = this.state;
    this.setState(
      { refreshing: true, pageCount: 0, endReached: false },
      this.fetchData(user.username, tournamentName)
    );
  };

  onEndReached = () => {
    const { paginating, endReached, games: loadedGames } = this.state;
    if (paginating || endReached || _.isEmpty(loadedGames)) return;
    this.setState(
      (previousState, currentProps) => ({
        paginating: true,
        pageCount: previousState.pageCount + 1
      }),
      () => {
        const { user, tournamentName, pageSize, pageCount } = this.state;
        getGamesForUser({
          username: user.username,
          tournamentName,
          page: pageCount,
          page_size: pageSize
        })
          .then(games => {
            loadedGames.push(...games);
            this.setState({
              games: loadedGames,
              endReached: games.length < pageSize,
              paginating: false
            });
          })
          .catch(console.error);
      }
    );
  };

  fetchData = (username, tournamentName) => {
    const { pageCount, pageSize } = this.state;
    console.log('fetchData', username, tournamentName);
    Promise.all([
      this.getStats(username, tournamentName)
        .then(stats => {
          let wins = 0;
          let games = 0;
          if (stats.length == 0) {
            const emptyStats = {
              tournament: { display_name: 'tournament' },
              score: 1000,
              best_score: 1000,
              game_count: 0,
              win_streak: 0,
              lose_streak: 0,
              tie_streak: 0,
              longuest_win_streak: 0,
              longuest_lose_streak: 0,
              worst_rivalry: null,
              best_rivalry: null
            };
            stats = [];
            stats[0] = emptyStats;
          }

          if (!Array.isArray(stats))
            //   convert a single obj into an array
            stats = [stats];

          stats.forEach(s => {
            wins += s.win_count;
            games += s.game_count;
          });
          this.setState({ stats, gameCount: games, winCount: wins });
        })
        .catch(error => {
          this.onError(`failed to get stats for user ${error}`);
        }),
      getRivalriesForUserForTournament(username, tournamentName)
        .then(rivalries => {
          const temp = [];
          temp.push(
            rivalries.map(elem => {
              const rdmColor = `rgb(
                  255,
                  ${Math.floor(Math.random() * 100)},
                  ${Math.floor(Math.random() * 100)},
                  ${Math.max(0.8, Math.min(1, 0.8 + Math.random()))})`;
              return {
                value: Math.round(elem.score),
                name: elem.rival.username,
                label: elem.rival.username + ': ' + Math.round(elem.score),
                color: rdmColor,
                legendFontColor: 'dimgrey',
                legendFontSize: 10
              };
            })
          );
          this.setState({ chartData: temp[0] });
        })
        .catch(error => {
          this.onError(`failed to get rivalry for user ${error}`);
        }),
      getGamesForUser({
        username,
        tournamentName,
        page: pageCount,
        page_size: pageSize
      })
        .then(games => {
          this.setState({
            games,
            endReached: games.length < pageSize
          });
        })
        .catch(error => {
          this.onError(`failed to get games for user ${error}`);
        })
    ])
      .then(() => {
        this.setState({ loading: false, refreshing: false });
      })
      .catch(error => {
        this.setState({ loading: false, refreshing: false });
        this.onError(`failed to fetch page for user ${error}`);
      });
  };

  //   Encapsulate the two endpoints that are queried depending if the screen is used for the userProfile of for the detail of a user in tournmament
  getStats = (username, tournamentName) => {
    if (tournamentName) {
      return getStatsForUserForTournament(username, tournamentName);
    }
    return getStatsForUser(username);
  };

  renderChart = params => {
    const { section, item, index } = params;
    return (
      <View
        style={{
          backgroundColor: 'black',
          borderWidth: 1,
          borderColor: 'white'
        }}
      >
        <RivalriesPieChart
          //ref={ref => (this.chartRef[section.title] = ref)}
          rivalries={item}
        />
      </View>
    );
  };

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    const sharkChartVisibilityHasChanged =
      changed[0].item.title === 'SHARKS' && changed[0].isViewable;
    const fishChartVisibilityHasChanged =
      changed[0].item.title === 'FISHES' && changed[0].isViewable;

    console.log('chart shark now visible :' + sharkChartVisibilityHasChanged);
    console.log('chart fish now visible :' + fishChartVisibilityHasChanged);
    if (fishChartVisibilityHasChanged) {
      this.chartRef[changed[0].item.title].startAnimation();
      //this.setState({ fishChartVisible : fishChartVisibilityHasChanged })
    } else if (sharkChartVisibilityHasChanged) {
      this.chartRef[changed[0].item.title].startAnimation();
      //this.setState({ sharkChartVisible: sharkChartVisibilityHasChanged})
    }
  };

  renderItemUser = ({ item, index }) => {
    const { winCount, gameCount, challenged } = this.state;
    const { user } = this.props;
    const { username, picture_url } = item;
    return (
      <View>
        <UserTile
          name={item.username}
          pictureUrl={picture_url == null ? undefined : item.picture_url}
          wins={winCount}
          games={gameCount}
          active={challenged}
          //  onPress = { () => {console.log("plop")} }
          onPress={() => {
            if (challenged) {
              return;
            }
            challengeUser(user, username, 'I demand a trial by combat.')
              .then(() => {
                this.setState({ challenged: true });
              })
              .catch(error => {
                this.setState({ challenged: false });
                this.onError(
                  `Challenge failed, ${username} doesn't have push notification turned on.`
                );
              });
          }}
        />
      </View>
    );
  };

  renderItemGame = ({ item, index }) => (
    <TouchableOpacity onPress={() => this.props.navigation.navigate('Game', { game: item })}>
      <GameRowContainer user={item.outcomes[1].user} game={item} />
    </TouchableOpacity>
  );

  renderItemStats = ({ item, index }) => <StatsCardContainer stats={item} />;

  onClose(data) {
    //   data = {type, title, message, action}
    //   action means how the alert was closed.
    //   returns: automatic, programmatic, tap, pan or cancel
  }

  render() {
    let rendered = null;
    const {
      isProfileScreen,
      chartData,
      stats,
      games,
      refreshing,
      pageCount,
      pageSize,
      user,
      endReached,
      loading
    } = this.state;
    if (loading) {
      rendered = <ActivityIndicator size="small" color="white" />;
    } else {
      const { navigate } = this.props.navigation;

      const userAsList = [user];
      const chartDataClone = JSON.parse(JSON.stringify(chartData));
      //const chartDataAsList = [chartData];

      var givers = chartDataClone.filter(item => item.value > 0);
      givers.sort(function(a, b) {
        return a.value - b.value;
      });
      var takers = chartDataClone.filter(item => item.value < 0);
      takers.sort(function(a, b) {
        return b.value - a.value;
      });
      takers = takers.map(elem => {
        elem.value = Math.abs(elem.value);
        return elem;
      });

      const giversChartDataAsList = [givers];
      const takersChartDataAsList = [takers];
      let sections = [
        { title: null, data: userAsList, renderItem: this.renderItemUser },
        { title: 'STATS', data: stats, renderItem: this.renderItemStats },
        { title: 'GAME HISTORY', data: games, renderItem: this.renderItemGame }
      ];

      if (!isProfileScreen) {
        if (givers.length > 0) {
          sections.splice(2, 0, { title: 'FISHES', data: [givers], renderItem: this.renderChart });
        }
        if (takers.length > 0) {
          sections.splice(2, 0, { title: 'SHARKS', data: [takers], renderItem: this.renderChart });
        }
      }

      sections = sections.filter(section => section.data != null && section.data.length > 0);

      rendered = (
        <SectionList
          style={searchableSectionList.list}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
          renderSectionHeader={({ section: { title } }) =>
            title == null ? null : (
              <Text style={searchableSectionList.sectionHeaderText}>{title}</Text>
            )
          }
          sections={sections}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={1.5}
          //viewabilityConfig={this.viewabilityConfig}
          //onViewableItemsChanged={this.onViewableItemsChanged}
          ItemSeparatorComponent={({ section }) => (
            <View style={{ height: section.title == 'RANKING' ? 1 : 8 }} />
          )}
          ListEmptyComponent={
            <EmptyResultsButton
              title="Havn't played yet, create a tournament or enter a game"
              onPress={() => {
                this.props.navigation.navigate('Tournaments');
              }}
            />
          }
          ListFooterComponent={
            endReached && (
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

UserScreenStyle = StyleSheet.create({
  container: {}
});

const mapStateToProps = ({ userReducer, refreshReducer }) => ({
  user: userReducer.user,
  isDataStale: refreshReducer.isDataStale
});

export default connect(
  mapStateToProps,
  {}
)(UserScreen);

/*
  renderChartOG = ({ item, index }) => {
    const screenWidth = Dimensions.get('window').width;
    var givers = item[0].filter(item => item.value > 0);
    var takers = item[0].filter(item => item.value < 0);
    const chartConfig = {
      color: (opacity = 1) => `rgba(10, 255, 10, ${opacity})`
    };
    debugger;
    //takers.map(item => { item.value = Math.abs(item.value); return item });
    const giversChart = (
      <PieChart
        style={{ flex: 1 }}
        data={givers}
        accessor="value"
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        backgroundColor="white"
      />
    );
    const takersChart = (
      <PieChart
        style={{ flex: 1 }}
        data={takers}
        accessor="value"
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        backgroundColor="white"
      />
    );
    return (
      <View
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={searchableSectionList.sectionHeaderText}> 🎣 GIVERS 🎣 </Text>
        {givers.length > 0 && giversChart}

        <Text style={searchableSectionList.sectionHeaderText}> 🦈 TAKERS 🦈 </Text>
        {takers.length > 0 && takersChart}
      </View>
    );
};*/
