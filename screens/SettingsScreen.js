import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {Button} from 'react-native-elements';
import {logoutUser} from '../api/login';
import DropdownAlert from 'react-native-dropdownalert';

import { invalidateData } from '../redux/actions/RefreshAction';
import { connect } from 'react-redux';

import { NavigationActions } from 'react-navigation';

import {API_CONF, API_ENDPOINTS} from '../api/config.js';

class SettingsScreen extends React.Component {

  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func
};

static navigationOptions = ({navigation}) => {
    const params = navigation.state.params;
    return {title: 'Settings'};
};

constructor(props) {
    super(props);
    this.state = {};
}

componentWillMount() {
    let packageMod = require('../package.json');
    this.setState(
        {'appVersion': packageMod.version + 'b' + packageMod.buildNumber
    });
}

_onPressRow = (rowID, rowData) => {
    logoutUser().then((response) => {
        this.navigateToLogin();
    }).catch((error) => {
        this.onError('Failed to log out ' + error);
    });
}

navigateToLogin() {
    const resetAction = NavigationActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({routeName: 'Login'})]
    });
    this.props.navigation.dispatch(resetAction);
}

onError = error => {
    if (error) {
        this.dropdown.alertWithType('error', 'Error', error);
    }
};

onClose(data) {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
}

render() {
    return (
            <View style={ {flex:1,
                justifyContent: 'center', alignItems: 'center', } } >
                <StatusBar translucent={ false } barStyle="dark-content" />
                <Text style= { { 'margin':16,  'justifyContent' : 'center', 'textAlign' : 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'white',} }> { this.state.text} </Text>

                <Button
                  title="LOGOUT"
                  titleStyle={ { fontWeight: '700' } }
                  buttonStyle={ settingsStyle.button }
                  onPress={ () => { this._onPressRow(); } }
                />
                <Text style= { {'textAlign' : 'center', color: 'white', position: 'absolute', bottom: 0, width: '100%'} }> { 'Version : ' + this.state.appVersion + (API_CONF.BASE_URL == API_CONF.BASE_LOCAL_URL ? 'L' : 'R')} </Text>
                <DropdownAlert
                    ref={ ref => this.dropdown = ref }
                    onClose={ data => this.onClose(data) } />
            </View>
        );
    }
}

settingsStyle = StyleSheet.create({
    button: {
        backgroundColor: 'tomato',
        width: 300,
        height: 45,
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 5,
        margin: 8
    }
});

const mapStateToProps = ({ userReducer }) => {
    //console.log('Settings - mapStateToProps userReducer:' + JSON.stringify(userReducer));
    return {
        user : userReducer.user,
        tournament: ( userReducer.games != null && userReducer.games.length > 0 ) ? userReducer.games[0].tournament : null};
};

export default connect(mapStateToProps, { })(SettingsScreen);
