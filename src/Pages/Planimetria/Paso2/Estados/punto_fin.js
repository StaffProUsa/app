import React from 'react';

import { SText, SView } from "servisofts-component";
import Abstract from "./_abstract";
export default class index extends Abstract {

    constructor(Menu) {
        super("punto_fin", Menu)
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
                <SText>{"Seleccione el punto de fin del sector"} </SText>
            </SView>
        )
    }
}