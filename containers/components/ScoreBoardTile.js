import React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-360';

export default class ScoreBoardTile extends React.PureComponent {
    render() {
        return (
            <View style={styles.scoreBoardTile}>
                <Text style={styles.scoreBoardName}> 
                    {`${this.props.index + 1}. ${this.props.person.gameId}`}
                </Text>
                <Text style={styles.scoreBoardScore}> 
                    {`${this.props.person.highScore}`}
                </Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    scoreBoardTile: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    scoreBoardName: {
        fontSize: 30, 
        color: '#549322',
        paddingRight: 20,
        fontWeight: 'bold'

    },
    scoreBoardScore: {
        fontSize: 30, 
        color: 'white',
        fontWeight: 'bold'
    }
});