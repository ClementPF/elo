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
import PureChart from 'react-native-pure-chart';
import GameRowContainer from '../containers/GameRowContainer';
import StatsCard from '../components/StatsCard';
import UserTile from '../components/UserTile';
import EmptyResultsButton from '../components/EmptyResultsButton';
import { getUser } from '../redux/actions';
import { invalidateData } from '../redux/actions/RefreshAction';

// import {LineChart} from 'react-native-chart-kit';
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
    if (params) {
      this.state = {
        //  case of screen in feed or tournaments StackNavigator
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
    const { tournamentName } = this.state;
    this.setState(
      { refreshing: true, pageCount: 0, endReached: false },
      this.fetchData(tournamentName)
    );
  };

  onEndReached = () => {
    const { paginating, endReached, games } = this.state;
    if (paginating || endReached) return;
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
        }).then(response => {
          if (response.data.length < pageSize) {
            this.setState({ endReached: true, paginating: false });
          } else {
            games.push(...response.data);
            this.setState({ games, paginating: false });
          }
        });
      }
    );
  };

  fetchData = (username, tournamentName) => {
    const { pageCount, pageSize } = this.state;
    Promise.all([
      this.getStats(username, tournamentName)
        .then(response => {
          let wins = 0;
          let games = 0;
          if (response.data.length == 0) {
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
            response.data = [];
            response.data[0] = emptyStats;
          }

          if (!Array.isArray(response.data))
            //   convert a single obj into an array
            response.data = [response.data];

          response.data.forEach(s => {
            wins += s.win_count;
            games += s.game_count;
          });
          this.setState({ stats: response.data, gameCount: games, winCount: wins });
        })
        .catch(error => {
          this.onError(`failed to get stats for user ${error}`);
        }),
      getRivalriesForUserForTournament(username, 'testtournament')
        .then(response => {
          const temp = [];
          temp.push(
            response.data.map(elem => {
              const rdmColor = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
                Math.random() * 256
              )},${Math.floor(Math.random() * 256)})`;
              return {
                value: -elem.score.toFixed(0),
                label: elem.rival.username,
                color: rdmColor
              };
            })
          );

          //  temp = temp[0];
          this.setState({ chartData: temp });
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
        .then(response => {
          /*
          const temp = [];

                    temp.push(response.data.map((elem) => {
                        return {
                            x: Moment(elem.date).fromNow(false),
                            y: parseInt(elem.outcomes[elem.outcomes[0].user.username == this.state.user.username ? 0 : 1].score_value.toFixed(0))
                        }
                    }));


                    temp = temp[0];

                    temp = temp.slice(temp.length - 30); */
          this.setState({
            games: response.data,
            endReached: response.data.length < pageSize
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

  renderChart = ({ item, index }) => (
    <View>
      <PureChart data={item[0]} type="pie" />
    </View>
  );

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
      <GameRowContainer
        user={item.outcomes[1].user}
        game={item}/>
    </TouchableOpacity>
  );

  renderItemStats = ({ item, index }) => {
    const { win_streak, lose_streak, tie_streak, tournament } = item;
    let currentStreakType;
    if (win_streak > 0) {
      currentStreakType = 'Winning';
    } else if (lose_streak > 0) {
      currentStreakType = 'Losing';
    } else if (tie_streak > 0) {
      currentStreakType = 'Tie';
    }

    return (
      <StatsCard
        title={tournament.display_name}
        name1="Score"
        value1={item.score.toFixed(0)}
        name2="Best Score"
        value2={item.best_score.toFixed(0)}
        name3="Game Count"
        value3={item.game_count}
        name4={`Current ${currentStreakType} Streak`}
        value4={Math.max(win_streak, lose_streak, tie_streak)}
        name5="Longest Winning Streak"
        value5={item.longuest_win_streak}
        name6="Longest Losing Streak"
        value6={item.longuest_lose_streak}
        name7="The Freaking Shark"
        value7={
          item.worst_rivalry == null
            ? '❌🦈'
            : `${item.worst_rivalry.rival.username} (${item.worst_rivalry.score.toFixed(0)})`
        }
        name8="The Smelly Fish"
        value8={
          item.best_rivalry == null
            ? '❌🎣'
            : `${item.best_rivalry.rival.username} (${item.best_rivalry.score.toFixed(0)})`
        }
      />
    );
  };

  onClose(data) {
    //   data = {type, title, message, action}
    //   action means how the alert was closed.
    //   returns: automatic, programmatic, tap, pan or cancel
  }

  render() {
    let rendered = null;
    const { chartData, stats, games, refreshing, pageCount, pageSize, user, endReached, loading } = this.state;
    if (loading) {
      rendered = <ActivityIndicator size="small" color="white" />;
    } else {
      const { navigate } = this.props.navigation;

      const userAsList = [user];
      const chartDataAsList = [chartData];
      let sections = [
        { title: null, data: userAsList, renderItem: this.renderItemUser },
        // { title: 'CHARTS', data: chartDataAsList, renderItem: this.renderChart },
        { title: 'STATS', data: stats, renderItem: this.renderItemStats },
        { title: 'GAME HISTORY', data: games, renderItem: this.renderItemGame }
      ];
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
          onEndReachedThreshold={(pageCount * pageSize) / games.length}
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
      <View style={feedScreenStyle.container}>
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
