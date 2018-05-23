import React, { Component } from 'react';
import { SectionList, StyleSheet, } from 'react-native';
import PropTypes from 'prop-types';

export default class SearchableSectionlist extends Component {
  static INCLUDES = 'includes';
  static WORDS = 'words';

  getFilteredSections(){
      let { data, sections, type, searchProperty, searchTerm } = this.props;
      let filteredSections = sections;
      let i = 0;
      for (let section of sections) {
          filteredSections[i].data = section.data.filter(
            item =>
              type && type === SearchableFlatlist.WORDS
                ? new RegExp(`\\b${searchTerm}`, 'gi').test(item[searchProperty])
                : new RegExp(`${searchTerm}`, 'gi').test(item[searchProperty])
          );
          i++;
        }

        filteredSections = filteredSections.filter(section => section.data.length > 0);

        return filteredSections;
  }

  render() {
    return <SectionList { ...this.props }
        sections={ this.getFilteredSections() }
    />;
  }
}

searchableSectionList = StyleSheet.create({
    list: {
        marginRight: 8,
        marginLeft: 8
    },
    sectionHeaderText: {
        padding: 8,
        fontSize: 28,
        fontWeight: 'normal',
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'black'
    }
});

SearchableSectionlist.propTypes = {
  data: PropTypes.array.isRequired,
  searchProperty: PropTypes.string.isRequired,
  sections: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  type: PropTypes.string
};
