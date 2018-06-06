import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class RankRow extends Component {
  static propTypes = {
    name: PropTypes.string,
    score: PropTypes.number,
    position: PropTypes.number
  }
  render = () => {
    const { name, score, position} = this.props;

    return (

        <View style={ stylesRank.container }>
                <Text style={ stylesRank.nameText }>
                    { position }
                </Text>
                <Text style={ stylesRank.nameText }>
                    { name }
                </Text>
                <Text style={ stylesRank.scoreText }>
                    {  score.toFixed(0) }
                </Text>
      </View>
    );
  }
}

stylesRank = StyleSheet.create({
    container: {
        flex: 1,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white'
    },
    scoreText: {
        fontSize: 58,
        fontWeight: 'bold',
        color: 'lightgrey',
        textAlign: 'right'
    },
    nameText: {
        fontSize: 16,
        marginLeft: 8,
        fontWeight: 'normal',
        color: 'grey',
        textAlign: 'left'
    }
})
