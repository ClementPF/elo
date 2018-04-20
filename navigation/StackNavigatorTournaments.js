import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigator} from 'react-navigation'

import FeedScreen from '../screens/FeedScreen';
import HomeScreen from '../screens/HomeScreen';
import TournamentCreationScreen from '../screens/TournamentCreationScreen';
import TournamentScreen from '../screens/TournamentScreen';
import TournamentsScreen from '../screens/TournamentsScreen';

const stackNav = StackNavigator({
    Tournaments: {
        screen: TournamentsScreen
    },
    Tournament: {
        screen: TournamentScreen
    },
    TournamentCreation: {
        screen: TournamentCreationScreen
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

export default stackNav;
