import React, {PureComponent} from 'react';
import {
    AppRegistry,
    Text,
    View,
    StyleSheet
} from 'react-360';

import axios from '../helpers/axios'
import sorting from '../helpers/sort'
import ScoreBoardTile from './components/ScoreBoardTile'

export default class Highscore extends PureComponent {

    state = { 
        highscores: [{
            gameId: "Bob",
            highScore: 2
        },{
            gameId: "Goop",
            highScore: 5
        }]
    }

    componentDidMount = () => {
        this.getScores()
    }

    getScores() {
        axios.get('/users/')
        .then( res => {
            let sortedScores = res.data.users.sort(sorting).slice(0,5)
            console.log(sortedScores, 'ini sortedscores')
            this.setState({highscores: sortedScores})
        })
        .catch( err => {
            console.log(err, "ini err message di getScores")
        })
    }

    render() {
        return (
            <View style={styles.scoreBoard}>
                <Text style={styles.scoreBoardTitle}> 
                    Scoreboard:
                </Text>
                { this.state.highscores.map( (person, index) => (
                    <ScoreBoardTile 
                        index={index}
                        person={person}
                        key={index}
                    />
                ))}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    scoreBoard: {
        padding: 5,
        borderColor: '#639dda',
        borderWidth: 2,
        borderRadius: 10,
        transform: [{translateX:2}]
    },
    scoreBoardTitle: {
        fontSize: 30, 
        color: 'white',
        fontWeight: 'bold',
    }
});

AppRegistry.registerComponent('Highscore', () => Highscore);
