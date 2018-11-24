import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';

import SettingsScreen from '../screens/SettingsScreen';

const stackNavSettings = StackNavigator(
  {
    Settings: {
      screen: SettingsScreen
    }
  },
  {
    cardStyle: { backgroundColor: 'black' },
    headerMode: 'screen',
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white'
      },
      headerStyle: { backgroundColor: 'black' }
    })
  }
);

export default stackNavSettings;
