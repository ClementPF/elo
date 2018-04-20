import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Moment from 'moment';

export default class GameRow extends Component {
  static propTypes = {
    name1: PropTypes.string,
    name2: PropTypes.string,
    tournament: PropTypes.string,
    result: PropTypes.number,
    value: PropTypes.number,
    date: PropTypes.number,
  }
  render = () => {
    const { name1, name2, tournament, result, value,  date} = this.props;

    let strName1 = '🏆' + ` ${name1} ` + '🏆';
    let strName2 = `${name2} `;

    return (

        <View style={ styles.container }>
            <View style={ {flex: 5, flexDirection: 'column'} }>
                <Text >
                    <Text style={ styles.dateText }>
                        { Moment(date).format('DD MMM')}
                    </Text>
                    <Text style={ styles.tournamentText }>
                        {' - ' + tournament}
                    </Text>
                </Text>

                <View style={ styles.resultContainer }>
                    <Text style={ styles.nameText }>
                        { strName1  }
                    </Text>
                    <Text style={ styles.VSText }>
                        { '🆚' }
                    </Text>
                    <Text style={ styles.nameText }>
                        { strName2 }
                    </Text>
                </View>
            </View>
            <View style={ {flex: 1, justifyContent: 'center', flexDirection: 'column'} }>
                <Text style={ styles.scoreText }>
                    { value.toFixed(0) }
                </Text>
            </View>
      </View>

        /*
        <ListItem
            title={ Moment(date).format('DD MMM') }
            //titleNumberOfLines= {1}
            //rightTitle={ value.toFixed(0) }
            //rightTitleNumberOfLines= {1}
            subtitle = { str }
            //subtitleStyle = { {textAlign: 'right'} }
            subtitleNumberOfLines= {5}
            hideChevron = { true }
        />*/
    );
  }
}

styles = StyleSheet.create({
    container: {
        padding: 8,
        margin: 1,
        flex: 1,
        height: 128,
        flexDirection: 'row',
        backgroundColor: 'whitesmoke'
    },
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    dateText: {
        fontSize: 14,
        fontWeight: 'normal',
        color: 'grey',
        color: 'lightslategrey',
        textAlignVertical: 'center'
    },
    tournamentText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'darkslategrey',
        textAlignVertical: 'center'
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'normal',
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    VSText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'tomato',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    scoreText: {
        fontSize: 36,
        textShadowRadius: 10,
        fontWeight: 'bold',
        color: 'grey',
        textAlign: 'center',
        textAlignVertical: 'center'
    }
})
