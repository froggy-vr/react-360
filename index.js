import React from 'react';
import {
  AppRegistry,
  View,
} from 'react-360';

import firebase from './config'
import Game from './containers/Game'
import Login from './containers/Login'
import Highscore from './containers/Highscore'

let database = firebase.database()

export default class froggy_360 extends React.Component {
  state = {
    userId: '',
    login: false,
    gameRef: null
  };

  setUser = snapshot => {
    if(snapshot.val() === false){
        this.setState({userId: "", login: snapshot.val()})
    }
    else{
      this.setState({userId: userId, login: snapshot.val()})
    }
  }

  snapshotListener = userId => snapshot => {
    console.log(snapshot.val()," ini snapshot diluar")
    if(snapshot.val() === false){
      // database.ref(`/${userId}/user`).off()
      this.state.gameRef.off('value')
      // this.state.gameRef.removeEventListener(this.snapshotListener(userId))
      // .then(data => {
      //   console.log("masuk ke them di off")
      //   this.setState({userId: "", login: snapshot.val()})
      // })
    }
    else{
      this.setState({userId: userId, login: snapshot.val()})
    }
   }

  startGame = (userId) => {
    console.log('starting game', userId)
    this.setState({gameRef: database.ref(`/${userId}/user`)}, () => {
      this.state.gameRef.on('value', this.snapshotListener(userId))
    })}


  // componentWillUnmount() {
  //   this.state.gameRef.off()
  // }

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
