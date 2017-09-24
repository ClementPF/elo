import { StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Home from '../screens/Home';
import GameForm from '../screens/GameForm';
import Login from '../screens/Login';

const HomeStack = StackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        header: () => null,
        headerTitle: 'Home',
      },
    },
  },
  {
    headerMode: 'screen',
  },
);

const GameFormStack = StackNavigator({
  GameForm: {
    screen: GameForm,
    navigationOptions: ({ navigation }) => ({
      headerTitle: navigation.state.params.title,
    }),
  },
});


const LoginStack = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: () => null,
      headerTitle: 'LOGIN',
    },
  },
});

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
    mode: 'modal',
    headerMode: 'none',
    cardStyle: { paddingTop: StatusBar.currentHeight },
  },
);
