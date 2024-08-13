import React from 'react';

import { SButtom, SText, SView } from "servisofts-component";
import Abstract from "./_abstract";
export default class index extends Abstract {

    constructor(Menu) {
        super("punto_ini", Menu)
    }
    onClick(evt, ref) {
        super.onClick(evt, ref);
        var point = { x: evt.offsetX, y: evt.offsetY }
        this.setValue(point);
    }
    paint(ref) {
        super.paint(ref);
    }
    render() {
        return (
            <SView>
                <SText>{"Seleccione el punto de inicio del sector"} </SText>
                <SButtom type='outline' onPress={() => {
                    this.Menu.props.parent.props.parent.setState({ img: null, noLoad: true })
                }}>
                    CAMBIAR
                </SButtom>
            </SView>
        )
    }
}