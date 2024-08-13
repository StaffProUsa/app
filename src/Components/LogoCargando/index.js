import React, { Component } from 'react'
import { SView, SIcon, STheme } from 'servisofts-component'
import { Animated, Easing } from 'react-native'
export default class LogoCargando extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 250,
            dotSize: 16
        };
        this.animValue = new Animated.Value(0);
    }
    componentDidMount() {
        this.anim_rotar();
    }
    anim_rotar() {
        Animated.timing(this.animValue, {
            toValue: 1,
            duration: 1500,
            // useNativeDriver: false,
            easing: Easing.linear
        }).start(() => {
            this.animValue.setValue(0);
            this.anim_rotar();
        });
    }
    render() {
        return (
            <SView width={this.state.size} height={this.state.size} center>
                <SView width={this.state.size * 0.6} height={this.state.size * 0.6}>
                    <SIcon name={"Logo"} />
                </SView>
                <SView animated col={"xs-12"} height
                    center
                    style={{
                        position: "absolute",
                        transform: [{
                            rotate: this.animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0deg", "360deg"]
                            })
                        }],
                    }}>
                    <SView width={this.state.dotSize} height={this.state.dotSize} style={{
                        borderRadius: 100,
                        backgroundColor: STheme.color.primary,
                        position: "absolute",
                        top: this.state.size * 0.9,
                    }} />
                </SView>
            </SView>
        )
    }
}