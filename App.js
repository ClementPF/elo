import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StatusBar, StyleSheet, View, SafeAreaView } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';

import { Provider } from 'react-redux';
import configureStore from './redux/store/configureStore';
import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './redux/reducers';
import { getUser } from './redux/actions';

const store = configureStore();

export default class App extends React.Component {
    state = {
        isLoadingComplete: false,
    };

    _loadResourcesAsync = async () => {
        return Promise.all();
    };

    _handleFinishLoading = () => {
        this.setState({ isLoadingComplete: true });
    };

    render() {
        return (
            <Provider store={ store }>
                <SafeAreaView style={ styles.safeArea }>
                    <View style={ styles.container }>
                        { Platform.OS === 'ios' && <StatusBar barStyle="light-content" /> }
                        { Platform.OS === 'android' && <View style={ styles.statusBarUnderlay } /> }
                        <RootNavigation />
                    </View>
                </SafeAreaView>
            </Provider>
        );
    }
}

App.propTypes = {
    skipLoadingScreen: PropTypes.bool
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000'
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    statusBarUnderlay: {
        height: 24,
        backgroundColor: 'rgba(0,0,0,0.2)',
    }
});
