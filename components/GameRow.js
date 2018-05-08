import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Moment from 'moment';

export default class GameRow extends Component {
  static propTypes = {
    name1: PropTypes.string,
    name2: PropTypes.string,
    tournament: PropTypes.string,
    result: PropTypes.bool,
    value: PropTypes.number,
    date: PropTypes.number,
  }

  shortenDateText(dateText) {

      let keyval_value = {'an':'1', 'a':'1', ' few':''};

      let keyval_unit = {
          ' seconds':'s',' second':'s',
          ' minutes':'m',' minute':'m',
          ' hours':'h',' hour':'h',
          ' days':'d',' day':'d',
          ' weeks':'w',' week':'w',
          ' months':'mo',' month':'mo',
          ' years':'y',' year':'y',
      };

      for ( key in keyval_unit) {
          dateText = dateText.replace(key,keyval_unit[key]);
      }

      for ( key in keyval_value) {
          dateText = dateText.replace(key,keyval_value[key]);
      }
      return dateText;
  }

  render = () => {
    const { name1, name2, tournament, result, value,  date} = this.props;

    let strName1 = '🏆' + ` ${name1} ` + '🏆';
    let strName2 = `${name2} `;

    // FORCE TO WHITE
    let customBlackWhiteStyle = true;

    return (

        <View style={ customBlackWhiteStyle ? styles.container : styles.container_loose }>
            <View style={ {flex: 1, flexDirection: 'column', alignItems: 'center'} }>
                <View style={ {flex: 1, flexDirection: 'row', alignItems: 'center'} }>
                    <View style={ {flex: 1, flexDirection: 'column'} }>
                        <Text style={ customBlackWhiteStyle ? styles.tournamentText : styles.tournamentText_loose }>
                            { tournament }
                        </Text>
                    </View>
                    <View style={ {flexDirection: 'column'} }>
                        <Text style={ customBlackWhiteStyle ? styles.dateText : styles.dateText_loose }>
                            { this.shortenDateText(Moment(date).fromNow(true))}
                        </Text>
                    </View>
                </View>
                <View style={ {flex: 4, flexDirection: 'row',alignItems: 'center'} }>
                    <View style={ styles.resultContainer }>
                        <Text style={ customBlackWhiteStyle ? styles.nameText : styles.nameText_loose }>
                            { strName1  }
                        </Text>
                        <Text style={ styles.VSText }>
                            { 'VS' }
                        </Text>
                        <Text style={ customBlackWhiteStyle ? styles.nameText : styles.nameText_loose }>
                            { strName2 }
                        </Text>
                    </View>
                    <Text style={ customBlackWhiteStyle ? styles.scoreText : styles.scoreText_loose }>
                        { value.toFixed(0) }
                    </Text>
                </View>
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
        height: 164,
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    container_loose: {
        padding: 8,
        margin: 1,
        height: 164,
        flexDirection: 'row',
        backgroundColor: 'black'
    },
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    dateText: {
        fontSize: 12,
        fontWeight: 'normal',
        color: 'black',
        textAlignVertical: 'center',
        textAlign: 'right',
        alignSelf: 'flex-end',
    },
    dateText_loose: {
        fontSize: 12,
        fontWeight: 'normal',
        color: 'white',
        textAlignVertical: 'center'
    },
    tournamentText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        textAlignVertical: 'center'
    },
    tournamentText_loose: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlignVertical: 'center'
    },
    nameText: {
        fontSize: 16,
        margin: 8,
        fontWeight: 'normal',
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    nameText_loose: {
        fontSize: 16,
        margin: 8,
        fontWeight: 'normal',
        color: 'white',
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
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    scoreText_loose: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center'
    }
})
