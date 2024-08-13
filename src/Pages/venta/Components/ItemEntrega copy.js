import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SGradient, SLoad, SNavigation, SNotification, SPopup, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';
import { lightenHexColor } from './ColorFunctions';
import Config from '../../../Config';

export default class ItemEntrega extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    handleEntregar() {

        SPopup.confirm({
            title: "Esta seguro que quiere entregar la manilla?",
            message: "bla bla bla",
            onPress: () => {
                this.setState({ loading: true })
                SSocket.sendPromise({
                    component: "entrada",
                    type: "entregar",
                    key_entrada: this.props.data.key,
                    key_usuario: Model.usuario.Action.getKey()
                }).then(e => {
                    this.setState({ loading: false })
                    if (this.props.onChange) {
                        this.props.onChange({
                            ...this.props.data,
                            ...e.data
                        })
                    }
                    console.log("Entregado con exito");
                }).catch(e => {
                    this.setState({ loading: false })
                    SNotification.send({
                        title: "Error",
                        body: e?.error,
                        color: STheme.color.danger,
                        time: 5000,
                    })
                })
            }
        })
    }
    renderEntregar() {
        const { fecha_entrega } = this.props.data;
        if (this.state.loading) return <SLoad />
        if (!fecha_entrega) return <SText color={STheme.color.link} underLine onPress={this.handleEntregar.bind(this)}>Entregar.</SText>
        return <SText color={STheme.color.black} fontSize={10}>Entregada el {new SDate(fecha_entrega, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}</SText>
    }
    handleParticiparInvitar() {
        const { producto, color, key } = this.props.data;
        SNavigation.navigate("/venta/invite", { key_entrada: key })
        // console.log(link)
    }
    renderParticipante() {
        const { key_participante } = this.props.data;
        if (!key_participante) return <SText color={STheme.color.link} underLine onPress={this.handleParticiparInvitar.bind(this)}>Invita a un amigo.</SText>
        return <SText color={STheme.color.black} fontSize={10}>{key_participante}</SText>
    }
    render() {
        const { producto, color } = this.props.data;
        let colors = color ?? "#E2E335"
        return <View style={{
            padding: 4,
            width: "100%", height: 70,
            flexDirection: "row"
            // borderBottomRightRadius: 500,
            // borderBottomLeftRadius: 500,
        }}>
            <View style={{
                width: 20,
                height: "100%",
                backgroundColor: "#fff"
            }}>

            </View>
            <View style={{
                flex: 1,
                padding: 4,
            }}>
                <SGradient colors={[lightenHexColor(colors, -10), colors, lightenHexColor(colors, -10)]} deg={90} />
                <SText color={"#000"} bold>{producto}</SText>
                {this.renderParticipante()}
                {this.renderEntregar()}
            </View>
        </View >
    }
}
