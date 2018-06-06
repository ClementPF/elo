import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import PropTypes from 'prop-types';
import Moment from 'moment';
import StatsCardRow from './StatsCardRow';

export default class StatsCard extends Component {
  static propTypes = {
      title: PropTypes.string,
    name1: PropTypes.string,
    value1: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number
          ]),
    name2: PropTypes.string,
    value2: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number
          ]),
    name3: PropTypes.string,
    value3: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number
          ]),
    name4: PropTypes.string,
    value4: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number
          ]),
    name5: PropTypes.string,
    value5: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number
          ]),
    name6: PropTypes.string,
    value6: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number
            ])
  }

  render = () => {
    const { title, name1, value1, name2, value2, name3, value3, name4, value4, name5, value5, name6, value6} = this.props;

    return (

        <Card style={ statsCardStyle.container }
            title = { title }>
            <StatsCardRow
                name = { name1 }
                value = { value1 }
            />
            <StatsCardRow
                name = { name2 }
                value = { value2 }
            />
            <StatsCardRow
                name = { name3 }
                value = { value3 }
            />
            <StatsCardRow
                name = { name4 }
                value = { value4 }
            />
            <StatsCardRow
                name = { name5 }
                value = { value5 }
            />
            <StatsCardRow
                name = { name6 }
                value = { value6 }
            />
        </Card>
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

statsCardStyle = StyleSheet.create({
    container: {
        padding: 8,
        backgroundColor: 'white'
    }
})
