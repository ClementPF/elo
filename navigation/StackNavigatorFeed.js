import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigator} from 'react-navigation'

import FeedScreen from '../screens/FeedScreen';
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
                color: 'white'
            },
            headerStyle: {backgroundColor:'black'}
        })
})

export default stackNavFeed;
