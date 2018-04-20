import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigator} from 'react-navigation'

import FeedScreen from '../screens/FeedScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TournamentScreen from '../screens/TournamentScreen';
import TournamentsScreen from '../screens/TournamentsScreen';

const stackNavFeed = StackNavigator({
    Feed: {
        screen: FeedScreen,
    },
    Tournament: {
        screen: TournamentScreen
    },
    Settings: {
        screen: SettingsScreen
    }
    }
    ,
    {
        headerMode: 'screen',
        navigationOptions: () => ({
            headerTitleStyle: {
                fontWeight: 'bold',
                color: '#ffffff'
            },
            headerStyle: {backgroundColor:'#3c3c3c'}
        })
})

export default stackNavFeed;
