import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import {Icon} from 'react-native-elements'

import PropTypes from 'prop-types';
import styles from './styles';

const Header = ({ onPress }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onPress} style={styles.button}>

<Icon
  name='rowing'/>
        </TouchableOpacity>
  </View>
);

Header.propTypes = {
  onPress: PropTypes.func,
};

export default Header;
