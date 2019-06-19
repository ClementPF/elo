import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import UserScreen from '../screens/UserScreen';

const stackNavUserProfile = createStackNavigator(
  {
    UserProfile: {
      screen: UserScreen
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

export default stackNavUserProfile;
