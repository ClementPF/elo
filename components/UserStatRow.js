import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class UserStatRow extends Component {
  static propTypes = {
    tournament: PropTypes.string,
    sport: PropTypes.string,
    score: PropTypes.number,
    position: PropTypes.number
  }
  render = () => {
    const { tournament, sport, score, position} = this.props;

    return (

        <View style={ stylesStats.container }>

                <Text style={ stylesStats.tournamentText }>
                    { tournament }
                </Text>
                <Text style={ stylesStats.scoreText }>
                    {  score.toFixed(0) }
                </Text>
      </View>
    );
  }
}

stylesStats = StyleSheet.create({
    container: {
        padding: 8,
        margin: 1,
        flex: 1,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'whitesmoke'
    },
    scoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'grey',
        textAlign: 'right'
    },
    tournamentText: {
        fontSize: 16,
        fontWeight: 'normal',
        color: 'grey',
        textAlign: 'left'
    }
})
