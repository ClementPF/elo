import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  VictoryPie,
  VictoryChart,
  VictoryTheme,
  VictoryContainer,
  VictoryLabel,
  VictoryTooltip,
  VictoryLegend
} from 'victory-native';
import { View } from 'react-native';
import { Dimensions } from 'react-native';
import Svg from 'react-native-svg';

const RivalriesPieChart = prop => {
  const screenWidth = Dimensions.get('window').width;
  const { rivalries } = prop;
  const height = 250;

  //takers.map(item => { item.value = Math.abs(item.value); return item });
  const chart = (
    //<VictoryContainer width={screenWidth} height={screenWidth} viewBox = {`0 0 ${screenWidth} ${screenWidth}`}>
    <VictoryPie
      //standalone={false}
      colorScale={["#660000", "#CC0000", "#990000", "#FF0000", "#FF3333", "#FF6666", "#FF9999" ]}
      width={screenWidth}
      height={height}
      data={rivalries}
      startAngle={45}
      endAngle={405}
      radius={height / 2.5}
      labelRadius={height/ 3}
      //x="name"
      y="value"
      //labels={d => d.x + ' ' + d.y}
      labelComponent={<VictoryLabel style={{
          fill: 'white',
          fontSize: 12}}/>}
      //theme={VictoryTheme.material}
      style={{
        data: { color: 'white', strokeWidth: 4}
      }}
      padAngle={3}
      innerRadius={height / 4}
      /*
      events={[
        {
          target: 'data',
          eventHandlers: {
            onPress: () => {
              return [
                {
                  target: 'data',
                  mutation: props => {
                    const fill = props.style && props.style.fill;
                    return fill === '#c43a31' ? null : { style: { fill: '#c43a31' } };
                  }
                },
                {
                  target: 'labels',
                  mutation: props => {
                    return props.active
                      ? { active: false, text: null }
                      : { text: props.text, active: true };
                  }
                }
              ];
            }
          }
        }
    ]}*/
    />
    //</VictoryContainer>
  );
  return chart;
};

RivalriesPieChart.propTypes = {
  rivalries: PropTypes.array.isRequired
};

export default RivalriesPieChart;
