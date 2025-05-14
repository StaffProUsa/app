import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SNavigation, SNotification, SStorage, STheme, SThread } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import MDL from '../MDL';



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
            <View>
                <Text style={{color:STheme.color.text}}> onLogin </Text>
            </View>
        );
    }
}
