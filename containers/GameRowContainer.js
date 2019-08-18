import React from 'react';
import PropTypes from 'prop-types';
import GameRow from '../components/GameRow';

const GameRowContainer = props => {
  const { game } = props;
  const userProps = props.user;
  const { outcomes, tournament } = game;
  const userPropsOutcomeIndex = outcomes[0].user.username == userProps.username ? 0 : 1;
  const opponentOutcomeIndex = outcomes[0].user.username == userProps.username ? 1 : 0;
  return (
    <GameRow
      game={game}
      name1={outcomes[userPropsOutcomeIndex].user.username}
      name2={outcomes[opponentOutcomeIndex].user.username}
      pictureUrl1={outcomes[userPropsOutcomeIndex].user.picture_url}
      pictureUrl2={outcomes[opponentOutcomeIndex].user.picture_url}
      result1={outcomes[userPropsOutcomeIndex].win}
      result2={outcomes[opponentOutcomeIndex].win}
      tournamentDisplayName={tournament.display_name}
      tournamentName={tournament.name}
      value={outcomes[userPropsOutcomeIndex].score_value}
      date={game.date}
    />
  );
};

GameRowContainer.propTypes = {
  game: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default GameRowContainer;
