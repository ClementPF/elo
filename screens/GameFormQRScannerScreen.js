import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import DropdownAlert from 'react-native-dropdownalert';

export default class GameFormQRScannerScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    qrCodeRead: false,
  }

  constructor(props) {
      super(props);
      this.state = {
          tournament: props.navigation.state.params.tournament
      };
  }

  static navigationOptions = ({ navigation }) => {
      const  params = navigation.state.params;
      return {
          title: "Scan the QR code",
          headerTintColor: 'white'
      };
  };


  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
    }

    onClose(data) {
        // data = {type, title, message, action}
        // action means how the alert was closed.
        // returns: automatic, programmatic, tap, pan or cancel
    }

    onError = error => {
        if (error) {
            this.dropdown.alertWithType('error', 'Error', error);
        }
    };

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <BarCodeScanner
            onBarCodeRead={this._handleBarCodeRead}
            style={StyleSheet.absoluteFill}
          />
         <DropdownAlert
             ref={ref => this.dropdown = ref}
             onClose={data => this.onClose(data)} />
        </View>
      );
    }
  }


  _handleBarCodeRead = ({ type, data }) => {
      if(!this.state.qrCodeRead){
          let jsonData = JSON.parse(data);
          if(jsonData.tournament.name != this.state.tournament.name){
              this.onError("It looks like you havn't selected the same tournament, get your fishes together guys!")
          }else{
              this.setState({qrCodeRead: true});
              console.log(`Bar code with type ${type} and data ${data} !`);
              this.props.navigation.navigate('GameFormConfirmation', { tournament: jsonData.tournament , winner: jsonData.winner})
          }
      }
  }
}
