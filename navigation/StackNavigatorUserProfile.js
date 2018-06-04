import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigator} from 'react-navigation'

import UserScreen from '../screens/UserScreen';
import GameScreen from '../screens/GameScreen';

const stackNavUserProfile = StackNavigator({
    UserProfile: {
        screen: UserScreen,
    },
    Game: {
        screen: GameScreen,
    },
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

export default stackNavUserProfile;
