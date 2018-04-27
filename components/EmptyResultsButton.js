import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';

export default class EmptyResultsButton extends Component {
    static propTypes = {
      title: PropTypes.string,
      onPress: PropTypes.function,
    }

    render = () => {
        const { title, onPress} = this.props;

        return (
          <Button raised
              title= { title }
              icon={{name: 'add'}}
              buttonStyle= { {
                  backgroundColor: "tomato",
                  borderColor: "transparent",
                  borderWidth: 0,
                  borderRadius: 10
              } }
              onPress={onPress}/>
        );
    }
}
