/* eslint react/display-name: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from 'react-navigation';

import Colors from '../constants/Colors';

import Login from '../screens/Login';
import Login2 from '../screens/Login2';

export default createStackNavigator(
  {
    Login: {
      screen: Login
    },
    Login2: {
      screen: Login2
    }
  },
  {
    defaultNavigationOptions: {
      header: () => null,
      headerTitle: 'Login'
    }
  }
);
