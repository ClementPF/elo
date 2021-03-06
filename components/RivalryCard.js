import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import PropTypes from 'prop-types';
import Moment from 'moment';
import RivalryCardRows from './RivalryCardRows';
import StatsCardRow from './StatsCardRow';
import AvatarCustom from './AvatarCustom';

export default class RivalryCard extends Component {
  static propTypes = {
    username1: PropTypes.string,
    username2: PropTypes.string,
    pictureUrl1: PropTypes.string,
    pictureUrl2: PropTypes.string,
    title: PropTypes.string,
    name1: PropTypes.string,
    value1name1: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value2name1: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name2: PropTypes.string,
    value1name2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value2name2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name3: PropTypes.string,
    value1name3: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value2name3: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name4: PropTypes.string,
    value1name4: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value2name4: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name5: PropTypes.string,
    value1name5: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value2name5: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  render = () => {
    const {
      title,
      username1,
      username2,
      pictureUrl1,
      pictureUrl2,
      name1,
      value1name1,
      value2name1,
      name2,
      value1name2,
      value2name2,
      name3,
      value1name3,
      value2name3,
      name4,
      value1name4,
      value2name4,
      name5,
      value1name5,
      value2name5
    } = this.props;
    let initials1 = (
      username1.charAt(0) + username1.charAt(username1.indexOf('-') + 1)
    ).toUpperCase();
    let initials2 = (
      username2.charAt(0) + username2.charAt(username2.indexOf('-') + 1)
    ).toUpperCase();

    return (
      <Card {...this.props} style={rivalStatsCardStyle.container} title={title}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View />
          <AvatarCustom
            medium
            rounded
            pictureUrl={pictureUrl1}
            name={initials1}
            //icon={ {name: 'fish', color: '#CE2728'} }
            //onPress={ () => onPress() }
            activeOpacity={0.7}
          />
          <View />
          <AvatarCustom
            medium
            rounded
            pictureUrl={pictureUrl2}
            name={initials2}
            //icon={ {name: 'fish', color: '#CE2728'} }
            //onPress={ () => onPress() }
            activeOpacity={0.7}
          />
          <View />
        </View>

        <View style={{ padding: 16 }}>
          <RivalryCardRows
            name1={name1}
            value1name1={value1name1}
            value2name1={value2name1}
            name2={name2}
            value1name2={value1name2}
            value2name2={value2name2}
            name3={name3}
            value1name3={value1name3}
            value2name3={value2name3}
            name4={name4}
            value1name4={value1name4}
            value2name4={value2name4}
            name5={name5}
            value1name5={value1name5}
            value2name5={value2name5}
          />
        </View>
      </Card>
    );
  };
}

rivalStatsCardStyle = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: 'white'
  }
});
