import React from 'react';

import { SText, SView } from "servisofts-component";
import ListaSectores from '../ListaSectores';
import Abstract from "./_abstract";
export default class index extends Abstract {

    constructor(Menu) {
        super("select_sector", Menu)
    }
    onClick(evt, ref) {
        super.onClick(evt, ref);
        // var point = { x: evt.offsetX, y: evt.offsetY }
        // this.setValue(point);
    }
    paint(ref) {
        super.paint(ref);
        var islas = this.Menu.state["select_color"];
        for (let i = 0; i < islas.length; i++) {
            const isla = islas[i];
            this.ref.ctx.strokeStyle = this.colors.base
            this.ref.ctx.lineWidth = 2;
            this.ref.ctx.strokeRect(isla.x, isla.y, isla.w, isla.h)

            // this.ref.ctx.fillStyle = this.colors.card
            // this.ref.ctx.fillRect(isla.x, isla.y, isla.w, isla.h)
        }

    }
    render() {
        return (
            <SView
                col={"xs-12"}
                style={{
                    height: 300,
                }}>
                <ListaSectores key_evento={this.Menu?.props?.key_evento} Menu={this.Menu} />
            </SView>
        )
    }
}