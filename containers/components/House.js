import React from 'react';
import {
    asset,
    Model,
    Animated,
} from 'react-360';

export default class House extends React.PureComponent {
    render() {
        let num = this.props.randColourIndex
        var AnimatedModel = Animated.createAnimatedComponent(Model);
        return (
            <AnimatedModel
                source={{
                    obj: asset('apartments2.obj'),
                }}
                style={{
                    transform: [
                      { translate: [this.props.xIndex, -this.props.yIndex, -this.props.houseInitialIndex] },
                      { translateZ: this.props.depth },
                      { rotateY: 180 }
                    ],
                  }}
                  texture={asset(`apartments2.00${num}.png`)}
                  wireframe={false}
            />
        );
    }

};