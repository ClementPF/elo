import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import SettingsScreen from '../screens/SettingsScreen';

const stackNavSettings = createStackNavigator(
  {
    Settings: {
      screen: SettingsScreen
    }
  },
  {
    cardStyle: { backgroundColor: 'black' },
    headerMode: 'screen',
    defaultNavigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white'
      },
      headerStyle: { backgroundColor: 'black', borderBottomWidth: 0, elevation: 0 }
    })
  }
);

export default stackNavSettings;
