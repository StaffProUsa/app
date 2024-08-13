import React, { Component } from 'react'
import { Animated, Dimensions, PanResponder, Platform } from 'react-native'
import { SLoad, SText, SView } from 'servisofts-component'
import { PinchGestureHandler, State } from 'react-native-gesture-handler'
const USE_NATIVE_DRIVER = true;
export default class PinchZoom extends Component {
    _baseScale = new Animated.Value(this.props.zoom ?? 1);
    _pinchScale = new Animated.Value(1);
    _scale = Animated.multiply(this._baseScale, this._pinchScale);

    _lastScale = this.props.zoom ?? 1;
    _onPinchGestureEvent = Animated.event(
        [{ nativeEvent: { scale: this._pinchScale } }],
        { useNativeDriver: USE_NATIVE_DRIVER }
    );
    pan = new Animated.ValueXY();
    _translateX = Animated.divide(this.pan.x, this._scale);
    _translateY = Animated.divide(this.pan.y, this._scale);
    panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => (gestureState.dx != 0 || gestureState.dy != 0),
        onPanResponderGrant: () => {
            if (this.active_handler) return;
            this.pan.setOffset({
                x: this.pan.x._value,
                y: this.pan.y._value
            });
        },
        // onPanResponderMove: Animated.event([
        //     null,
        //     { dx: this.pan.x, dy: this.pan.y }
        // ]),
        onPanResponderMove: (evt, gs) => {
            if (this.active_handler) return;
            this.pan.setValue({
                x: gs.dx,
                y: gs.dy
            })
            // console.log("onPanResponderMove")
        },
        onPanResponderRelease: () => {
            this.pan.flattenOffset();
        }
    });
    constructor(props) {
        super(props);
        this._scale.addListener(({ value }) => this._value = value);
        this._translateX.addListener(({ value }) => this._value_translateX = value);
        this._translateY.addListener(({ value }) => this._value_translateY = value);

    }
    mousewheel = (evt) => {
        // console.log(evt);
        // return;
        this._lastScale += (evt.deltaY * -0.001);
        if (this._lastScale <= 0.1) {
            this._lastScale = 0.1;
        }
        this._baseScale.setValue(this._lastScale);
        this._pinchScale.setValue(1);


    }
    componentDidMount() {
        if (Platform.OS == "web") {
            document.addEventListener("mousewheel", this.mousewheel)
        }
    }

    componentWillUnmount() {
        if (Platform.OS == "web") {
            document.removeEventListener("mousewheel", this.mousewheel)
        }
    }
    _onPinchHandlerStateChange = (event) => {

        if (event.nativeEvent.oldState === State.ACTIVE) {
            this.active_handler = false;
            this._lastScale *= event.nativeEvent.scale;
            this._baseScale.setValue(this._lastScale);
            this._pinchScale.setValue(1);
            // this.pan.setValue({
            //     x: 0,
            //     y: 0
            // })
        }
    };
    render() {
        return (


            <Animated.View style={{
                transform: [
                    // { translateX: this._translateX },
                    // { translateY: this._translateY }],
                    { translateX: this.pan.x },
                    { translateY: this.pan.y }],
            }} {...this.panResponder.panHandlers}>
                <PinchGestureHandler
                    onActivated={() => {
                        this.active_handler = true;
                    }}
                    // simultaneousHandlers={[this.panResponder]}
                    onGestureEvent={this._onPinchGestureEvent}
                    // onGestureEvent={(evt) => {
                    //     // console.log(evt);
                    // }}
                    onHandlerStateChange={this._onPinchHandlerStateChange}
                >
                    <Animated.View style={{
                        transform: [
                            { scale: this._scale },
                        ]
                    }}>
                        {this.props.children}
                    </Animated.View>
                </PinchGestureHandler>
            </Animated.View>
        )
    }
}