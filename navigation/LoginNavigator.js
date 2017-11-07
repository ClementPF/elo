/* eslint react/display-name: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigator } from 'react-navigation';

import Colors from '../constants/Colors';

import LinksScreen from '../screens/LinksScreen';
import Login from '../screens/Login';

export default StackNavigator(
    {
        Login: {
            screen: Login
        },
        Links: {
            screen: LinksScreen
        }
    },
    {
      navigationOptions: {
        header: () => null,
        headerTitle: 'Login yo',
      }
    }
);

StackNavigator.propTypes = {
    focused: PropTypes.bool
};
