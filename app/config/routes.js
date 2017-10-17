import React from 'react';
import { StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Home from '../screens/Home';
import GameForm from '../screens/GameForm';
import Login from '../screens/Login';
import {Icon} from 'react-native-elements';

const HomeStack = StackNavigator(
  {
    Home: {
      screen: Home,

      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Home',
        headerRight:   <Icon
          name='rowing'
          onPress={ () => navigation.navigate('GameForm', { title: 'Game'}) } />,
      }),
    },
  },
  {
    headerMode: 'none',
  },
);

const GameFormStack = StackNavigator({
  GameForm: {
    screen: GameForm,
    navigationOptions: ({ navigation }) => ({
      headerTitle: navigation.state.params.title,
    }),
  },
},
{
  headerMode: 'none',
    mode: 'modal',
});


const LoginStack =  StackNavigator({
    Login: {
      screen: Login,
      navigationOptions: {
        header: () => null,
        headerTitle: 'Login',
      },
    },
  },
  {
    headerMode: 'screen',
  },
);

export default StackNavigator(
  {
    Login: {
      screen: LoginStack,
    },
    Home: {
      screen: HomeStack,
    },
    GameForm: {
      screen: GameFormStack,
    },
  },
  {
    mode: 'card',
    headerMode: 'screen',
    cardStyle: { paddingTop: StatusBar.currentHeight },
  },
);
