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
import UserStatRow from '../components/UserStatRow';
import RivalryCardContainer from '../containers/RivalryCardContainer';
import EmptyResultsButton from '../components/EmptyResultsButton';
import EmptyResultsScreen from '../components/EmptyResultsScreen';
import { fetchUser, fetchGamesForUser } from '../redux/actions';
import { invalidateData } from '../redux/actions/RefreshAction';
import { getRivalryForUserForRivalForTournament } from '../api/stats';

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
    fetchUser: PropTypes.func
  };

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
    this.props.fetchUser();
  }

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && !this.props.error) {
      this.onError(nextProps.error);
    }

    if (this.props.user != nextProps.user && nextProps.user != null) {
      // console.log('FeedScreen - componentWillReceiveProps ' + JSON.stringify(nextProps.user));
      this.fetchData(nextProps.user.username);
    }
    if (this.props.games != nextProps.games && nextProps.games != null) {
      // console.log('FeedScreen - componentWillReceiveProps ' + nextProps.games.length);
      this.setState({ games: nextProps.games });
    }
    if (nextProps.isDataStale == true) {
      // console.log('FeedScreen - componentWillReceiveProps ' + JSON.stringify(nextProps.isDataStale));
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

  fetchData(username) {
    // console.log('fetching data for  ' + JSON.stringify(username));
    this.timing = new Date();
    this.setState({ loading: true });
    Promise.all([
      getStatsForUser(username)
        .then(response => {
          this.setState({ stats: response.data });
        })
        .catch(error => {
          this.onError(`failed to get stats for user ${error}`);
        }),
      this.props
        .fetchGamesForUser(username, this.state.pageCount, this.state.pageSize)
        .then(response => {
          this.setState({ endReached: this.state.pageSize > response.payload.length });
        })
    ]).then(() => {
      const date = new Date();
      console.log(
        date.getTime() - this.timing.getTime() + 'ms to load a page of ' + this.state.pageSize
      );
      this.setState({ loading: false, refreshing: false });
    });
  }

  renderItem = ({ item, index }) => {};

  renderRivarlry = (rivalry, index) => <RivalryCardContainer rivalry={rivalry} />;

  _insertRivalryAtIndex = index => {
    getRivalryForUserForRivalForTournament(
      this.state.games[index].outcomes[0].user.username,
      this.state.games[index].outcomes[1].user.username,
      this.state.games[index].tournament.name
    )
      .then(response => {
        const games = this.state.games;
        games.splice(index + 1, 0, response.data);
        this.setState({ games });
      })
      .catch(error => {
        this.onError(`failed to get tournaments : ${error}`);
      });

    this.sectionList.scrollToLocation({
      animated: true,
      itemIndex: index,
      sectionIndex: 1,
      viewOffset: 48,
      viewPosition: 0
    });
  };

  renderItemGame = ({ item, index }) => (
    <TouchableOpacity
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

    if (typeof item.game_id !== 'undefined') {
      return this.renderItemGame({ item, index });
    }
    if (item.rivalry_stats_id !== 'undefined') {
      return this.renderRivarlry(item, index);
    }
  };

  /*
    renderGameSection = ({item, index}) => {
        if(typeof item.game_id !== 'undefined'){
            return this.renderItemGame(item,index);
        }else if (item.rivalry_stats_id !== 'undefined'){
            return this.renderRivarlry(item);
        }
    }
*/
  renderItemTournament = ({ item, index }) => (
    <TouchableOpacity
      onPress={() =>
        this.props.navigation.navigate('Tournament', {
          userStats: item,
          tournamentName: item.tournament.name,
          tournamentDisplayName: item.tournament.display_name
        })
      }
    >
      <UserStatRow tournament={item.tournament.display_name} position={1} score={item.score} />
    </TouchableOpacity>
  );

  onRefresh = () => {
    // console.log('refreshing ')
    this.setState({ refreshing: true, pageCount: 0, onEndReached: false });
    this.fetchData(this.props.user.username);
  };

  onEndReached = (params) => {
     if (this.state.paginating || this.state.endReached) return;

    this.setState(
      (previousState, currentProps) => ({
        paginating: true,
        pageCount: previousState.pageCount + 1
      }),
      () => {
        const { user } = this.props;
        const { pageSize, pageCount } = this.state;

        this.props.fetchGamesForUser(user.username, pageCount, pageSize).then(response => {
          this.setState({ paginating: false, endReached: response.payload.length < pageSize });
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

  render() {
    const { navigate } = this.props.navigation;
    const { stats, games, pageCount, pageSize } = this.state;

    const section0 = {
      title: 'YOUR TOURNAMENTS',
      data: stats,
      renderItem: this.renderItemTournament
    };
    const section1 = { title: 'YOUR HISTORY', data: games, renderItem: this.renderGameSection };
    let sections = [section0, section1];
    sections = sections.filter(section => section.data.length > 0);

    let rendered = null;
    if (this.state.loading) {
      rendered = <ActivityIndicator size="small" color="white" />;
    } else if (this.state.games.length == 0) {
      rendered = (
        <EmptyResultsScreen
          title={
            'Hey, welcome to the SHARKULATOR,\n Your feed is empty so far, \n go play a game, treat yourself,\n you deserve it Champ.'
          }
          onPress={() => {
            this.props.navigation.navigate('Tournaments');
          }}
        />
      );
    } else {
        <SectionList
          ref={ref => (this.sectionList = ref)}
          style={feedScreenStyle.list}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={feedScreenStyle.sectionHeaderText}>{title}</Text>
          )}
          sections={sections}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          onEndReached={this.onEndReached}
          ItemSeparatorComponent={({ section }) => (
            <View style={{ height: section.title == 'RANKING' ? 1 : 8 }} />
          )}
          ListEmptyComponent={
            <EmptyResultsButton
                'Hey, welcome to the SHARKULATOR,\n Your feed is empty so far, \n go play a game, treat yourself,\n you deserve it Champ.'
              }
                this.props.navigation.navigate('Tournaments');
              }}
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
      <View style={feedScreenStyle.container}>
        {rendered}
        <DropdownAlert ref={ref => (this.dropdown = ref)} onClose={data => this.onClose(data)} />
      </View>
    );
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

const mapStateToProps = ({ userReducer, refreshReducer }) =>
  // console.log('FeedScreen - mapStateToProps userReducer:' + JSON.stringify(userReducer.user != null ? userReducer.user : 'userReducer') + ' refreshReducer : ' + JSON.stringify(refreshReducer));

  // if(this.props != null){ // avoid NPE on first run
  // console.log('FeedScreen - mapStateToProps userReducer:' +
  //     (userReducer.games != null ? (userReducer.games.length + ' games' : 'no games') : 'No games received : ') +
  //     + (this.props.games != null ? ' there was ' + this.props.games.length : 'no') + ' in props '
  //     + (this.state.games != null ? ' there was ' + this.state.games.length : 'no') + ' in state ' );
  // }
  ({
    user: userReducer.user,
    games: userReducer.games,
    isDataStale: refreshReducer.isDataStale
  });
export default connect(
  mapStateToProps,
  { fetchUser, fetchGamesForUser, invalidateData }
)(FeedScreen);
