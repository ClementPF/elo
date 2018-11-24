import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from 'react-native-elements';
import PropTypes from 'prop-types';
import Moment from 'moment';
import StatsCardRow from './StatsCardRow';
import AvatarCustom from './AvatarCustom';

export default class UserTile extends Component {
  static propTypes = {
    name: PropTypes.string,
    pictureUrl: PropTypes.string,
    wins: PropTypes.number,
    games: PropTypes.number,
    active: PropTypes.bool,
    onPress: PropTypes.func
  };

  render = () => {
    const { name, pictureUrl, wins, games, active, onPress } = this.props;
    console.log('UserTile ' + name + ' ' + pictureUrl);

    if (name == null) console.log('problem ' + name);

    return (
      <View style={userTileStyle.container}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontSize: 92
            }}
          >
            {active ? '⚔️' : ' '}
          </Text>
        </View>
        <Badge value={'WINS \n' + wins} textStyle={userTileStyle.badgeTextStyle} />

        <AvatarCustom
          medium
          rounded
          name={name}
          pictureUrl={pictureUrl}
          //icon={ {name: 'fish', color: '#CE2728'} }
          onPress={() => onPress()}
          activeOpacity={0.7}
        />
        <Badge value={'GAMES \n' + games} textStyle={userTileStyle.badgeTextStyle} />
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
  };
}

userTileStyle = StyleSheet.create({
  container: {
    height: 128,
    width: '100%',
    padding: 8,
    flexDirection: 'row',
    backgroundColor: '#CE2728',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  badgeTextStyle: {
    color: 'white',
    textAlign: 'center'
  }
});
