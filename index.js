import React from 'react';
import {
  AppRegistry,
  View,
} from 'react-360';

import Game from './containers/Game'
import Login from './containers/Login'
import Highscore from './containers/Highscore'

export default class froggy_360 extends React.Component {
  state = {
    userId: '',
  };

  startGame =(userId) => {
    console.log('starting game', userId)
    this.setState({userId: userId, login:true})
  }

  render() {
    if(this.state.login) {
      return (
        <View >
          <Game userId={this.state.userId}/>
        </View>
      );
    }
    else {
      return (
        <View >
          <Login startGame={this.startGame}/>  
        </View>
      ); 
    }
  }
};

AppRegistry.registerComponent('froggy_360', () => froggy_360);
