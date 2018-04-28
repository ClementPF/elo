import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigator} from 'react-navigation'

import GameFormUserScreen from '../screens/GameFormUserScreen';
import GameFormTournamentScreen from '../screens/GameFormTournamentScreen';
import GameFormResultScreen from '../screens/GameFormResultScreen';
import GameFormConfirmationScreen from '../screens/GameFormConfirmationScreen';

const stackNavGameForm = StackNavigator({
      GameFormTournament: {
         screen: GameFormTournamentScreen
      },
      GameFormUser: {
         screen: GameFormUserScreen
      },
      GameFormResult: {
         screen: GameFormResultScreen
      },
      GameFormConfirmation: {
         screen: GameFormConfirmationScreen
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

export default stackNavGameForm;
