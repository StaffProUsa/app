import React, { Component } from 'react';
import { View, Text, ImageStyle } from 'react-native';

import FastImage from 'react-native-fast-image';

export default class ImageFast extends Component<{ src: string, style: ImageStyle }> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return <FastImage
            style={this.props.style}
            source={this.props.src}
            resizeMode={FastImage.resizeMode.contain}
        />
    }
}
