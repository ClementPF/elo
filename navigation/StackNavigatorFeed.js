import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigator} from 'react-navigation'

import FeedScreen from '../screens/FeedScreen';
import TournamentScreen from '../screens/TournamentScreen';
import TournamentsScreen from '../screens/TournamentsScreen';
import UserScreen from '../screens/UserScreen';
import GameScreen from '../screens/GameScreen';

const stackNavFeed = StackNavigator({
    Feed: {
        screen: FeedScreen,
    },
    Tournament: {
        screen: TournamentScreen
    },
    User: {
        screen: UserScreen
    },
    Game: {
        screen: GameScreen
    }
    }
    ,
    {
        cardStyle:{backgroundColor:'black' },
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
