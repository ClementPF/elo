import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';
import {Card} from 'react-native-elements'
import {postGameForTournament, getUsersForTournament} from '../api/tournament'
import GameRow from '../components/GameRow';

class GameFormResultScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object,
        dispatch: PropTypes.func,
        //gameValue: PropTypes.string
    };

    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params;
        return {title: navigation.state.params.name};
    };

    constructor(props) {
        super(props);
        this.state = {
            game: props.navigation.state.params.game,
            winner: props.navigation.state.params.winner,
            tournament: props.navigation.state.params.tournament
        };
    }

    componentWillMount() {

        console.log("componentWillMount");
    }

    render() {
        return (
            <View style={{flex:1}}>
                <Card title="RESULTS">
                    <GameRow
                        name1= { this.state.game.outcomes[0].user_name }
                        name2= { this.state.game.outcomes[1].user_name }
                        tournament= { this.state.game.tournament_name }
                        result= { this.state.game.outcomes[1].result }
                        value= { this.state.game.outcomes[0].score_value }
                        date= { this.state.game.date }
                    />
                </Card>
            </View>
    );
  }
}

export default GameFormResultScreen;
