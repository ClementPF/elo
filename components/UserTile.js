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
      onPress: PropTypes.func,
  }

  render = () => {
    const { name, pictureUrl, wins, games, active, onPress} = this.props;
console.log("UserTile " + name + " " + pictureUrl);

        if(name == null)
            console.log("problem " + name);

    return (
        <View style = { userTileStyle.container }>
            <View style={ { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'} }>
                <Text style={ {
                    fontSize: 92,
                } }>
                    { active ? '⚔️' : ' '}
                </Text>
            </View>
            <Badge
                value={ wins }
                textStyle={ { color: 'white' } }
            />
            <AvatarCustom
                medium
                rounded
                name= { name }
                pictureUrl={ pictureUrl }
                //icon={ {name: 'fish', color: 'tomato'} }
                onPress={ () => onPress() }
                activeOpacity={ 0.7 }
            />
            <Badge
                value={ games }
                textStyle={ { color: 'white' } }
            />
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
        flexDirection: 'row',
        backgroundColor: 'tomato',
        alignItems:'center',
        justifyContent: 'space-between',
    }
})
