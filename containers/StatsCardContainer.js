import React from 'react';
import PropTypes from 'prop-types';
import StatsCard from '../components/StatsCard';

const StatsCardContainer = props => {
  const { stats } = props;
  const { score,best_score, win_streak, lose_streak, tie_streak, tournament, worst_rivalry, best_rivalry, longuest_win_streak, longuest_lose_streak, game_count } = stats;
  let currentStreakType;
  if (win_streak > 0) {
    currentStreakType = 'Winning';
  } else if (lose_streak > 0) {
    currentStreakType = 'Losing';
  } else if (tie_streak > 0) {
    currentStreakType = 'Tie';
  }

  return (
    <StatsCard
      title={tournament.display_name}
      name1="Score"
      value1={score.toFixed(0)}
      name2="Best Score"
      value2={best_score.toFixed(0)}
      name3="Game Count"
      value3={game_count}
      name4={`Current ${currentStreakType} Streak`}
      value4={Math.max(win_streak, lose_streak, tie_streak)}
      name5="Longest Winning Streak"
      value5={longuest_win_streak}
      name6="Longest Losing Streak"
      value6={longuest_lose_streak}
      name7="The Freaking Shark"
      value7={
        worst_rivalry == null
          ? '❌🦈'
          : `${worst_rivalry.rival.username} (${worst_rivalry.score.toFixed(0)})`
      }
      name8="The Smelly Fish"
      value8={
        best_rivalry == null
          ? '❌🎣'
          : `${best_rivalry.rival.username} (${best_rivalry.score.toFixed(0)})`
      }
    />
  );
};

StatsCardContainer.propTypes = {
  stats: PropTypes.object.isRequired
};

export default StatsCardContainer;
