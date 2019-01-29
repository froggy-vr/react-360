import React from 'react';
import {
  AppRegistry,
  View,
} from 'react-360';

import Game from './containers/Game'
import Login from './containers/Login'
import Highscore from './containers/Highscore'

import firebase from './config'
const database = firebase.database()

export default class froggy_360 extends React.Component {
  state = {
    userId: '',
    login: false
  };

  listenUser = userId => {
    database.ref(`/${userId}/connected`).on('value', snapshot => {
      this.setState({userId: snapshot.val() ? userId : '', login:snapshot.val()})
    })
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
          <Login listenUser={this.listenUser}/>  
        </View>
      ); 
    }
  }
};

AppRegistry.registerComponent('froggy_360', () => froggy_360);
