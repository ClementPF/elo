import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

const OutcomesColumns = ({ outcomes }) => (
  <View style={styles.container}>
    <View style={styles.subContainer}>
      <Ionicons style={styles.icon} name="md-trophy" size={32} color={'gold'} />
      <View style={styles.horizontalSeparator} />
      {outcomes
        .filter(({ result }) => result === 'WIN')
        .map(o => (
          <Text style={styles.userLabel} key={o.username}>{`${o.username}`}</Text>
        ))}
    </View>
    <View style={styles.subContainer}>
      <Ionicons style={styles.icon} name="md-sad" size={32} color={'white'} />
      <View style={styles.horizontalSeparator} />
      {outcomes
        .filter(({ result }) => result === 'LOSS')
        .map(o => (
          <Text style={styles.userLabel} key={o.username}>{`${o.username}`}</Text>
        ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'white',
    margin: 4,
    padding: 8,
    borderRadius: 4
  },
  subContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  horizontalSeparator: {
    marginLeft: 16,
    marginRight: 16,
    height: 1,
    backgroundColor: 'white'
  },
  userLabel: {
    color: 'white',
    margin: 6,
    justifyContent: 'center',
    textAlign: 'center'
  },
  icon: { margin: 6, textAlign: 'center' }
});

OutcomesColumns.propTypes = {
  outcomes: PropTypes.array.isRequired
};

export default OutcomesColumns;
