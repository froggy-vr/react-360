import React from 'react';
import {
    AppRegistry,
    Text,
    View,
    VrButton,
    StyleSheet,
    NativeModules,
    Image,
    asset,
    Animated
} from 'react-360';

import { Easing } from 'react-native'
import firebase from '../config'

//react-360 keyboard https://github.com/danielbuechele/react-360-keyboard
import { registerKeyboard } from 'react-360-keyboard';
AppRegistry.registerComponent(...registerKeyboard);

const database = firebase.database()

export default class Login extends React.Component {
    state = {
        userId: '',
        titleLocation: new Animated.Value(1),
        crawlLocation: new Animated.Value(0),
    }
    componentDidMount() {
        this.titleAnimation()
        this.crawlAnimation()
    }
    titleAnimation() {
        this.state.titleLocation.setValue(0);
        Animated.spring(
            this.state.titleLocation,
            {
                toValue: -0.2,
                duration: 800,
                friction: 2,
                tension: 1
            }
        ).start();
    }
    crawlAnimation() {
        this.state.crawlLocation.setValue(0);
        Animated.timing(
            this.state.crawlLocation,
            {
                toValue: 20,
                duration: 70000,
                easing: Easing.linear
            }
        ).start();
    }
    onClick = () => {
        NativeModules.Keyboard.startInput({
            placeholder: this.state.userId || 'Enter your name',
            emoji: false
        }).then(input => {
            this.setState({
                userId: input
            }, () => {
                database.ref(`/${this.state.userId}/user`).on('value', snapshot => {
                    console.log(snapshot.val())
                    if (snapshot.val()) {
                        this.props.startGame(this.state.userId)
                    }
                })
            })
        });
    }

    render() {
        const AnimatedText = Animated.createAnimatedComponent(Text);
        return (
            <View style={{ transform: [{ translateZ: -2 }, { translateY: 0.6 }, { translateX: -0.3 }] }}>
                <AnimatedText
                    style={{
                        transform: [{ translateZ: 1 }, { translateY: this.state.titleLocation }],
                    }}
                >
                    Welcome To VR
                    <Image
                        source={asset('frog.png')}
                        style={{
                            height: 1,
                            width: 1,
                        }}
                    />GGY
                </AnimatedText>
                {this.state.userId !== '' ?
                    <View>
                        <VrButton onClick={this.onClick} style={styles.inputBox}>
                            <Text>{this.state.userId}</Text>
                        </VrButton>
                    </View>
                    :
                    <VrButton onClick={this.onClick} style={styles.inputBox}>
                        <Text>Enter Your Name</Text>
                    </VrButton>
                }
                {this.state.userId !== '' &&
                    <Image
                        source={{ uri: `https://chart.googleapis.com/chart?cht=qr&chl=${this.state.userId}&chs=256x256&choe=UTF-8&chld=L%7C2` }}
                        style={{
                            height: 0.5,
                            width: 0.5,
                            marginTop: 0.2,
                            transform: [{ translateX: 1 }, { translateY: 0.4 }]
                        }}
                    />
                }
                <Animated.Text style={{
                    color: 'gold',
                    transform: [                        
                        { translate: [-1.2, -2, -1] },
                        {translateZ: 1}, 
                        { translateY: this.state.crawlLocation },
                    ],
                    zIndex: -100,
                }} >
                    In a Galaxy Far Far Away ...{"\n"}
                    There lives a young Frog{"\n"}
                    who has journey far and wide{"\n"}
                    in search for his destiny.{"\n"}
                    {"\n"}
                    After much hardship and{"\n"}
                    years away from home,{"\n"}
                    the young Frog is ready{"\n"}
                    to go back.{"\n"}
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
        width: 0.8
    },
    crawl: {
        color: "red"
    }
});

AppRegistry.registerComponent('Login', () => Login);
