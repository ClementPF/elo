import React, { Component } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';

export default class SearchBar extends Component {
  static propTypes = {};

  render = () => {
    return (
      <View style={stylesSearchBar.container}>
        <Icon name="search" color="white" style={{ marginLeft: 4 }} />
        <TextInput
          {...this.props}
          style={stylesSearchBar.textInput}
          inlineImageLeft="search_icon"
          editable={true}
          placeholder="Search by name, @id or sports"
          placeholderTextColor="grey"
        />
      </View>
    );
  };
}

stylesSearchBar = StyleSheet.create({
  container: {
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: 'black',
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center'
  },
  textInput: {
    flex: 1,
    margin: 8,
    color: 'white'
  },
  placeHolderText: {
    color: 'lightgrey'
  }
});
