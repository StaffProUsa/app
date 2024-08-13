import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SGradient, SImage, SLoad, SNavigation, SNotification, SPopup, SText, STheme, SView } from 'servisofts-component';
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

    // componentDidMount() {
    //     SSocket.sendPromise({
    //         service: "sqr",
    //         component: "qr",
    //         type: "registro",
    //         estado: "cargando",
    //         data: {
    //             content: "https://casagrande.servisofts.com/venta?key=" + this.props.data.key,
    //             content_type: "text",
    //             errorCorrectionLevel: "L",
    //             type_color: "solid",
    //             colorBody: "#ffffff",
    //             body: "Dot",
    //             framework: "Rounded",
    //             header: "Circle",
    //             detail: "Default"
    //         }
    //     }).then(e => {
    //         this.setState({ dataQr: e.data })
    //     }).catch(e => {
    //         console.error(e);
    //     })
    // }
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
        return <SText fontSize={10}>Entregada el {new SDate(fecha_entrega, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}</SText>
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
    getQr() {
        if (!this.state?.dataQr) return null
        return "data:image/png;base64," + this.state.dataQr?.b64
    }
    render() {
        const { producto, color } = this.props.data;
        let colors = color ?? "#E2E335"
        return <View style={{
            padding: 4,
            width: "50%",
            height: 140,
        }}>
            <View style={{
                flex: 1,
                backgroundColor: STheme.color.card,
                borderRadius: 8,
                padding: 8,
                justifyContent: "center",
                alignItems: "center"
            }}>
                {/* <SGradient colors={[lightenHexColor(colors, -10), colors, lightenHexColor(colors, -10)]} deg={90} /> */}
                <SText bold>{producto}</SText>
                <SView flex col={"xs-12"} padding={4} >
                    {/* <SImage src={this.getQr()} enablePreview /> */}
                </SView>
                {this.renderParticipante()}
                {this.renderEntregar()}
            </View>
        </View >
    }
}
