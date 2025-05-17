import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SIcon, SNavigation, SNotification, SPage, SStorage, SText, STheme, SThread, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import MDL from '../MDL';
import PButtom from '../Components/PButtom';



export default class onLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pasar: true
        };
    }

    componentDidMount() {
        SStorage.getItem("key_invitacion", ki => {
            if (ki) {
                SStorage.removeItem("key_invitacion");
                new SThread(100, "cargando usuario").start(() => {
                    SNavigation.replace("/invitation", { pk: ki })
                    // SNotification.send({ title: "navego a invitation" })
                    this.state.pasar = false;
                })

            }
        })

        new SThread(2000, "pasar", true).start(() => {
            console.log("PASAR", this.state.pasar);
            if (!this.state.pasar) return;
            console.log("PASAR 2");
            // SNavigation.goBack();
            MDL.validaciones.componentDidMount();
        })
    }
    componentWillUnmount() {
        MDL.validaciones.componentDidMount();
    }
    render() {
        return (
            <SPage disableScroll center>
                <SView col="xs-12" center onPress={() => {
                    SNavigation.navigate("/")
                }}>
                    <SText style={{ color: STheme.color.text }} language={{
                        en: "Welcome to",
                        es: "Bienvenido a"
                    }} />
                    <SIcon name="Logo" width={100} height={100} fill={STheme.color.text} />
                    <PButtom rojo small onPress={() => {
                        SNavigation.navigate("/")
                    }}><SText color={STheme.color.white} language={{
                        es: "IR A INICIO",
                        en: "GO HOME"
                    }} /></PButtom>
                </SView>
            </SPage>
        );
    }
}
