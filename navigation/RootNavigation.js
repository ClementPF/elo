import { Notifications } from 'expo';
import React from 'react';
import PropTypes from 'prop-types';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { View } from 'react-native';
import LoginNavigator from './LoginNavigator';
import MainTabNavigator from './MainTabNavigator';
import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';
import DropdownAlert from 'react-native-dropdownalert';
import { invalidateData, dataInvalidated } from '../redux/actions/RefreshAction';
import { connect } from 'react-redux';

const RootSwitchNavigator = createSwitchNavigator(
  {
    Login: {
      screen: LoginNavigator
    },
    Main: {
      screen: MainTabNavigator
    }
  },
  { headerMode: 'none' }
);

const AppContainer = createAppContainer(RootSwitchNavigator);

class RootNavigator extends React.Component {
  static propTypes = {
    invalidateData: PropTypes.func,
    dataInvalidated: PropTypes.func
  };

  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();

    /*    var that = this;
        setTimeout(function() {
                var data = {title:"plop",message:"plopMess"};
                that._handleNotification({origin:"",data:data});
        }, 5000);*/
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js

    //registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = ({ origin, data }) => {
    this.dropdown.alertWithType('success', data.title, data.message);

    //if(data){
    this.props.invalidateData();
    this.props.dataInvalidated();
    //}
  };

  onClose(data) {
    // data = {type, title, message, action}
    // action means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <AppContainer />
        <DropdownAlert ref={ref => (this.dropdown = ref)} onClose={data => this.onClose(data)} />
      </View>
    );
  }
}

const mapStateToProps = ({ refreshReducer }) => {
  console.log('RootNavigator - mapStateToProps refreshReducer : ' + JSON.stringify(refreshReducer));
  return {};
};

export default connect(
  mapStateToProps,
  { invalidateData, dataInvalidated }
)(RootNavigator);
