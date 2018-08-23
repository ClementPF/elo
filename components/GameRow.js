import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import Moment from 'moment';
import AvatarCustom from './AvatarCustom';

export default class GameRow extends Component {
  static propTypes = {
    name1: PropTypes.string,
    pictureUrl1: PropTypes.string,
    result1: PropTypes.bool,
    name2: PropTypes.string,
    result2: PropTypes.bool,
    pictureUrl2: PropTypes.string,
    tournament: PropTypes.string,
    result: PropTypes.bool,
    value: PropTypes.number,
    date: PropTypes.number,
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

  render = () => {
    const { name1, name2,pictureUrl1,pictureUrl2, result1, result2, tournament, result, value,  date} = this.props;

    let strName1 = `${name1}`;
    let strName2 = `${name2}`;

    return (

        <View style={ styles.container }>
            <View style={ { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'} }>
                <Text style={ styles.scoreText }>
                    { value.toFixed(0) }
                </Text>
            </View>
            <Text style={ styles.dateText }>
                { this.shortenDateText(Moment(date).fromNow(false))}
            </Text>
            <Text style={ styles.tournamentText }>
                { tournament }
            </Text>
            <View style={ {flex: 4, flexDirection: 'row'} }>

                    <View style={ {flex: 2, flexDirection: 'column', alignItems: 'center'} }>

                        <Ionicons name="md-trophy"
                                size={ 32 }
                                color= { result1 ? 'gold' : 'transparent' } />

                        <AvatarCustom
                            medium
                            rounded
                            name= { name1 }
                            pictureUrl= { pictureUrl1 }
                            activeOpacity={ 0.7 }
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
                        <Ionicons name="md-trophy"
                                size={ 32 }
                                color= { result2 ? 'gold' : 'transparent' }/>
                        <AvatarCustom
                            medium
                            rounded
                            name= { name2 }
                            pictureUrl= { pictureUrl2 }
                            activeOpacity={ 0.7 }
                            overlayContainerStyle={ {
                            borderWidth: 4,
                            borderColor: result2 ? 'gold' : 'transparent' } }
                        />

                        <Text style={ styles.nameText }>
                            { strName2  }
                        </Text>
                        </View>

            </View>
      </View>
    );
  }
}

styles = StyleSheet.create({
    container: {
        padding: 8,
        height: 164,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white'
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
        margin: 8,
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
