import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AnimatedBar from './AnimatedBar';
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
  constructor(props) {
      super(props);
  }

  render = () => {
    const { name, value1, value2} = this.props;
      return (
          <View style={ styleRivalryRow.container }
                >
                  <Text style={ styleRivalryRow.valueText }>
                      {  value1 }
                  </Text>
                  <Text style={ styleRivalryRow.nameText }>
                      { name }
                  </Text>
                  <Text style={ styleRivalryRow.valueText }>
                      {  value2 }
                  </Text>
        </View>
      );
    }
}

styleRivalryRow = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
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
