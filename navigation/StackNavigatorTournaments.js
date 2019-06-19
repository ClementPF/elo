import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import FeedScreen from '../screens/FeedScreen';
import TournamentCreationScreen from '../screens/TournamentCreationScreen';
import TournamentScreen from '../screens/TournamentScreen';
import TournamentsScreen from '../screens/TournamentsScreen';
import UserScreen from '../screens/UserScreen';

const stackNav = createStackNavigator(
  {
    Tournaments: {
      screen: TournamentsScreen
    },
    Tournament: {
      screen: TournamentScreen
    },
    TournamentCreation: {
      screen: TournamentCreationScreen
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

export default stackNav;
