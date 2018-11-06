import React, { Component } from 'react';
import { View, Animated, Image, Easing } from 'react-native';
import { Avatar } from 'react-native-elements';
import PropTypes from 'prop-types';

export default class AvatarCustom extends Component {
  static propTypes = {
      name: PropTypes.string,
      pictureUrl: PropTypes.string,
      onPress: PropTypes.func,
  }

  constructor () {
  super()
  this.spinValue = new Animated.Value(0)
  this.animatedValue = new Animated.Value(0)
}

  componentDidMount () {
  this.animate()
  this.spin()
}

animate () {
  this.animatedValue.setValue(0)
  Animated.timing(
    this.animatedValue,
    {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear
    }
);//.start()
}

spin () {
  this.spinValue.setValue(0)
  Animated.timing(
    this.spinValue,
    {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear
    }
);//.start(() => this.spin())
}

  render = () => {
    const { name, pictureUrl, onPress, borderColor, borderWidth} = this.props;

    let initials = name == null ? "XX" : (name.charAt(0) + name.charAt(name.indexOf('-') + 1)).toUpperCase();

    const spin = this.spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  })

  const marginLeft = this.animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200]
  })

    return (
        <Animated.View
        style={{
            marginLeft,

                padding: 6,
                backgroundColor: borderColor,
                borderRadius: 45,}}>

        <Animated.View
        style={{
          transform: [{rotate: spin}] }}
          >
          <Avatar
            //{ ...this.props }
            medium
            rounded
            title= { initials }
            //source={ pictureUrl == undefined ? undefined : {uri: pictureUrl} }
            //icon={ {name: 'fish', color: 'firebrick'} }
            onPress={ onPress }
            activeOpacity={ 0.7 }
        />
      </Animated.View>
      </Animated.View>
    );
  }
}
