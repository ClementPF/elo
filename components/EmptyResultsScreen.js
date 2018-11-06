import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, Animated, Easing } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

export default class EmptyResultsScreen extends Component {
    static propTypes = {
      title: PropTypes.string,
      onPress: PropTypes.func
    }

    constructor(props) {
    super(props);
    this.height = new Animated.Value(0);
    this.animationTravel = 128;
  }

    componentWillMount(){
        //this.setState(Dimensions.get("window"));
        Dimensions.addEventListener('change', this.handler);
    }

      componentDidMount() {
        this.animateBar(true);
      }

      componentWillUnmount(){
          Dimensions.addEventListener('change', this.handler);
      }

      animateBar = (direction) => {
        const { value, index } = this.props;
        this.height.setValue(direction ? 0 : 1);
        Animated.timing(this.height, {
          toValue: !direction ? 0 : 1,
          delay: 0,
          duration: 1500,
          easing: Easing.in(Easing.sine)
      }).start(() => this.animateBar(!direction));
      };


    render(){
        const { title, onPress} = this.props;

        const animationHeight = this.height.interpolate({
          inputRange: [0, 1],
          outputRange: [0, this.animationTravel]
        });

        return (
            <View
                style={ [emptyScreenStyle.containerCallToAction, {flexDirection: 'column'} ] }>
                <View style={ [emptyScreenStyle.arrow , {'backgroundColor' : 'transparent'}] }/>
                <Button raised
                    title= { title }
                    icon={ {name: 'add'} }
                    buttonStyle= { emptyScreenStyle.callToActionButton }
                    onPress={ onPress }
                />
                <View style={ emptyScreenStyle.arrow }/>
                <View style={ [emptyScreenStyle.triangle] } />
                <Animated.View style={ {height: animationHeight} }/>
          </View>
        );
    }
}

emptyScreenStyle = StyleSheet.create({
    containerCallToAction:{
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },callToActionButton:  {
        backgroundColor: 'firebrick',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 10
    },arrow:  {
        flex: 2,
        width:2,
        backgroundColor: 'white'
    },triangle: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderLeftWidth: 16, // the base of the triangle
        borderRightWidth: 16, // the base of the triangle
        borderTopWidth: 16, // the height of the triangle
        borderColor: 'white',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent'
    }
});
