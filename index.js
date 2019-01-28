import React from 'react';
import {
  AppRegistry,
  Text,
  View,
  asset,
  Pano,
  Model,
  Animated,
  VrButton,
  VrHeadModel
} from 'react-360';

import {Easing} from'react-native'
import firebase from './config'

import Game from './containers/Game'
import Login from './containers/Login'

const database = firebase.database()

export default class froggy_360 extends React.Component {
  constructor() {
    super();
    this.state = {
      spin: new Animated.Value(0),
      slideValue: new Animated.Value(0),
      slideValue2: new Animated.Value(0),
      text: 'Click Me',
      depth: new Animated.Value(0),
      currentPos: 0,
      carsInitialIndex: [20, 10],
      houseInitialIndex: 40,
      yIndex: 1,
      adjustedX: 0,
      score: 0,
      userId: '',
      jumped: false,
      login: false
    };

    // RCTDeviceEventEmitter.addListener('onReceivedInputEvent', e => {
			
		// 	// Log what event is happening
		// 	// console.log('Event type', e)

    //   console.log(VrHeadModel.rotation())

		// });
  }



  

  
  


  startGame =(userId) => {
    console.log('starting game', userId)
    this.setState({userId: userId,login:true})
  }
  render() {
    if(this.state.login) {
      return (
        <View >
          <Game userId={this.state.userId}/>
        </View>
      );
    } else {
        return (
          <View >
            <Login startGame={this.startGame}/>  
          </View>
        ); 
    }
    
  }
};

AppRegistry.registerComponent('froggy_360', () => froggy_360);
