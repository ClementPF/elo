import React, { PropTypes } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

import styles from './styles';
import Icon from './Icon';

const ListItem = ({ key, index, text, subText, onPress, checkmark = true, selected = false, visible = true }) => (
  <TouchableHighlight onPress={onPress} underlayColor={styles.$underlayColor}>
    <View style={styles.row}>
      <Text style={styles.text}>{index} . {text}</Text>
    <Text style={styles.text}>{subText.toFixed(0)}</Text>
    </View>
  </TouchableHighlight>
);

ListItem.propTypes = {
  key: PropTypes.number,
  index: PropTypes.number,
  text: PropTypes.string,
  subText: PropTypes.number,
  onPress: PropTypes.func,
  checkmark: PropTypes.bool,
  selected: PropTypes.bool,
  visible: PropTypes.bool,
};

export default ListItem;
