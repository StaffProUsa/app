import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { SInput, SLoad, SNotification, SPage, SScrollView2, SText, STheme, SView } from 'servisofts-component';
import { ReactNativeZoomableView } from '../ReactNativeZoomableView';
import SSocket from 'servisofts-socket'

import Canvas from './Canvas';
import { PinchToZoom } from '../PinchToZoom';
import Animated from 'react-native-reanimated';


export const loadImage = (key_evento) => {
    return new Promise((resolve, reject) => {
        if (!key_evento) {
            reject("key_evento not found");
            return;
        }
        const imageUrl = SSocket.api.root + "evento/" + key_evento
        fetch(imageUrl)
            .then(response => response.blob())
            .then(imageBlob => {
                // const imageObjectURL = URL.createObjectURL(imageBlob);
                var blob = new Blob([imageBlob], {
                    type: "img/png"
                })
                const fileReaderInstance = new FileReader();
                fileReaderInstance.readAsDataURL(imageBlob);
                fileReaderInstance.onload = () => {
                    var base64data = fileReaderInstance.result;
                    resolve({ uri: base64data });
                }

            }).catch(e => {
                console.log(e);
                reject(e);
            })
    })

}

class CanvasPlanimetria extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    componentDidMount() {
        // if (this.props.key_evento) {
        //     loadImage(this.props.key_evento).then((res) => {
        //         this.setState({ img: res })
        //     }).catch(e => {
        //         // SNotification.send({
        //         //     title: "error",
        //         //     body: JSON.stringify(e),
        //         //     color: STheme.color.danger,
        //         //     time: 5000,
        //         // })
        //     })
        // }
    }
    shouldComponentUpdate(nextProps, nextState) {
        // Solo renderizar si las props o el estado cambian significativamente

        if (this.props.key_evento !== nextProps.key_evento || this.state.img !== nextState.img) {
            if (this.canvas) {
                this.canvas.repaint();
            }
            return true;
        }
        return false;
    }

    render() {
        var img = this.state.img;
        const PINCH = Platform.select({
            // native: ReactNativeZoomableView,
            native: PinchToZoom,
            web: ReactNativeZoomableView
        })
        // if (!img) return <>
        //     <SText>Cargando imagen...</SText>
        //     <SLoad />
        // </>
        return (
            <SView col={"xs-12"} center height style={{
                // backgroundColor: "#f0f",
            }} >
                {/* <ReactNativeZoomableView
                    maxZoom={3}
                    minZoom={0.2}
                    initialZoom={0.5}
                    bindToBorders={false}
                > */}
                <PINCH>
                    <Animated.View>
                        <Canvas
                            key_evento={this.props.key_evento}
                            ref={ref => this.canvas = ref}
                            // img={img}
                            onClick={this.props.onClick}
                            paint={this.props.paint} />
                    </Animated.View>
                </PINCH>
                {/* </ReactNativeZoomableView> */}
            </SView >
        );
    }
}

export default (CanvasPlanimetria);