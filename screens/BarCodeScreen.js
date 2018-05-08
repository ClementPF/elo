import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';

export default class BarcodeScannerExample extends React.Component {
  state = {
    hasCameraPermission: null,
    qrCodeRead: false,
  }

  constructor(props) {
      super(props);
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
    }

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
        </View>
      );
    }
  }


  _handleBarCodeRead = ({ type, data }) => {
      //if(!this.state.qrCodeRead){
            let jsonData = JSON.parse(data);
          this.setState({qrCodeRead: true});
          console.log(`Bar code with type ${type} and data ${data} !`);
          this.props.navigation.navigate('GameFormConfirmation', { tournament: jsonData.tournament , winner: jsonData.winner})
      //}
  }
}
