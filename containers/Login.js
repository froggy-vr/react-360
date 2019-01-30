import React from 'react';
import {
    AppRegistry,
    Text,
    View,
    VrButton,
    StyleSheet,
    NativeModules,
    Image,
    Animated,
    asset
} from 'react-360';

const {AudioModule} = NativeModules;
import { Easing } from 'react-native'
import firebase from '../config'

//react-360 keyboard https://github.com/danielbuechele/react-360-keyboard
import { registerKeyboard } from 'react-360-keyboard';
AppRegistry.registerComponent(...registerKeyboard);

const database = firebase.database()

export default class Login extends React.Component {
    state = {
        userId: '',
        titleLocation: new Animated.Value(0),
        crawlLocation: new Animated.Value(0),
        display: 'flex',
        showKeyboard: false
    }
    componentDidMount() {
        this.titleAnimation()
    }
    titleAnimation() {
        Animated.spring(
            this.state.titleLocation,
            {
                toValue: -0.1,
                duration: 800,
                friction: 2,
                tension: 1,
            }
        ).start();
    }
    crawlAnimation() {
        this.state.crawlLocation.setValue(0);
        Animated.timing(
            this.state.crawlLocation,
            {
                toValue: -10,
                duration: 60000,
                easing: Easing.linear
            }
        ).start(() => {
            this.setState({
                display: 'none'
            })
        });
    }
    onClick = () => {
        this.playMusic()
        this.crawlAnimation()
        this.setState({showKeyboard: true}, () => {
            NativeModules.Keyboard.startInput({
                placeholder: this.state.userId || 'Enter your name',
                emoji: false
            }).then(input => {
                this.setState({
                    userId: input,
                    showKeyboard: false
                }, () => {
                    this.props.listenUser(this.state.userId)
                })
            });
        })
    }

    playMusic = () =>{
        AudioModule.playEnvironmental({
            source: asset('starWars.mp3'),
            volume: 1,
          });
    }

    render() {
        const AnimatedText = Animated.createAnimatedComponent(Text);
        return (
            <View style={{ transform: [{ translateZ: -2 }, { translateY: 0.6 }, { translateX: -0.3 }] }}>
                <View style={{
                    transform: [{ translateZ: 1 }],
                    flexDirection: 'row'
                }}>

                    <AnimatedText style={{ transform: [{ translateY: this.state.titleLocation }] }}>
                        Welcome To VR
                    </AnimatedText>
                    <Image
                        source={asset('frog.png')}
                        style={{
                            height: 0.2,
                            width: 0.2,
                            transform: [{ translateY: -0.06 }]
                        }}
                    />
                    <AnimatedText style={{ transform: [{ translateY: this.state.titleLocation }, {translateX: -0.02}] }}>
                        GGY
                    </AnimatedText>
                </View>

                    <View>
                        <VrButton onClick={this.onClick} style={styles.inputBox}>
                            <Text>{this.state.userId || 'Enter your name'}</Text>
                        </VrButton>
                        <View 
                            style={{
                                height: 1.2,
                                width: 1.2,
                                transform: [{ translateY: 0.5 }, { translateX: 1.5 }, { rotateY: '-35deg'}
                            ] 
                        }}
                        >
                            {
                                !!this.state.userId && !this.state.showKeyboard &&
                                <Image
                                    source={{ uri: `https://chart.googleapis.com/chart?cht=qr&chl=${this.state.userId}&chs=256x256&choe=UTF-8&chld=L%7C2` }}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        
                                    }}
                                />
                            }
                        </View>
                    </View>

                <Animated.Text style={{
                    color: 'gold',
                    transform: [
                        { translate: [0, 1, 2] },
                        { translateZ: this.state.crawlLocation },
                        { rotateX: '-90deg'}
                    ],
                    zIndex: -100,
                    display: this.state.display,
                    
                }} >
                    In a Galaxy Far Far Away ...{"\n"}
                    There lives a young Frog{"\n"}
                    who has journeyed far and wide{"\n"}
                    in search for his destiny.{"\n"}
                    {"\n"}
                    After much hardship and{"\n"}
                    years away from home,{"\n"}
                    the young Frog is ready{"\n"}
                    to return whence he came.{"\n"}
                    {"\n"}
                    But one Challenge remained{"\n"}
                    before the Young Frog{"\n"}
                    can finally be at peace ...
                </Animated.Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    inputBox: {
        padding: 0.02,
        backgroundColor: '#000000',
        borderColor: '#639dda',
        borderWidth: 0.01,
        borderRadius: 0.01,
        width: 0.8,
        transform: [{translateY:0.2}]
    },
    crawl: {
        color: "red"
    }
});

AppRegistry.registerComponent('Login', () => Login);
