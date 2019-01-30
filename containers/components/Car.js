import React from 'react';
import {
    asset,
    Model,
    Animated,
} from 'react-360';

export default class Car extends React.PureComponent {
    render() {
        var AnimatedModel = Animated.createAnimatedComponent(Model);
        return (
            <AnimatedModel
                source={{
                    obj: asset('Transport Shuttle_obj.obj'),
                    mtl: asset('Transport Shuttle_obj.mtl'),

                }}
                style={{
                    transform: [
                        { translate: [-30, -this.props.yIndex, -this.props.carsInitialIndex] },
                        { translateZ: this.props.depth },
                        { translateX: this.props.slideValue },
                        { rotateY: 180 },
                    ],
                }}
                wireframe={false}
            />
        );
    }
};