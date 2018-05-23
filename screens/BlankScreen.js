import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StatusBar,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';

class BlankScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object,
        dispatch: PropTypes.func,
        error: PropTypes.object,
    }

    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params;
        return {title: 'Your Title',
                headerTintColor: 'white'};
    };

    constructor(props) {
        super(props);
        const params = props.navigation.state.params;
        this.state = {
            loading: true,
            refreshing: false,
        };
    }

    componentWillMount() {
        this.fetchData();
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.error && !this.props.error) {
        this._onError('error', 'Error', nextProps.error);
      }
    }

    fetchData (){
        Promise.all([

            ]).then(() => {
                this.setState( {loading: false, refreshing: false} );
            });
    }

    _renderItem = ({item, index}) => {

    }

    _onRefresh() {
        this.setState({refreshing: true});
        this.fetchData();
    }

    _onError = error => {
        if (error) {
            this.dropdown.alertWithType('error', 'Error', error);
        }
    };

    _onClose(data) {
        // data = {type, title, message, action}
        // action means how the alert was closed.
        // returns: automatic, programmatic, tap, pan or cancel
    }

    render() {
        if(this.state.loading){
            return (
                <View style={ { flex: 1,
                    justifyContent: 'center'} }>
                    <ActivityIndicator  size="small" color="white"/>
                    <DropdownAlert
                        ref={ ref => this.dropdown = ref }
                        onClose={ data => this._onClose(data) } />
                </View>
            );
        }else{
            return (
                <View
                    style = { UserScreenStyle.container }>
                    <StatusBar translucent={ false } barStyle= "light-content" />
                    <DropdownAlert
                        ref={ ref => this.dropdown = ref }
                        onClose={ data => this._onClose(data) } />
                </View>
            );
        }
    }
}

UserScreenStyle = StyleSheet.create({
    container: {
    },
});

const mapStateToProps = ({ /*reducers*/ }) => {
    return { /*props*/ };
};

export default connect(mapStateToProps, { /*actions*/ })(BlankScreen);
