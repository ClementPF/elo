import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import { OutcomesColumns, TournamentRow } from '../components';
import { postGameForTournament } from '../api/tournament';
import QRCode from 'react-native-qrcode-svg';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { invalidateData, dataInvalidated } from '../redux/actions/RefreshAction';
import DropdownAlert from 'react-native-dropdownalert';
import { NavigationActions, StackActions } from 'react-navigation';

class GameFormQRScannerScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params;
    return { title: 'Scan the QR code', headerTintColor: 'white' };
  };

  constructor(props) {
    super(props);
    const { tournament, user } = props.navigation.state.params;
    this.state = {
      tournament,
      hasCameraPermission: null,
      scannedOutcomes: [
        {
          username: user.username,
          result: 'LOSS',
          tournamentName: tournament.name
        } /*,
        {
          username: 'charlotte-touvignon',
          result: 'WIN',
          tournamentName: tournament.name
        },
        {
          username: 'tushar-ranka',
          result: 'LOSS',
          tournamentName: tournament.name
        },
        {
          username: 'gwen-rdf',
          result: 'WIN',
          tournamentName: tournament.name
        }*/
      ],
      scanned: false,
      scanner: true
    };
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted'
    });
  }

  componentWillReceiveProps(nextProps) {
    //console.log('GameFormQRScannerScreen - componentWillReceiveProps ' + JSON.stringify(nextProps));

    if (nextProps.games != null && nextProps.games.length > 0) {
      this.setState({ tournament: this.props.games[0].tournament });
    }
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  onClose(data) {}

  onError = error => {
    if (error) {
      console.log(error);
      this.dropdown.alertWithType('error', 'Error', error);
    }
  };

  // called when navigating back from tournament selection
  returnData = tournament => {
    const { user } = this.state;
    this.setState({
      tournament,
      scannedOutcomes: [
        {
          username: user.username,
          result: 'LOSS',
          tournamentName: tournament.name,
          tournament: { name: tournament.name }
        }
      ]
    });
  };

  outcomesBuilder = o => {
    return <Text key={o.username} style={styles.text}>{`${o.username} ${o.tournamentName}`}</Text>;
  };

  postGame = () => {
    const { tournament, scannedOutcomes } = this.state;
    this.setState({ loading: true });

    console.log('navigation', this.props.navigation);

    postGameForTournament(tournament.name, scannedOutcomes)
      .then(game => {
        this.setState({ loading: false });
        const resetAction = StackActions.reset({
          index: 1,
          key: null,
          actions: [
            NavigationActions.navigate({ routeName: 'GameFormWinnerLooser' }),
            NavigationActions.navigate({
              routeName: 'GameFormResult',
              params: {
                game
              }
            })
          ]
        });
        this.props.navigation.dispatch(resetAction);

        //console.log("GameFormConfirmation - invalidating data");
        //this.props.invalidateData().then(() => this.props.dataInvalidated());

        this.props.invalidateData();
        this.props.dataInvalidated();
      })
      .catch(error => {
        this.setState({ loading: false });
        this.onError(error);
      })
      .done();
  };

  showAlertConfirmation = () => {
    const alertTitle = 'All Good ?';
    const alertMessage =
      "Make sure everything is right. Games can't be deleted or edited once submitted.";
    Alert.alert(
      alertTitle,
      alertMessage,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'Submit', onPress: this.postGame }
      ],
      { cancelable: true }
    );
  };

  render() {
    const {
      hasCameraPermission,
      scanned,
      scannedOutcomes,
      tournament,
      scanner,
      loading
    } = this.state;
    const { user, navigation } = this.props;

    const qrData = {
      username: user.username,
      tournament: { name: tournament.name },
      tournamentName: tournament.name,
      result: 'LOSS'
    };

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <TournamentRow
            tournament={tournament.display_name}
            tournamentIdName={tournament.name}
            sport={tournament.sport.name}
          />
          <Button
            icon={{ name: 'edit' }}
            title={'EDIT'}
            buttonStyle={styles.button}
            onPress={() => {
              navigation.navigate('GameFormTournament', {
                returnData: this.returnData
              });
            }}
          />
        </View>
        <View style={styles.separator} />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {scanner ? (
            <Button
              title={'Get Scanned'}
              buttonStyle={styles.button}
              onPress={() => {
                this.setState({ scanner: false });
              }}
            />
          ) : (
            <Button
              icon={{ name: 'photo-camera' }}
              title={'Scan'}
              buttonStyle={styles.button}
              onPress={() => {
                this.setState({ scanner: true });
              }}
            />
          )}
        </View>
        <View style={styles.barcodeContainer}>
          {!scanner ? (
            <View style={styles.QRContainer}>
              <Text style={styles.text}>{'Get Scanned by your team mate'}</Text>
              <QRCode value={JSON.stringify(qrData)} size={200} />
            </View>
          ) : scanned ? (
            <>
              <OutcomesColumns outcomes={scannedOutcomes} />
            </>
          ) : (
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          )}
        </View>
        <View style={styles.separator} />
        {scanned && scanner && (
          <Button
            icon={{ name: 'add' }}
            title={'Scan another player'}
            buttonStyle={styles.button}
            onPress={() => {
              this.setState({ scanned: false });
            }}
          />
        )}
        {scanner && (
          <Button
            loading={loading}
            enabled={!loading}
            title={'All good'}
            buttonStyle={styles.button}
            onPress={() => {
              this.setState({ scanned: true });
              this.showAlertConfirmation();
            }}
          />
        )}
        <DropdownAlert ref={ref => (this.dropdown = ref)} onClose={data => this.onClose(data)} />
      </View>
    );
  }

  handleBarCodeScanned2 = ({ type, data }) => {
    this.setState({ scanned: true });
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  handleBarCodeScanned = ({ type, data }) => {
    const requiredKeys = ['username', 'result', 'tournamentName'];
    const { scannedOutcomes, tournament } = this.state;
    this.setState({ scanned: true });

    const scannedData = JSON.parse(data);
    console.log('scannedData', scannedData);

    if (!requiredKeys.every(key => Object.keys(scannedData).includes(key))) {
      this.onError(
        'It does not appear to be a valid QR code for the SHARKULATOR ' + requiredKeys.join()
      );
    } else if (
      scannedData.tournamentName !== tournament.name ||
      scannedData.tournament.name !== tournament.name
    ) {
      this.onError(
        "It looks like you havn't selected the same tournament, get your fishes together guys!"
      );
    } else if (
      scannedOutcomes.filter(({ username }) => username === scannedData.username).length === 0
    ) {
      const concat = scannedOutcomes.concat([scannedData]);
      console.log('concat', concat);
      this.setState({ scannedOutcomes: concat });
      console.log(`Bar code with type ${type} and data ${data} !`);
    }
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start' },
  subContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: 8
  },
  barcodeContainer: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#CE2728',
    borderRadius: 10,
    margin: 6
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'black'
  },
  text: {
    margin: 16,
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  QRContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = ({ userReducer, refreshReducer }) => {
  console.log('userReducer', userReducer);
  //console.log('GameFormConfirmationScreen - mapStateToProps userReducer:' + JSON.stringify(userReducer) + ' refreshReducer : ' + JSON.stringify(refreshReducer));
  return {
    user: userReducer.user
  };
};

export default connect(
  mapStateToProps,
  { invalidateData, dataInvalidated }
)(GameFormQRScannerScreen);
