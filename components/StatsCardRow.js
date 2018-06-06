import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Moment from 'moment';

export default class StatsCardRow extends Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number
            ])
  }


  render = () => {
    const { name, value} = this.props;
      return (
          <View style={ stylesCardsRow.container }>
                  <Text style={ stylesCardsRow.nameText }>
                      { name }
                  </Text>
                  <Text style={ stylesCardsRow.valueText }>
                      {  value }
                  </Text>
        </View>
      );
    }
}

stylesCardsRow = StyleSheet.create({
  container: {
      flex: 1,
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
