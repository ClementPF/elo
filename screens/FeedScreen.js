import React, { Component } from 'react';
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
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import { Notifications } from 'expo';
import { NavigationActions } from 'react-navigation';
import GameRowContainer from '../containers/GameRowContainer';
import {
  UserStatRow,
  RivalryCardContainer,
  EmptyResultsButton,
  EmptyResultsScreen
} from '../components';
import { fetchUser, fetchGamesForUser } from '../redux/actions';
import { invalidateData } from '../redux/actions/RefreshAction';
import { getStatsForUser } from '../api/user';
import * as R from 'constants';
import _ from 'lodash';

class FeedScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return { title: 'Feed' };
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      paginating: false,
      endReached: false,
      pageCount: 0,
      pageSize: 15,
      stats: [],
      games: []
    };
  }

  componentWillMount() {
    // console.log('FeedScreen - componentWillMount');
    this.setState({ loading: true });
    this.props.fetchUser();
  }

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillReceiveProps(nextProps) {
    const { error, user, games } = this.props;
    if (nextProps.error && error) {
      this.onError(nextProps.error);
    }

    if (user != nextProps.user && nextProps.user != null) {
      // console.log('FeedScreen - componentWillReceiveProps ' + JSON.stringify(nextProps.user));
      this.fetchData(nextProps.user.username);
    }
    if (nextProps.isDataStale == true) {
      // console.log('FeedScreen - componentWillReceiveProps ' + JSON.stringify(nextProps.isDataStale));
      this.fetchData(user.username);
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

  fetchData(username) {
    const { screenName, fetchGamesForUser } = this.props;
    const { pageSize, pageCount } = this.state;
    Promise.all([getStatsForUser(username), fetchGamesForUser(username, pageCount, pageSize)])
      .then(({ [0]: stats, [1]: games }) => {
        console.log();
        this.setState({
          stats,
          loading: false,
          refreshing: false,
          endReached: pageSize > games.length
        });
      })
      .catch(error => {
        this.setState({ stats: [], loading: false, refreshing: false, endReached: false });
        this.onError(R.strings.screen[screenName].errorFailedLoadStats(error));
      });
  }

  renderItem = ({ item, index, section }) => <Text key={index}>{item}</Text>;

  renderRivarlry = (rivalry, index) => <RivalryCardContainer rivalry={rivalry} />;

  renderItemGame = ({ item, index }) => (
    <TouchableOpacity
      key={item.game_id}
      onPress={() =>
        this.sectionList.scrollToLocation({
          animated: true,
          itemIndex: index,
          sectionIndex: 1,
          viewOffset: 48,
          viewPosition: 0
        })
      }
    >
      <GameRowContainer user={this.props.user} game={item} />
    </TouchableOpacity>
  );

  renderGameSection = ({ item, index }) => {
    if (false) return this.renderItemGame({ item, index });
    if (_.has(item, 'game_id')) {
      return this.renderItemGame({ item, index });
    }
    if (_.has(item, 'rivalry_stats_id')) {
      return this.renderRivarlry(item, index);
    }
  };

  renderItemTournament = ({ item: userStats, section, index }) => {
    const {
      score,
      tournament: { name: tournamentName, display_name: tournamentDisplayName }
    } = userStats;
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('Tournament', {
            userStats,
            tournamentName,
            tournamentDisplayName
          })
        }
      >
        <UserStatRow tournament={tournamentDisplayName} position={1} score={score} />
      </TouchableOpacity>
    );
  };

  onRefresh = () => {
    this.setState({ refreshing: true, pageCount: 0, onEndReached: false });
    this.fetchData(this.props.user.username);
  };

  onEndReached = params => {
    const { paginating, endReached } = this.state;
    const { fetchGamesForUser } = this.props;
    if (paginating || endReached) return;

    this.setState(
      ({ pageCount }, currentProps) => ({
        paginating: true,
        pageCount: pageCount + 1
      }),
      () => {
        const {
          user: { username }
        } = this.props;
        const { pageSize, pageCount } = this.state;
        fetchGamesForUser(username, pageCount, pageSize)
          .then(games => {
            this.setState({ paginating: false, endReached: games.length < pageSize });
          })
          .catch(error => {
            this.onError(error);
            this.setState({ paginating: false, endReached: false });
          });
      }
    );
  };

  onError = error => {
    if (error) {
      this.dropdown.alertWithType('error', 'Error', error);
    }
  };

  onClose(data) {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
  }

  renderListEmptyComponent = (title, navigation) => (
    <EmptyResultsButton
      title={title}
      onPress={() => {
        navigation.navigate('Tournaments');
      }}
    />
  );

  renderListFooterComponent = (label, endReached) =>
    endReached && <Text style={R.palette.sectionHeaderText}>{label}</Text>;

  renderListHeaderComponent = label => <Text style={R.palette.sectionHeaderText}>{label}</Text>;

  renderItemSeparatorComponent = ({ section: { title } }) => <View style={styles.ItemSeparator} />;

  sectionBuilder = ({ stats, games }) => {
    const { screenName } = this.props;
    const { firstSectionTitle, secondSectionTitle } = R.strings.screen[screenName];
    return [
      {
        title: firstSectionTitle,
        data: stats,
        renderItem: this.renderItemTournament
      },
      { title: secondSectionTitle, data: games, renderItem: this.renderGameSection }
    ].filter(section => section.data.length > 0);
  };

  render() {
    const { screenName, games, navigation } = this.props;
    const { navigate } = navigation;
    const { loading, stats, pageCount, pageSize, endReached, refreshing } = this.state;
    const { emptyFeedText, endReachedLabel } = R.strings.screen[screenName];

    console.log('game_id', _.isEmpty(games) ? '' : games[0].game_id);
    let rendered = null;
    if (loading) {
      rendered = <ActivityIndicator size="small" color="white" />;
    } else if (games.length == 0) {
      rendered = (
        <EmptyResultsScreen
          title={emptyFeedText}
          onPress={() => {
            navigate('Tournaments');
          }}
        />
      );
    } else {
      rendered = (
        <SectionList
          ref={ref => (this.sectionList = ref)}
          style={R.palette.sectionList}
          keyExtractor={(item, index) => item + index}
          renderItem={this.renderItem}
          renderSectionHeader={({ section: { title } }) => this.renderListHeaderComponent(title)}
          sections={this.sectionBuilder({ stats, games })}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={1.5}
          ItemSeparatorComponent={this.renderItemSeparatorComponent}
          ListEmptyComponent={this.renderListEmptyComponent(emptyFeedText, navigation)}
          ListFooterComponent={this.renderListFooterComponent(endReached, endReachedLabel)}
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

FeedScreen.defaultProps = {
  screenName: 'FeedScreen',
  games: []
};

FeedScreen.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  isDataStale: PropTypes.bool,
  games: PropTypes.array,
  user: PropTypes.object,
  fetchGamesForUser: PropTypes.func,
  fetchUser: PropTypes.func
};

const styles = StyleSheet.create({
  ItemSeparator: {
    height: 8
  }
});

const mapStateToProps = ({ userReducer: { user, games }, refreshReducer: { isDataStale } }) => ({
  user,
  games,
  isDataStale
});

const mapDispatchStateToProps = state => ({
  fetchUser: state.fetchUser,
  fetchGamesForUser: state.fetchGamesForUser,
  invalidateData: state.invalidateData
});

export default connect(
  mapStateToProps,
  { fetchUser, fetchGamesForUser, invalidateData }
)(FeedScreen);
