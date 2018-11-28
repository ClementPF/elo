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

class RivalriesPieChart extends Component {
  constructor(props) {
    super(props);
    const { rivalries } = props;
    this.height = 250;
    this.screenWidth = Dimensions.get('window').width;
    this.state = {
      // if there is only one rivalry we don't animate
      animatedRivalries:
        rivalries.length > 1
          ? JSON.parse(JSON.stringify(rivalries)).map((elem, index) => {
              elem.value = 1;
              return elem;
            })
          : rivalries,
      rivalries
    };
  }

  componentDidMount() {
      this.animatorTimer = setTimeout(this.startAnimation,1000);
  }

  componentWillUnmount() {
    if (this.animatorTimer) {
      clearTimeout(this.animatorTimer);
      this.animatorTimer = 0;
    }
  }

  startAnimation = () => {
      this.animatorTimer = setTimeout(() => {
        this.setState({ animatedRivalries: this.state.rivalries });
      }, 500);
  }

  render() {
    //takers.map(item => { item.value = Math.abs(item.value); return item });
    const chart = (
      //<VictoryContainer width={screenWidth} height={screenWidth} viewBox = {`0 0 ${screenWidth} ${screenWidth}`}>
      <VictoryPie
        //standalone={false}
        animate={{ duration: 1500 }}
        colorScale={['#660000', '#CC0000', '#990000', '#FF0000', '#FF3333', '#FF6666', '#FF9999']}
        width={this.screenWidth}
        height={this.height}
        data={this.state.animatedRivalries}
        startAngle={45}
        endAngle={405}
        radius={this.height / 2.5}
        labelRadius={this.height / 3}
        //x="name"
        y="value"
        //labels={d => d.x + ' ' + d.y}
        labelComponent={
          <VictoryLabel
            style={{
              fill: 'white',
              fontSize: 12
            }}
          />
        }
        //theme={VictoryTheme.material}
        style={{
          data: { color: 'white', strokeWidth: 4 }
        }}
        padAngle={3}
        innerRadius={this.height / 4}
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
  }
}

RivalriesPieChart.propTypes = {
  rivalries: PropTypes.array.isRequired,
};

RivalriesPieChart.defaultProps = {
};

export default RivalriesPieChart;
