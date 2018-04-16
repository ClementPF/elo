/* eslint react/display-name: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import GameFormScreen from '../screens/GameFormScreen';
import stackNavFeed from './StackNavigatorFeed';
import stackNavTournaments from './StackNavigatorTournaments';

export default TabNavigator(
    {
        TabFeed: {
            screen: stackNavFeed,
            navigationOptions: {
                tabBarLabel: "Feed",
            }
        },
        TabGameForm: {
            screen: GameFormScreen,
            headerMode: 'screen',
            navigationOptions: {
                tabBarLabel: "Add Match",
                headerTitleStyle: {
                    fontWeight: 'bold',
                    color: '#ffffff'
                },
                headerStyle: {backgroundColor:'#3c3c3c'}
            }
        },
        TabTournaments: {
            screen: stackNavTournaments,
            navigationOptions: {
                tabBarLabel: "Tournaments",
            }
        }
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused }) => {
                const { routeName } = navigation.state;
                let iconName;
                switch (routeName) {
                    case 'TabFeed':
                        iconName =
                        Platform.OS === 'ios'
                            ? `ios-information-circle${ focused ? '' : '-outline' }`
                            : 'md-information-circle';
                        break;
                    case 'TabTournaments':
                      iconName = 'ios-trophy';
                    break;
                    case 'TabGameForm':
                        iconName = 'md-add-circle';
                        break;
                }
                return (
                    <Ionicons
                        name={ iconName }
                        size={ 28 }
                        style={ { marginBottom: -3 } }
                        color={ focused ? Colors.tabIconSelected : Colors.tabIconDefault }
                    />
                );
            },
        }),
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: false,
    }
);

TabNavigator.propTypes = {
    focused: PropTypes.bool
};
