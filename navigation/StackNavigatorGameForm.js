import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {StackNavigator} from 'react-navigation'

import GameFormUserScreen from '../screens/GameFormUserScreen';
import GameFormTournamentScreen from '../screens/GameFormTournamentScreen';
import GameFormWinnerLooserScreen from '../screens/GameFormWinnerLooserScreen';
import GameFormQRCodeScreen from '../screens/GameFormQRCodeScreen';
import GameFormQRScannerScreen from '../screens/GameFormQRScannerScreen';
import GameFormResultScreen from '../screens/GameFormResultScreen';
import GameFormTieScreen from '../screens/GameFormTieScreen';
import GameFormConfirmationScreen from '../screens/GameFormConfirmationScreen';

const stackNavGameForm = StackNavigator({
    GameFormWinnerLooser: {
        screen: GameFormWinnerLooserScreen
    },
    GameFormTournament: {
        screen: GameFormTournamentScreen
    },
    GameFormQRCode: {
        screen: GameFormQRCodeScreen
    },
    GameFormTie: {
        screen: GameFormTieScreen
    },
    GameFormQRScanner: {
        screen: GameFormQRScannerScreen
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
}, {
    cardStyle: {
        backgroundColor: 'black'
    },
    headerMode: 'screen',
    navigationOptions: () => ({
        headerTitleStyle: {
            fontWeight: 'bold',
            color: 'white'
        },
        headerStyle: {
            backgroundColor: 'black'
        }
    })
})

export default stackNavGameForm;
