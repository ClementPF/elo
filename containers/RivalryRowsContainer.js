import React, { Component } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { getRivalryForUserForRivalForTournament } from '../api/stats';
import RivalryCardRows from '../components/RivalryCardRows';
import _ from 'lodash';

export default class RivalryRowsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      rivalry: null
    };
  }

  componentDidMount() {
    const { username, rivalname, tournamentName } = this.props;
    getRivalryForUserForRivalForTournament(username, rivalname, tournamentName)
      .then(rivalry => {
        console.log('getRivalryForUserForRivalForTournament', rivalry);
        this.setState({ rivalry, loading: false });
      })
      .catch(error => {
        this.onError('failed to get rivalries : ' + error);
      });
  }

  render() {
    const { loading, rivalry } = this.state;
    const { tournamentName, username, rivalname } = this.props;
    console.log('render', rivalry);
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="small" color="black" />
        </View>
      );
    }
    if (!_.has(rivalry, 'rivalry_stats_id')) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>
            NO RIVALRY BETWEEN {username} AND {rivalname} FOR {tournamentName}
          </Text>
        </View>
      );
    }
    const {
      score,
      game_count,
      win_count,
      lose_count,
      win_streak,
      lose_streak,
      tie_streak,
      longuest_win_streak,
      longuest_lose_streak
    } = rivalry;

    console.log(
      score,
      game_count,
      win_count,
      lose_count,
      win_streak,
      lose_streak,
      tie_streak,
      longuest_win_streak,
      longuest_lose_streak
    );
    return (
      <RivalryCardRows
        name1={'Total Points'}
        value1name1={score.toFixed(0)}
        value2name1={-score.toFixed(0)}
        name2={'Game Count'}
        value1name2={game_count}
        value2name2={game_count}
        name3={'Win Count'}
        value1name3={win_count}
        value2name3={lose_count}
        name4={
          'Current ' +
          (win_streak > 0 ? 'Winning' : lose_streak > 0 ? 'Losing' : tie_streak > 0 ? 'Tie' : '') +
          ' Streak'
        }
        value1name4={Math.max(win_streak, lose_streak, tie_streak)}
        value2name4={Math.min(win_streak, lose_streak, tie_streak)}
        name5={'Longest Win Streak'}
        value1name5={longuest_win_streak}
        value2name5={longuest_lose_streak}
      />
    );
  }
}
