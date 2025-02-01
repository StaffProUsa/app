import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SNavigation, SNotification, SStorage, SThread } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../Model';



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
                new SThread(100, "cargando usuerrio").start(() => {
                    SNavigation.replace("/invitation", { pk: ki })
                    // SNotification.send({ title: "navego a invitation" })
                    this.state.pasar = false;
                })

            }
        })

        SSocket.sendPromise({
            component: "staff_tipo_favorito",
            type: "getAll",
            key_usuario: Model.usuario.Action.getKey()
        }).then(e => {
            if (!this.state.pasar) return;
            if (e.data) {
                if (Object.values(e.data).length <= 0) {
                    // SNotification.send({ title: "entro a staff_tipo" })
                    SNavigation.replace("/perfil/staff_tipo")
                    this.state.pasar = false;
                }
            }
        }).catch(e => {

        })


        new SThread(2000, "pasar", true).start(() => {
            if (!this.state.pasar) return;
            // SNotification.send({ title: "volvio" })
            SNavigation.goBack();
        })
        // SNavigation.goBack();
    }
    render() {
        return (
            <View>
                <Text> onLogin </Text>
            </View>
        );
    }
}
