import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Moment from 'moment';

export default class RivalryCardRow extends Component {
  static propTypes = {
    name: PropTypes.string,
    value1: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number
          ]),
    value2: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
          ])
  }


  render = () => {
    const { name, value1, value2} = this.props;
      return (
          <View style={ stylesCardsRow.container }>
                  <Text style={ stylesCardsRow.valueText }>
                      {  value1 }
                  </Text>
                  <Text style={ stylesCardsRow.nameText }>
                      { name }
                  </Text>
                  <Text style={ stylesCardsRow.valueText }>
                      {  value2 }
                  </Text>
        </View>
      );
    }
}

stylesCardsRow = StyleSheet.create({
  container: {
      height: 30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'white'
  },
  nameText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'right'
  },
  valueText: {
      fontSize: 16,
      fontWeight: 'normal',
      color: 'black',
      textAlign: 'left'
  }
})
