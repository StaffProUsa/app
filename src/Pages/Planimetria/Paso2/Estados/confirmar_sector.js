import React from 'react';

import { SText, SView } from "servisofts-component";
import Abstract from "./_abstract";
export default class index extends Abstract {

    constructor(Menu) {
        super("confirmar_sector", Menu)
    }
    onClick(evt, ref) {
        super.onClick(evt, ref);
        this.Menu.clear();
        // var point = { x: evt.offsetX, y: evt.offsetY }
        // this.setValue(point);
    }
    paint(ref) {
        super.paint(ref);
        const { ctx } = ref;
        var { punto_ini, punto_fin, confirmed } = this.Menu.state;
        ctx.strokeStyle = this.colors.base
        ctx.fillStyle = this.colors.card
        ctx.lineWidth = 1;
        ctx.strokeRect(punto_ini.x, punto_ini.y, punto_fin.x - punto_ini.x, punto_fin.y - punto_ini.y)
        ctx.fillRect(punto_ini.x, punto_ini.y, punto_fin.x - punto_ini.x, punto_fin.y - punto_ini.y)
    }
    render() {
        return <SView center>
            <SText>{"Confirma la creacion del sector?"}</SText>
            <SView col={"xs-12"} row center>
                <SView col={"xs-6"} center height={40}>
                    <SText bold onPress={() => {
                        this.setValue(true);
                    }} style={{
                        padding: 8
                    }}>{"SI"}</SText>
                </SView>
                <SView col={"xs-6"} center height={40} >
                    <SText bold style={{
                        padding: 8
                    }} onPress={() => {
                        this.Menu.clear();

                    }}>{"NO"}</SText>
                </SView>
            </SView>
        </SView>
    }
}