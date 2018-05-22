import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigator} from 'react-navigation'

import UserScreen from '../screens/UserScreen';

const stackNavUserProfile = StackNavigator({
    UserProfile: {
        screen: UserScreen,
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
