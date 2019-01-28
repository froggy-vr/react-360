import React, {PureComponent} from 'react';
import {
    AppRegistry,
    Text,
    View,
} from 'react-360';

import axios from '../helpers/axios'

export default class Highscore extends PureComponent {

    state = { 
        highscores: [{
            gameId: "",
            highScore: 2
        },{
            gameId: "",
            highScore: 5
        }]
    }

    componentDidMount = () => {
        this.getScores()
    }

    getScores() {
        axios.get('/users/')
        .then( res => {
            let sortedScores = res.data.users.sort((a, b) => {
                return a.highScore - b.highScore
            })
            console.log(sortedScores, 'ini sortedscores')
            this.setState({highscores: sortedScores})
        })
        .catch( err => {
            console.log(err, "ini err message di getScores")
        })
    }

    render() {
        return (
            <View>
                <Text style={{fontSize: 30, color: 'yellow'}}> 
                    Scoreboard:
                </Text>
                { this.state.highscores.map( (person, index) => (
                    <Text style={{fontSize: 30, color: 'yellow'}}> 
                        {`${index + 1}. ${person.gameId} - ${person.highScore}`}
                    </Text>
                ))}
            </View>
        );
    }
};

AppRegistry.registerComponent('Highscore', () => Highscore);
