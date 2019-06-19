import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import FeedScreen from '../screens/FeedScreen';
import TournamentScreen from '../screens/TournamentScreen';
import TournamentsScreen from '../screens/TournamentsScreen';
import UserScreen from '../screens/UserScreen';

const stackNavFeed = createStackNavigator(
  {
    Feed: {
      screen: FeedScreen
    },
    Tournament: {
      screen: TournamentScreen
    },
    User: {
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

export default stackNavFeed;
