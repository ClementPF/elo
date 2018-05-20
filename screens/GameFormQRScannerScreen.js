import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {BarCodeScanner, Permissions} from 'expo';
import DropdownAlert from 'react-native-dropdownalert';
import TournamentRow from '../components/TournamentRow';

export default class GameFormQRScannerScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params;
        return {title: 'Scan the QR code', headerTintColor: 'white'};
    };

    constructor(props) {
        super(props);
        this.state = {
            tournament: props.navigation.state.params.tournament
        };
    }

    state = {
        hasCameraPermission: null,
        qrCodeRead: false
    }

    async componentWillMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === 'granted'
        });
    }

    componentWillReceiveProps(nextProps) {

        console.log('GameFormQRCodeScreen - componentWillReceiveProps ' + JSON.stringify(nextProps));

        if (nextProps.games != null && nextProps.games.length > 0) {
            this.setState({'tournament': this.props.games[0].tournament});
        }
    }

    onClose(data) {
        this.setState({qrCodeRead: false});
    }

    onError = error => {
        if (error) {
            this.dropdown.alertWithType('error', 'Error', error);
        }
    };

    // called when navigating back from tournament selection
    returnData(data) {
        this.setState({tournament: data});
    }

    _handleBarCodeRead = ({type, data}) => {
        if (!this.state.qrCodeRead) {
            let jsonData = JSON.parse(data);
            this.setState({qrCodeRead: true});
            if (jsonData.tournament.name != this.state.tournament.name) {
                this.onError('It looks like you havn\'t selected the same tournament, get your fishes together guys!')
            } else {
                console.log(`Bar code with type ${type} and data ${data} !`);
                this.props.navigation.navigate('GameFormConfirmation', {
                    tournament: jsonData.tournament,
                    winner: jsonData.winner
                })
            }
        }
    }

    render() {
        const {hasCameraPermission} = this.state;

        if (hasCameraPermission === null) {
            return <Text>Requesting for camera permission</Text>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={ {
                    flex:1,
                    backgroundColor:'white',
                    justifyContent: 'center',
                    alignItems: 'center'} } >

                    <View style={ {
                        width:'100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 8} }>

                        <TournamentRow
                            tournament= { this.state.tournament.display_name }
                            tournament_id_name= { this.state.tournament.name }
                            sport= { this.state.tournament.sport.name }
                        />
                        <Button
                            icon={ {name: 'edit'} }
                            title= { 'EDIT' }
                            buttonStyle= { {
                                backgroundColor: 'tomato',
                                borderColor: 'transparent',
                                borderWidth: 0,
                                borderRadius: 10 } }
                                onPress={ () => {
                                    this.props.navigation.navigate('GameFormTournament',  {returnData: this.returnData.bind(this)});
                                } }
                        />
                    </View>
                    <View style={ {
                        width:'100%',
                        height:1,
                        backgroundColor: 'black',} }
                    />
                    <View style={ {flex:1,
                             backgroundColor:'white',
                             width:'100%',
                             justifyContent: 'center',
                             alignItems: 'center'} } >

                             <BarCodeScanner
                                 onBarCodeRead={ this._handleBarCodeRead }
                                 style={ StyleSheet.absoluteFill }/>
                    </View>
                    <DropdownAlert
                        ref={ ref => this.dropdown = ref }
                        onClose={ data => this.onClose(data) } />
                </View>
            );
        }
    }
}

GameFormQRScannerScreen.propTypes = {
   error: PropTypes.object,
   games: PropTypes.object,
   navigation: PropTypes.object,
};
