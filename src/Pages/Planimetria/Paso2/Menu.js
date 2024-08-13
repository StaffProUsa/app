import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { SButtom, SIcon, SText, STheme, SView } from 'servisofts-component'

import Estados from './Estados/_index';


export default class Menu extends Component {
    ESTADOS;
    constructor(props) {
        super(props);
        this.state = {
            // confirmar_sector: true,
            // islas: null,
            // punto_fin: { x: 746, y: 556 },
            // punto_ini: { x: 331, y: 209 },
            // select_color: false,
            // select_sector: null,
            // _aux_color: { r: 255, g: 251, b: 252, a: 255 },
        }
        this.initEstados();
    }
    initEstados() {
        this.ESTADOS = [];
        Object.values(Estados).map((estado) => {
            this.ESTADOS.push(new estado(this));
        });

    }
    getCurrentState() {

        for (let i = 0; i < this.ESTADOS.length; i++) {
            const estado = this.ESTADOS[i];
            if (!this.state[estado.name]) {
                return estado;
            }
        }
    }
    repaint() {
        this.setState({ ...this.state });
        if (this.ref) {
            this.ref.repaint();
        }
    }
    clear() {
        for (let i = 0; i < this.ESTADOS.length; i++) {
            const estado = this.ESTADOS[i];
            estado.clear();
            this.repaint();
        }
    }
    paint = (ref) => {
        this.ref = ref;
        var estado = this.getCurrentState();
        if (estado) {
            estado.paint(ref);
        }
    }
    onClick = (evt, ref) => {
        this.ref = ref;
        var estado = this.getCurrentState();
        if (estado) {
            estado.onClick(evt, ref);
        }
    }
    getPaso = () => {
        var estado = this.getCurrentState();
        if (estado) {
            return estado.render();
        }
        return <SText>exito</SText>
    }
    render() {
        return (
            <SView col={"xs-10 md-6"} style={{
                bottom: 8,
                position: "absolute",
                minHeight: 70,
                backgroundColor: STheme.color.background + "ee",
                borderRadius: 8,
                borderColor: STheme.color.card,
                borderWidth: 2,
            }} center>
                <SView col={"xs-12"} flex>
                    {this.getPaso()}
                </SView>
                <SView style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: 4
                }} onPress={() => {
                    this.clear();
                }}>
                    <SIcon name={"Reload"} fill={STheme.color.text} width={15} />
                    {/* <SText fontSize={10}>CLEAR</SText> */}
                </SView>
            </SView>
        )
    }
}