import React, { Component } from 'react';
import { View, Text, ImageStyle } from 'react-native';
import { SImage } from 'servisofts-component';

export default class ImageFast extends Component<{ src: string, style: ImageStyle }> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return <SImage style={this.props.style} src={this.props.src} />

    }
}
