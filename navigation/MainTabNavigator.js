/* eslint react/display-name: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

import Colors from '../constants/Colors';

import stackNavFeed from './StackNavigatorFeed';
import stackNavGameForm from './StackNavigatorGameForm';
import stackNavTournaments from './StackNavigatorTournaments';
import cameraScreen from '../screens/CameraScreen';

export default TabNavigator(
    {
        TabFeed: {
            screen: stackNavFeed,
            navigationOptions: {
                tabBarLabel: "Feeed",
            }
        },TabCamera: {
            screen: cameraScreen,
            navigationOptions: {
                tabBarLabel: "camera",
            }
        },
        TabGameForm: {
            screen: stackNavGameForm,
            navigationOptions: {
                tabBarLabel: "Add Game",
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
                    case 'TabCamera':
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
        tabBarOptions: {
             activeTintColor: 'black',
             showLabel: true,
        },
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'bottom',
        tabBarSelectedButtonColor: 'black',
        animationEnabled: false,
        swipeEnabled: false,
    }
);

TabNavigator.propTypes = {
    focused: PropTypes.bool
};
