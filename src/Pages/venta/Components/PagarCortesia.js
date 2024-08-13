import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { SNotification, SPopup, SText, STheme } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';

class PagarCortesia extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    hanldePagar = () => {
        const { key } = this.props?.data;
        SPopup.confirm({
            title: "Seguro que quieres pagar la venta por cortesía?",
            onPress: () => {
                SSocket.sendPromise({
                    component: "venta",
                    type: "pagoCortesia",
                    key_venta: key
                }).then(e => {
                    console.log(e);
                    SNotification.send({
                        title: "Exito",
                        body: "La venta se pago por cortesía.",
                        color: STheme.color.success,
                        time: 5000,
                    })
                }).catch(e => {
                    console.error(e);
                    SNotification.send({
                        title: "Error",
                        body: e.error,
                        color: STheme.color.danger,
                        time: 5000,
                    })
                })
            }
        })
        console.log(this.props.data)
    }
    render() {
        const permiso = Model.usuarioPage.Action.getPermiso({
            url: "admin/venta",
            permiso: "cortesia"
        })
        if (!permiso) return null;
        return <SText underLine onPress={this.hanldePagar.bind(this)}>{"PAGAR POR CORTESIA"}</SText>
    }
}

const initStates = (state) => {
    return { state };
};
export default connect(initStates)(PagarCortesia);

