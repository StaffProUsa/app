import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SImage, SNavigation, SPage, SText, SView } from 'servisofts-component';
import { Container } from '../../Components';
import EntradaQR from './Components/EntradaQR';


const ImageSize = {
    width: 720,
    height: 1280
}
export default class banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            scale: 0
        };
        this.key_entrada = SNavigation.getParam("key_entrada")
    }

    render() {
        return <SPage>
            <SView col={"xs-12"} center >
                <SView col={"xs-12 sm-10 md-8 lg-6 xl-4 xxl-3"} center >
                    <SView col={"xs-12"} height={this.state.height}
                        onLayout={e => {
                            const { width, height } = e.nativeEvent.layout
                            const scale = width / ImageSize.width;

                            this.setState({ width: ImageSize.width * scale, height: ImageSize.height * scale, scale: scale })
                        }} center>
                        <SImage src={require("../../Assets/images/test.jpeg")} />
                        <SView style={{
                            top: 718 * this.state.scale,
                            position: "absolute",
                            backgroundColor: "#FFF",
                            width: 545 * this.state.scale,
                            height: 84 * this.state.scale,
                            borderRadius: 14 * this.state.scale,
                            borderWidth: 3 * this.state.scale,
                            borderColor: "#000"
                        }} center>
                            <SText color={"#000"}  fontSize={30 * this.state.scale} center bold>{"Roy Ruddy Paz Demiquel Rodrigues Justiniano"}</SText>
                        </SView>
                        <SView style={{
                            top: 855 * this.state.scale,
                            position: "absolute",
                            backgroundColor: "#FFF",
                            width: 270 * this.state.scale,
                            height: 270 * this.state.scale,
                            borderRadius: 14 * this.state.scale,
                            borderWidth: 3 * this.state.scale,
                            borderColor: "#000",
                            overflow: 'hidden',
                        }} center>
                            <EntradaQR key_entrada={this.key_entrada} col={"xs-12"} style={{
                                padding: 12 * this.state.scale
                            }} />
                        </SView>
                    </SView>
                </SView>
            </SView>
        </SPage >
    }
}
