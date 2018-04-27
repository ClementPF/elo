import React, { Component } from "react";
import { SectionList } from "react-native";
import PropTypes from "prop-types";

export default class SearchableSectionlist extends Component {
  static INCLUDES = "includes";
  static WORDS = "words";

  getFilteredResults() {
    let { data, sections, type, searchProperty, searchTerm } = this.props;
    return data.filter(
      item =>
        type && type === SearchableFlatlist.WORDS
          ? new RegExp(`\\b${searchTerm}`, "gi").test(item[searchProperty])
          : new RegExp(`${searchTerm}`, "gi").test(item[searchProperty])
    );
  }

  getFilteredSections(){
      let { data, sections, type, searchProperty, searchTerm } = this.props;

      const filteredSections = sections;
      var i = 0;
      for (let section of sections) {
          filteredSections[i].data = section.data.filter(
            item =>
              type && type === SearchableFlatlist.WORDS
                ? new RegExp(`\\b${searchTerm}`, "gi").test(item[searchProperty])
                : new RegExp(`${searchTerm}`, "gi").test(item[searchProperty])
          );
          i++;
        }

        return filteredSections;
  }

  render() {
    return <SectionList {...this.props} data={this.getFilteredResults() } sections={this.getFilteredSections()} />;
  }
}

SearchableSectionlist.propTypes = {
  data: PropTypes.array.isRequired,
  searchProperty: PropTypes.string.isRequired,
  sections: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  type: PropTypes.string
};
