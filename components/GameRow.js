import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import Moment from 'moment';
import AvatarCustom from './AvatarCustom';
import RivalryRowsContainer from '../containers/RivalryRowsContainer';

export default class GameRow extends Component {
  static propTypes = {
    game: PropTypes.object
  };

  constructor() {
    super();
    this.fromValue = 196;
    this.toValue = 296;
    this.extendedHeight = new Animated.Value(this.fromValue);
    this.state = {
      showRivalry: false,
      rowExpended: false
    };
  }

  componentDidUpdate() {
    if (this.state.showRivalry && !this.state.rowExpended) {
      this.animateExpend();
    } else if (!this.state.showRivalry && this.state.rowExpended) {
      this.animateCollapse();
    }
  }

  shortenDateText(dateText) {
    let keyval_value = { an: '1', a: '1', ' few': '' };

    let keyval_unit = {
      ' seconds': 's',
      ' second': 's',
      ' minutes': 'm',
      ' minute': 'm',
      ' hours': 'h',
      ' hour': 'h',
      ' days': 'd',
      ' day': 'd',
      ' weeks': 'w',
      ' week': 'w',
      ' months': 'mo',
      ' month': 'mo',
      ' years': 'y',
      ' year': 'y'
    };

    for (key in keyval_unit) {
      // dateText = dateText.replace(key,keyval_unit[key]);
    }

    for (key in keyval_value) {
      // dateText = dateText.replace(key,keyval_value[key]);
    }
    return dateText;
  }

  animateExpend = () => {
    this.extendedHeight.setValue(this.fromValue);
    Animated.timing(this.extendedHeight, {
      toValue: this.toValue,
      duration: 500,
      easing: Easing.linear
    }).start(() => this.setState({ rowExpended: true }));
  };

  animateCollapse = () => {
    this.extendedHeight.setValue(this.toValue);
    Animated.timing(this.extendedHeight, {
      toValue: this.fromValue,
      duration: 500,
      easing: Easing.linear
    }).start(() => this.setState({ rowExpended: false }));
  };

  rivalryRows = (outcomes, tournamentName) => {
    const { showRivalry } = this.state;
    const {
      [0]: {
        user: { username: username }
      },
      [1]: {
        user: { username: rivalname }
      }
    } = outcomes;

    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: 'black',
            textAlignVertical: 'center'
          }}
        >
          RIVALRY
        </Text>
        <View
          style={{
            flex: 1,
            marginLeft: 16,
            marginRight: 16,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <RivalryRowsContainer
            username={username}
            rivalname={rivalname}
            tournamentName={tournamentName}
          />
        </View>
      </View>
    );
  };

  avatarOutcome = outcomes => {
    const color = outcomes[0].result === 'WIN' ? 'gold' : 'transparent';
    return (
      <>
        <Ionicons
          style={{ marginBottom: -9, padding: 0 }}
          name="md-trophy"
          size={32}
          color={color}
        />
        <AvatarCustom
          medium
          rounded
          name={outcomes[0].user.username}
          pictureUrl={outcomes[0].pictureUrl}
          activeOpacity={0.7}
          borderWidth={4}
          borderColor={color}
        />
        {outcomes.map(o => (
          <Text key={`${o.outcome_id}${o.user.user_id}`} style={styles.nameText}>
            {o.user.username}
          </Text>
        ))}
      </>
    );
  };

  teamOutcome = outcomes => {
    const trophyColor = outcomes[0].result === 'WIN' ? 'gold' : 'transparent';
    const borderColor = outcomes[0].result === 'WIN' ? 'gold' : 'lightgrey';
    const backgroundColor = outcomes[0].result === 'WIN' ? 'gold' : 'lightgrey';
    //const textColor = outcomes[0].result === 'WIN' ? 'white' : 'black';
    const textColor = 'black';
    const opacity = 0.85;
    return (
      <>
        <Ionicons
          style={{ opacity: opacity }}
          style={{ marginBottom: -9, padding: 0 }}
          name="md-trophy"
          size={32}
          color={trophyColor}
        />
        <View style={[styles.teamOutcomes, { borderColor: borderColor, opacity: opacity }]}>
          {outcomes.map(o => (
            <Text
              key={`${o.outcome_id}${o.user.user_id}`}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
              style={[styles.nameText, { color: textColor }]}
            >
              {o.user.username}
            </Text>
          ))}
        </View>
      </>
    );
  };

  outcomeColumn = outcomes => {
    return (
      <View style={styles.outcomeColumns}>
        {outcomes.length === 1 ? this.avatarOutcome(outcomes) : this.teamOutcome(outcomes)}
      </View>
    );
  };

  render = () => {
    const {
      game: {
        date,
        outcomes,
        tournament: { name, display_name: displayName }
      }
    } = this.props;

    const { showRivalry } = this.state;

    const value = outcomes[0].score_value;
    const winners = outcomes.filter(o => o.result === 'WIN');
    const losers = outcomes.filter(o => o.result === 'LOSS');
    const rivalryRows =
      outcomes.length > 2 || !showRivalry ? null : this.rivalryRows(outcomes, name);

    const leftOutcomes = winners;
    const rightOutcomes = losers;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        key={`${outcomes[0].outcome_id}`}
        onPress={() => {
          this.setState({ showRivalry: !(outcomes.length > 2) && !showRivalry });
        }}
      >
        <Animated.View style={[styles.container, { height: this.extendedHeight }]}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{value.toFixed(0)}</Text>
          </View>
          <View style={styles.gameContainer}>
            <Text style={styles.dateText}>{this.shortenDateText(Moment(date).fromNow(false))}</Text>
            <Text style={styles.tournamentText}>{displayName}</Text>
            <View style={{ flex: 4, flexDirection: 'row' }}>
              {this.outcomeColumn(leftOutcomes)}
              <View style={styles.vsContainer}>
                <Text style={styles.VSText}>{'VS'}</Text>
              </View>
              {this.outcomeColumn(rightOutcomes)}
            </View>
          </View>
          {rivalryRows}
        </Animated.View>
      </TouchableOpacity>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  gameContainer: {
    height: 164,
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  scoreContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  outcomeColumns: { flex: 2, flexDirection: 'column', alignItems: 'center' },
  vsContainer: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  dateText: {
    flex: 0.5,
    fontSize: 12,
    fontWeight: 'normal',
    color: 'black',
    textAlignVertical: 'center',
    alignSelf: 'flex-start'
  },
  tournamentText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlignVertical: 'center'
  },
  nameText: {
    fontWeight: 'normal',
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  VSText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#CE2728',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  scoreText: {
    fontSize: 200,
    fontWeight: 'bold',
    color: 'whitesmoke'
  },
  teamOutcomes: {
    padding: 8,
    borderRadius: 16,
    borderWidth: 6
  }
});
