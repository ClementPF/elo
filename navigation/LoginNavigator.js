/* eslint react/display-name: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigator } from 'react-navigation';

import Colors from '../constants/Colors';

import Login from '../screens/Login';

export default StackNavigator(
  {
    Login: {
      screen: Login
    }
  },
  {
    navigationOptions: {
      header: () => null,
      headerTitle: 'Login'
    }
  }
);

StackNavigator.propTypes = {
  focused: PropTypes.bool
};
