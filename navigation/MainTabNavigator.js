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
import stackNavSettings from './StackNavigatorSettings';
import stackNaveUserProfile from './StackNavigatorUserProfile';

export default TabNavigator(
  {
    TabFeed: {
      screen: stackNavFeed,
      navigationOptions: {
        tabBarLabel: 'Feed'
      }
    },
    TabUserProfile: {
      screen: stackNaveUserProfile,
      navigationOptions: {
        tabBarLabel: 'Me'
      }
    },
    TabGameForm: {
      screen: stackNavGameForm,
      navigationOptions: {
        tabBarLabel: 'Add Game'
      }
    },
    TabTournaments: {
      screen: stackNavTournaments,
      navigationOptions: {
        tabBarLabel: 'Tournaments'
      }
    },
    TabSettings: {
      screen: stackNavSettings,
      navigationOptions: {
        tabBarLabel: 'Settings'
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
            iconName = 'md-home';
            break;
          case 'TabTournaments':
            iconName = 'ios-trophy';
            break;
          case 'TabUserProfile':
            iconName = 'md-person';
            break;
          case 'TabGameForm':
            iconName = 'md-add-circle';
            break;
          case 'TabSettings':
            iconName = 'md-settings';
            break;
        }
        return (
          <Ionicons
            name={iconName}
            size={28}
            style={{ marginBottom: -3 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      }
    }),
    tabBarOptions: {
      style: {
        backgroundColor: Colors.tabBar,
        height: 55,
        borderTopColor: 'white'
      },
      activeTintColor: Colors.tabIconSelected,
      showLabel: true
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarSelectedButtonColor: Colors.tabIconSelected,
    animationEnabled: false,
    swipeEnabled: false
  }
);

TabNavigator.propTypes = {
  focused: PropTypes.bool
};
