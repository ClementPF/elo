import React from 'react';
import PropTypes from 'prop-types';
import RivalryCard from '../components/RivalryCard';

const RivalryCardContainer = props => {
  const { rivalry } = props;
  const {
    user,
    rival,
    score,
    game_count,
    win_count,
    lose_count,
    win_streak,
    lose_streak,
    tie_streak,
    longuest_win_streak,
    longuest_lose_streak
  } = rivalry;
  var currentStreakType;
  if (rivalry.win_streak > 0) currentStreakType = 'Winning';
  else if (rivalry.lose_streak > 0) currentStreakType = 'Losing';
  else if (rivalry.tie_streak > 0) currentStreakType = 'Tie';
  return (
    <RivalryCard
      title={'RIVALRY'}
      username1={rivalry.user.username}
      username2={rival.username}
      pictureUrl1={user.picture_url}
      pictureUrl2={rival.picture_url}
      name1={'Total Points'}
      value1name1={score.toFixed(0)}
      value2name1={-score.toFixed(0)}
      name2={'Game Count'}
      value1name2={game_count}
      value2name2={game_count}
      name3={'Win Count'}
      value1name3={win_count}
      value2name3={lose_count}
      name4={'Current ' + currentStreakType + ' Streak'}
      value1name4={Math.max(win_streak, lose_streak, tie_streak)}
      value2name4={Math.min(win_streak, lose_streak, tie_streak)}
      name5={'Longest Win Streak'}
      value1name5={longuest_win_streak}
      value2name5={longuest_lose_streak}
    />
  );
};

RivalryCardContainer.propTypes = {
  rivalry: PropTypes.object.isRequired
};

export default RivalryCardContainer;
