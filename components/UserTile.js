import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar,Badge } from 'react-native-elements';
import PropTypes from 'prop-types';
import Moment from 'moment';
import StatsCardRow from './StatsCardRow';

export default class UserTile extends Component {
  static propTypes = {
      name: PropTypes.string,
      wins: PropTypes.number,
      games: PropTypes.number,
  }

  render = () => {
    const { name, wins, games} = this.props;

    var initials = (name.charAt(0) + name.charAt(name.indexOf('-') + 1)).toUpperCase();
    return (
        <View style = { userTileStyle.container }>
            <View/>
            <Badge
                value={wins}
                textStyle={{ color: 'white' }}
            />
            <Avatar
                medium
                rounded
                //source={{uri: "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg"}}
                title= { initials }
                //icon={ {name: 'fish', color: 'tomato'} }
                onPress={ () => console.log("Works!") }
                activeOpacity={0.7}
            />
            <Badge
                value={games}
                textStyle={{ color: 'white' }}
            />
            <View/>
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

userTileStyle = StyleSheet.create({
    container: {
        height: 128,
        width: '100%',
        padding: 8,
        margin: 1,
        flexDirection: 'row',
        backgroundColor: 'tomato',
        alignItems:'center',
        justifyContent: 'space-between',
    }
})
