import React, { Component } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { getRivalryForUserForRivalForTournament } from '../api/stats';
import RivalryCardRows from '../components/RivalryCardRows';

export default class RivalryRowsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      rivalry: null
    };
  }

  componentDidMount() {
    getRivalryForUserForRivalForTournament(
      this.props.username,
      this.props.rivalname,
      this.props.tournamentName
    )
      .then(response => {
        this.setState({ rivalry: response.data, loading: false });
      })
      .catch(error => {
        this.onError('failed to get tournaments : ' + error);
      });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="small" color="black" />
        </View>
      );
    }
    if (this.state.rivalry.rivalry_stats_id == null) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>
            NO RIVALRY BETWEEN {this.props.username} AND {this.props.rivalname} FOR{' '}
            {this.props.tournamentName}
          </Text>
        </View>
      );
    }
    const rivalry = this.state.rivalry;
    return (
      <RivalryCardRows
        name1={'Total Points'}
        value1name1={rivalry.score.toFixed(0)}
        value2name1={-rivalry.score.toFixed(0)}
        name2={'Game Count'}
        value1name2={rivalry.game_count}
        value2name2={rivalry.game_count}
        name3={'Win Count'}
        value1name3={rivalry.win_count}
        value2name3={rivalry.lose_count}
        name4={
          'Current ' +
          (rivalry.win_streak > 0
            ? 'Winning'
            : rivalry.lose_streak > 0
            ? 'Losing'
            : rivalry.tie_streak > 0
            ? 'Tie'
            : '') +
          ' Streak'
        }
        value1name4={Math.max(rivalry.win_streak, rivalry.lose_streak, rivalry.tie_streak)}
        value2name4={Math.min(rivalry.win_streak, rivalry.lose_streak, rivalry.tie_streak)}
        name5={'Longest Win Streak'}
        value1name5={rivalry.longuest_win_streak}
        value2name5={rivalry.longuest_lose_streak}
      />
    );
  }
}
