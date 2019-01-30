import React from 'react';
import {
  AppRegistry,
  Text,
  View,
  Animated,
  asset,
  NativeModules,
} from 'react-360';
import { Easing, DeviceEventEmitter } from'react-native'

import axios from '../helpers/axios'
import firebase from '../config'
import House from './components/House'
import Car from './components/Car'

const {AudioModule} = NativeModules;
const database = firebase.database()

DeviceEventEmitter.addListener('direction', direction => {
  direction = direction
})

export default class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      slideValue: new Animated.Value(0),
      slideValue2: new Animated.Value(0),
      depth: new Animated.Value(0),
      currentPos: 0,
      carsInitialIndex: [20, 10],
      houseInitialIndex: 40,
      yIndex: 1,
      adjustedX: 0,
      score: 0,
      jumped: false,
      highScore: 0,
      direction: '',
      aptColour: 0
    };
  }

  componentDidMount() {
    this.car1Animation();
    this.car2Animation();
    this.firebaseSubscribe();
    this.getHighScore();
    AudioModule.setEnvironmentalParams({
      volume: 0.3
    })
    this.directionListener();
  }
  
  componentWillMount() {
    this.setState({aptColour1: Math.floor(Math.random() * 3), aptColour2: Math.floor(Math.random() * 3), aptColour3: Math.floor(Math.random() * 3)})
  }

  componentWillUnmount() {
    this.clearUser()
    AudioModule.setEnvironmentalParams({
      muted: true
    })
  }

  directionListener = () =>{
    DeviceEventEmitter.addListener('direction', direction => {
      this.setState({
        direction
      })
    })
  }

  clearUser = () => {
    database.ref(`/${this.props.userId}/connected`).off()
    database.ref(`/${this.props.userId}/jump`).off()
    database.ref(`/${this.props.userId}`).remove()
  }

  getHighScore(){
    axios.get('/users/' + this.props.userId)
    .then(({data}) => {
      if(!data.user){
        axios.post(
          '/users/',
          {
            gameId: this.props.userId
          }
        )
        .then(({data}) => console.log(data, "New User"))
        .catch((err) => console.log(err))
      }
      this.setState({highScore: data.user.highScore})
    })
    .catch((err) => console.log(err, "Error in getHighScore"))
  }

  playJumpSFX = ( ) =>{
    AudioModule.playOneShot({
      source: asset('jumping-martian2.wav'),
      volume: 0.6
    });
  }

  playFailSFX = () =>{
    AudioModule.playOneShot({
      source: asset('fail.wav'),
      volume: 0.6
    });
  }

  playWinSFX = () =>{
    AudioModule.playOneShot({
      source: asset('win.mp3'),
      volume: 1
    });
  }

  firebaseSubscribe = () => {
    database.ref(`/${this.props.userId}/jump`).on('value', snapshot => {
      this.setState({ jumped: snapshot.val() })
      if (snapshot.val()) {     
        if(this.state.adjustedX < 8 && this.state.adjustedX > -8) {
          if(this.state.currentPos > this.state.houseInitialIndex - 20){
            this.playWinSFX()
          }
          else{
            this.playJumpSFX()
          }
          if(this.state.direction === 'left') this.moveLeft()
          else if(this.state.direction === 'right') this.moveRight()
          else this.getCloser()
        }
        else if(this.state.adjustedX === 8){
          if(this.state.direction === 'right') {
            this.moveRight()
            this.playJumpSFX()
          }
          else if(this.state.direction === 'forward') {
            if(this.state.currentPos > this.state.houseInitialIndex - 20){
              this.playWinSFX()
            }
            else{
              this.playJumpSFX()
            }
            this.getCloser()
          }
        }
        else if(this.state.adjustedX === -8){
          if(this.state.direction === 'left') {
            this.moveLeft()
            this.playJumpSFX()
          }
          else if(this.state.direction === 'forward') {
            if(this.state.currentPos > this.state.houseInitialIndex - 20){
              this.playWinSFX()
            }
            else{
              this.playJumpSFX()
            }
            this.getCloser()
          }
        }
      }
    })
  }

  getHit = () =>{
    this.playFailSFX()

    if(this.state.score > this.state.highScore){
      axios.patch('/users/' + this.props.userId, {highScore: this.state.score})
      .then(({data}) => this.setState({highScore: data.user.highScore}))
      .catch((err) => console.log(err))
    }

    this.setState({ depth: new Animated.Value(0), currentPos: 0, score: 0, adjustedX: 0 })
  }

  car1Animation(input) {
    setTimeout(() => {
      if (this.state.currentPos === this.state.carsInitialIndex[0]) {
        console.log("you're hit")
        this.getHit()
      }
    }, 1200)
    if(input > 50) input = 0;
    const newPosition = input || 0
    const velocity = ((50-newPosition)/50)*2000

    this.state.slideValue.setValue(newPosition);

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
        this.getHit()
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
    });
  }

  getCloser = () => {    
    
    let newValue = this.state.depth._value + 5
    let newPos = this.state.currentPos + 5

    console.log('new position', newPos)
    console.log('new depth', newValue)
    this.setState({
      currentPos: newPos
    })
    if (this.state.currentPos > this.state.houseInitialIndex - 15) {
      console.log('You won!')
      let newScore = this.state.score + 1

      this.setState({ depth: new Animated.Value(0), currentPos: 0, score: newScore, adjustedX: 0 }, () => {
        console.log(this.state.depth._value, 'new depth')
        Animated.spring(
          new Animated.Value(25),
          {
            toValue: 0,
            duration: 500,
            friction: 2, //default 7
            tension: 5 //default 40
          }
        ).start();
      })
    }
    else{
      Animated.spring(
        this.state.depth,
        {
          toValue: newValue,
          duration: 500,
          friction: 2, //default 7
          tension: 5 //default 40
        }
      ).start();

    }

  }
  moveLeft = () =>{
    console.log('move left')
    let newXPositionCar1 = this.state.slideValue._value + 4
    let newXPositionCar2 = this.state.slideValue2._value + 4

    this.car2Animation(newXPositionCar2)
    this.car1Animation(newXPositionCar1)
    this.setState({
      adjustedX: this.state.adjustedX + 4
    })
  }

  moveRight = () =>{
    console.log('move right')
    let newXPositionCar1 = this.state.slideValue._value - 4
    let newXPositionCar2 = this.state.slideValue2._value - 4

    this.car2Animation(newXPositionCar2)
    this.car1Animation(newXPositionCar1)
    this.setState({
      adjustedX: this.state.adjustedX - 4
    })
  }

  render() {

    return (
      <View >
        <Text
          style={{
            transform: [
              { translate: [4, 4, -4] },
              { rotateY: -20 }
            ],
            fontSize: 0.4
          }}
        >
          SCORE : {this.state.score}
        </Text>

        {/* APARTMENT MODELS  */}

        <House
          xIndex={-8 + this.state.adjustedX}
          yIndex={this.state.yIndex}
          houseInitialIndex={this.state.houseInitialIndex}
          depth={this.state.depth}
          randColourIndex={this.state.aptColour1}
        />

        <House
          xIndex={0 + this.state.adjustedX}
          yIndex={this.state.yIndex}
          houseInitialIndex={this.state.houseInitialIndex}
          depth={this.state.depth}
          randColourIndex={this.state.aptColour2}

        />

        <House
          xIndex={8 + this.state.adjustedX}
          yIndex={this.state.yIndex}
          houseInitialIndex={this.state.houseInitialIndex}
          depth={this.state.depth}
          randColourIndex={this.state.aptColour3}
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

AppRegistry.registerComponent('Game', () => Game);
