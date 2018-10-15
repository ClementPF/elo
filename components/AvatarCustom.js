import React, { Component } from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-elements';
import PropTypes from 'prop-types';

export default class AvatarCustom extends Component {
  static propTypes = {
      name: PropTypes.string,
      pictureUrl: PropTypes.string,
      onPress: PropTypes.func,
  }

  render = () => {
    const { name, pictureUrl, onPress, borderColor, borderWidth} = this.props;

    let initials = name == null ? "XX" : (name.charAt(0) + name.charAt(name.indexOf('-') + 1)).toUpperCase();
    return (
        <View style={ {
            padding: 6,
            backgroundColor: borderColor,
            borderRadius: 45,
        } }>
        <Avatar
            { ...this.props }
            medium
            rounded
            title= { initials }
            source={ pictureUrl == undefined ? undefined : {uri: pictureUrl} }
            //icon={ {name: 'fish', color: 'tomato'} }
            onPress={ onPress }
            activeOpacity={ 0.7 }
        />
    </View>
    );
  }
}
