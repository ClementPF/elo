import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigator} from 'react-navigation'

import FeedScreen from '../screens/FeedScreen';
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
                color: 'white'
            },
            headerStyle: {backgroundColor:'black'}
        })
})

export default stackNav;
