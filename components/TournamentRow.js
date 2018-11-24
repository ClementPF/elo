import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class TournamentRow extends Component {
  static propTypes = {
    tournament: PropTypes.string,
    tournament_id_name: PropTypes.string,
    sport: PropTypes.string,
    score: PropTypes.number,
    position: PropTypes.number
  };
  render = () => {
    const { tournament, tournament_id_name, sport, score, position } = this.props;

    return (
      <View style={stylesTournament.container}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={stylesTournament.tournamentText}>{tournament}</Text>
          <Text style={stylesTournament.tournamentSubtitleText}>{'@' + tournament_id_name}</Text>
        </View>
        <Text style={stylesTournament.sportText}>{sport}</Text>
      </View>
    );
  };
}

stylesTournament = StyleSheet.create({
  container: {
    padding: 8,
    flex: 1,
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  sportText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'right'
  },
  tournamentText: {
    flex: 3,
    fontSize: 18,
    fontWeight: 'normal',
    color: 'black',
    textAlign: 'left'
  },
  tournamentSubtitleText: {
    flex: 2,
    marginLeft: 8,
    fontSize: 12,
    fontWeight: 'normal',
    color: 'grey',
    textAlign: 'left'
  }
});
