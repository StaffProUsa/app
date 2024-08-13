import React, { Component } from 'react';
import { View } from 'react-native';
import { SInput, SPage, SScrollView2, SText, SView } from 'servisofts-component';
import PinchZoom from '../../../Components/PinchZoom';
import { ReactNativeZoomableView } from '../../../Components/ReactNativeZoomableView';
import Canvas from './Canvas';
import Menu from './Menu';
class Paso2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        var parent = this.props.parent;
        var img = parent.state.img;
        if (!img) return;
        return (
            <SView col={"xs-12"} center height style={{
                // backgroundColor: "#f0f",
            }} >
                <ReactNativeZoomableView
                    maxZoom={3}
                    minZoom={0.2}
                    initialZoom={1}
                    bindToBorders={false}
                >

                    <Canvas
                        img={img}
                        onClick={(evt, ref) => {
                            this.menu.onClick(evt, ref);
                        }}
                        paint={(ref) => {
                            if (this.menu) {
                                this.menu.paint(ref);
                            }
                            const { ctx } = ref;
                            if (this.props.mesas) {
                                // console.log(this.props.mesas)
                                Object.values(this.props.mesas).map((isla) => {
                                    ctx.strokeStyle = "#00FF00"
                                    ctx.fillStyle = "#00FF0099"
                                    ctx.lineWidth = 2;
                                    ctx.strokeRect(isla.x, isla.y, isla.w, isla.h)
                                    ctx.fillRect(isla.x, isla.y, isla.w, isla.h)
                                })
                            }
                        }} />
                </ReactNativeZoomableView>
                <Menu ref={ref => this.menu = ref} parent={this} key_evento={this.props.key_evento} />
            </SView >
        );
    }
}

export default (Paso2);