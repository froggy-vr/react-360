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

import House from './containers/House'
import Car from './containers/Car'

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
      userId: 'testkevin',
      jumped: false,
    };

    // RCTDeviceEventEmitter.addListener('onReceivedInputEvent', e => {
			
		// 	// Log what event is happening
		// 	// console.log('Event type', e)

    //   console.log(VrHeadModel.rotation())

		// });
  }

  componentDidMount() {
    this.car1Animation();
    this.car2Animation();
    this.firebaseSubscribe();
  }

  firebaseSubscribe = () => {
    database.ref(`/${this.state.userId}/jump`).on('value', snapshot => {
      this.setState({ jumped: snapshot.val() })
      if (snapshot.val()) {
        let cameraOrientation = VrHeadModel.rotation()
        console.log(cameraOrientation)

        if(cameraOrientation[1] > 70 && cameraOrientation[1] < 110) this.moveLeft()
        if(cameraOrientation[1] < -70 && cameraOrientation[1] > -110) this.moveRight()
        else this.getCloser()
        
      }
    })
  }

  car1Animation(input) {
    setTimeout(() => {
      if (this.state.currentPos === this.state.carsInitialIndex[0]) {
        console.log("you're hit")
        this.setState({ depth: new Animated.Value(0), currentPos: 0 })
      }
    }, 1200)
    if(input > 50) input = 0;
    const newPosition = input || 0
    const velocity = ((50-newPosition)/50)*2000

    this.state.slideValue.setValue(newPosition);

    //car
    Animated.timing(
      this.state.slideValue,
      {
        toValue: 50,
        duration: velocity,
        easing: Easing.linear
      }
    ).start(() => {
      if (this.state.slideValue._value === 50) {
        this.car1Animation()
      } 
    }
    );
  }

  car2Animation(input) {
    setTimeout(() => {
      if (this.state.currentPos === this.state.carsInitialIndex[1]) {
        console.log("you're hit")
        this.setState({ depth: new Animated.Value(0), currentPos: 0 })
      }
    }, 1800)
    if(input > 50) input = 0;
    const newPosition = input || 0
    const velocity = ((50-newPosition)/50)*3000

    this.state.slideValue2.setValue(newPosition);

    Animated.timing(
      this.state.slideValue2,
      {
        toValue: 50,
        duration: velocity,
        easing: Easing.linear,
      }
    ).start(() => {
      if (this.state.slideValue2._value === 50) {
        this.car2Animation()
      } 
      // if () {
      //   asdfasdf
      // }
    });
  }

  getCloser = () => {    
    
    let newValue = this.state.depth._value + 5
    let newPos = this.state.currentPos + 5

    console.log('new position', newPos)
    this.setState({
      currentPos: newPos
    })
    if (this.state.currentPos === this.state.houseInitialIndex - 15) {
      console.log('You won!')
      let newScore = this.state.score + 1
      console.log(newScore, 'new')

      this.setState({ depth: new Animated.Value(0), currentPos: 0, score: newScore })
      console.log(this.state.score)
    }

    Animated.spring(
      this.state.depth,
      {
        toValue: newValue,
        duration: 500,
        friction: 2, //default 7
        tension: 5 //default 40
        // easing: Easing.bezier(.17,.67,1,.47)
      }
    ).start();

  }

  moveLeft = () =>{
    console.log('move left')
    let newXPositionCar1 = this.state.slideValue._value +10
    let newXPositionCar2 = this.state.slideValue2._value +10


    this.car2Animation(newXPositionCar2)
    this.car1Animation(newXPositionCar1)
    this.setState({
      adjustedX: this.state.adjustedX + 10
    })
  }

  moveRight = () =>{
    console.log('move right')
    let newXPositionCar1 = this.state.slideValue._value -10
    let newXPositionCar2 = this.state.slideValue2._value -10

    this.car2Animation(newXPositionCar2)
    this.car1Animation(newXPositionCar1)
    this.setState({
      adjustedX: this.state.adjustedX - 10
    })
  }


  render() {

    return (
      <View >

        <View style={{ transform: [{ translateZ: -3 }] }}>
          <VrButton onClick={this.moveLeft}>
            <Text style={{ 
              color: "red"
            }}>
            {this.state.text}
            </Text>
          </VrButton>
          <VrButton onClick={this.moveRight}>
            <Text style={{ 
              color: "red",
              // transform: [{translateX: 0.5}]
            }}>
            moveRight
            </Text>
          </VrButton>
          {/* <VrButton onClick={this.moveRight}>
            <Text style={{ 
              color: "red",
              // transform: [{translateX: +0.5}]
            }}>
            moveRight
            </Text>
          </VrButton> */}
        </View>

        <Text
          style={{
            transform: [
              { translate: [3, this.state.yIndex, -3] },
              { rotateY: -90 }
            ],
            fontSize: 0.4
          }}
        >
          SCOREBOARD : {this.state.score}
        </Text>

        {/* APARTMENT MODELS  */}

        <House
          xIndex={-8+this.state.adjustedX}
          yIndex={this.state.yIndex}
          houseInitialIndex={this.state.houseInitialIndex}
          depth={this.state.depth}
        />

        <House
          xIndex={0+this.state.adjustedX}
          yIndex={this.state.yIndex}
          houseInitialIndex={this.state.houseInitialIndex}
          depth={this.state.depth}
        />

        <House
          xIndex={8+this.state.adjustedX}
          yIndex={this.state.yIndex}
          houseInitialIndex={this.state.houseInitialIndex}
          depth={this.state.depth}
        />

        {/* CAR MODELS */}

        <Car
          yIndex={this.state.yIndex}
          carsInitialIndex={this.state.carsInitialIndex[0]}
          depth={this.state.depth}
          slideValue={this.state.slideValue}
        />

        <Car
          yIndex={this.state.yIndex}
          carsInitialIndex={this.state.carsInitialIndex[1]}
          depth={this.state.depth}
          slideValue={this.state.slideValue2}
        />

      </View>
    );
  }
};

AppRegistry.registerComponent('froggy_360', () => froggy_360);
