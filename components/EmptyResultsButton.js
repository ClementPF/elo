import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';

export default class EmptyResultsButton extends Component {
  static propTypes = {
    title: PropTypes.string,
    onPress: PropTypes.func
  };

  render = () => {
    const { title, onPress } = this.props;

    return (
      <Button
        raised
        style={{ marginTop: 10 }}
        title={title}
        icon={{ name: 'add' }}
        buttonStyle={{
          backgroundColor: '#CE2728',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 10
        }}
        onPress={onPress}
      />
    );
  };
}
