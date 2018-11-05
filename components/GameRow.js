import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import Moment from 'moment';
import AvatarCustom from './AvatarCustom';
import RivalryRowsContainer from '../containers/RivalryRowsContainer';

export default class GameRow extends Component {

  static propTypes = {
    name1: PropTypes.string,
    pictureUrl1: PropTypes.string,
    result1: PropTypes.bool,
    name2: PropTypes.string,
    result2: PropTypes.bool,
    pictureUrl2: PropTypes.string,
    tournamentDisplayName: PropTypes.string,
    tournamentName: PropTypes.string,
    result: PropTypes.bool,
    value: PropTypes.number,
    date: PropTypes.number
  }

  constructor(){
      super();
      this.extendedHeight = new Animated.Value(180);
      this.state = {
          showRivalry : false,
          rowExpended : false
      }
  }

  componentDidUpdate() {
      if(this.state.showRivalry && !this.state.rowExpended ){
          this.animateExpend();
      }else if(!this.state.showRivalry && this.state.rowExpended){
          this.animateCollapse();
      }
  }

  shortenDateText(dateText) {

      let keyval_value = {'an':'1', 'a':'1', ' few':''};

      let keyval_unit = {
          ' seconds':'s',' second':'s',
          ' minutes':'m',' minute':'m',
          ' hours':'h',' hour':'h',
          ' days':'d',' day':'d',
          ' weeks':'w',' week':'w',
          ' months':'mo',' month':'mo',
          ' years':'y',' year':'y',
      };

      for ( key in keyval_unit) {
         // dateText = dateText.replace(key,keyval_unit[key]);
      }

      for ( key in keyval_value) {
         // dateText = dateText.replace(key,keyval_value[key]);
      }
      return dateText;
  }

    animateExpend = () => {
        this.extendedHeight.setValue(180);
      Animated.timing(this.extendedHeight, {
        toValue: 296,
        duration: 500,
        easing: Easing.linear
    }).start(() => this.setState({rowExpended: true}));
    };

    animateCollapse = () => {
        this.extendedHeight.setValue(296);
      Animated.timing(this.extendedHeight, {
        toValue: 180,
        duration: 500,
        easing: Easing.linear
    }).start(() => this.setState({rowExpended: false}));
    };

  render = () => {
    const { name1, name2,pictureUrl1,pictureUrl2, result1, result2, tournamentDisplayName,tournamentName, result, value,  date} = this.props;

    let strName1 = `${name1}`;
    let strName2 = `${name2}`;

    let rivalryRows = this.state.showRivalry ?
        <View style={ {flex: 1, flexDirection: 'column', alignItems: 'center'} }>
            <Text style={ {
                fontSize: 18,
                fontWeight: 'bold',
                color: 'black',
                textAlignVertical: 'center'
            } }>
                RIVALRY
            </Text>
            <View style={ {flex: 1, marginLeft : 16, marginRight: 16, flexDirection: 'row', alignItems: 'center'} }>
                <RivalryRowsContainer username={ name1 } rivalname={ name2 } tournamentName={ tournamentName }/>
            </View>
        </View> : <View/>;

    return (

        <TouchableOpacity
            onPress= { () => { this.setState({'showRivalry': !this.state.showRivalry});} }>

            <Animated.View style={ [styles.container, { height: this.extendedHeight }] }>
                <View style={ { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'} }>
                    <Text style={ styles.scoreText }>
                        { value.toFixed(0) }
                    </Text>
                </View>
                <View style={ styles.gameContainer }>

                    <Text style={ styles.dateText }>
                        { this.shortenDateText(Moment(date).fromNow(false))}
                    </Text>
                    <Text style={ styles.tournamentText }>
                        { tournamentDisplayName }
                    </Text>
                    <View style={ {flex: 4, flexDirection: 'row'} }>

                            <View style={ {flex: 2, flexDirection: 'column', alignItems: 'center'} }>

                                <Ionicons
                                        style= { { flex: 1 } }
                                        name="md-trophy"
                                        size={ 32 }
                                        color= { result1 ? 'gold' : 'transparent' } />

                                <AvatarCustom
                                    medium
                                    rounded
                                    name= { name1 }
                                    pictureUrl= { pictureUrl1 }
                                    activeOpacity={ 0.7 }
                                    borderWidth= { 4 }
                                    borderColor= { result1 ? 'gold' : 'transparent' }
                                />

                                <Text style={ styles.nameText }>
                                    { strName1  }
                                </Text>
                            </View>
                            <View style={ { flexDirection: 'column', alignItems: 'center', justifyContent: 'center'} }>
                                <Text style={ styles.VSText }>
                                    { 'VS' }
                                </Text>
                            </View>
                            <View style={ {flex: 2, flexDirection: 'column', alignItems: 'center'} }>

                                <Ionicons
                                        style= { { flex: 1 } }
                                        name="md-trophy"
                                        size={ 32 }
                                        color= { result2 ? 'gold' : 'transparent' }/>

                                <AvatarCustom
                                    medium
                                    rounded
                                    name= { name2 }
                                    pictureUrl= { pictureUrl2 }
                                    activeOpacity={ 0.7 }
                                    borderWidth= { 4 }
                                    borderColor= { result2 ? 'gold' : 'transparent' }
                                />

                                <Text style={ styles.nameText }>
                                    { strName2  }
                                </Text>
                                </View>
                    </View>
                </View>
                {
                    rivalryRows
                }
          </Animated.View>

        </TouchableOpacity>
    );
  }
}

styles = StyleSheet.create({
    container: {
        padding: 8,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    gameContainer: {
        padding: 8,
        height: 164,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    dateText: {
        flex: 0.5,
        fontSize: 12,
        fontWeight: 'normal',
        color: 'black',
        textAlignVertical: 'center',
        alignSelf: 'flex-start',
    },
    tournamentText: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        textAlignVertical: 'center'
    },
    nameText: {
        fontSize: 16,
        margin: 0,
        fontWeight: 'normal',
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    VSText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'tomato',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    scoreText: {
        fontSize: 200,
        fontWeight: 'bold',
        color: 'whitesmoke',
    }
});
