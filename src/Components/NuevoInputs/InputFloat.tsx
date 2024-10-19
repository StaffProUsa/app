import React, { Component } from "react";
import { Dimensions, GestureResponderEvent, ViewStyle } from "react-native";
import { SPopup, STheme, SView } from "servisofts-component";

export default class InputFloat {
    static open(props: {
        e: GestureResponderEvent,
        width: number,
        height: number,
        style?: ViewStyle,
        render: () => JSX.Element
    }) {

        const height = props.height;
        const width = props.width;
        const windowHeight = Dimensions.get('window').height;
        const windowWidth = Dimensions.get('window').width;


        // @ts-ignore
        props.e.currentTarget.measure((x, y, w, h, px, py) => {
            let top = py + h;
            let left = px;
            if (height + top > windowHeight) {
                top = windowHeight - height;
            }
            if (width + left > windowWidth) {
                left = windowWidth - width;
            }
            if (left < 0) {
                left = 0;
            }
            SPopup.open({
                type: "2",
                content: <SView withoutFeedback style={[{
                    position: "absolute",
                    width: width,
                    height: height,
                    left: left,
                    top: top,
                    backgroundColor: STheme.color.card,
                }, props.style]}>
                    {props.render()}
                </SView>
            })
        })
    }


}