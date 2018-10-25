import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import RivalryCardRow from './RivalryCardRow';

export default class RivalryCardRows extends Component {
  static propTypes = {
    name1: PropTypes.string,
    value1name1: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number
          ]),
    value2name1: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
    name2: PropTypes.string,
    value1name2: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number
          ]),
    value2name2: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
    name3: PropTypes.string,
    value1name3: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number
          ]),
    value2name3: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
    name4: PropTypes.string,
    value1name4: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number
          ]),
    value2name4: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
    name5: PropTypes.string,
    value1name5: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number
          ]),
    value2name5: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
  }

  render = () => {
    const {
            name1, value1name1, value2name1,
            name2, value1name2, value2name2,
            name3, value1name3, value2name3,
            name4, value1name4, value2name4,
            name5, value1name5, value2name5} = this.props;

    return (

        <View style={ { flex:1, margin : 8} }>
            <RivalryCardRow
                name = { name1 }
                value1 = { value1name1 }
                value2 = { value2name1 }
            />
            <RivalryCardRow
                name = { name2 }
                value1 = { value1name2 }
                value2 = { value2name2 }
            />
            <RivalryCardRow
                name = { name3 }
                value1 = { value1name3 }
                value2 = { value2name3 }
            />
            <RivalryCardRow
                name = { name4 }
                value1 = { value1name4 }
                value2 = { value2name4 }
            />
            <RivalryCardRow
                name = { name5 }
                value1 = { value1name5 }
                value2 = { value2name5 }
            />

        </View>
    );
  }
}
