import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SHr, SIcon, SLoad, SMath, SNavigation, SNotification, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import { Container } from '../../../Components';
import MesaQR from '../Components/MesaQR';
import SSocket from 'servisofts-socket';
import UsuarioItem from '../Components/UsuarioItem';
import Model from '../../../Model';

export default class profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.pk = SNavigation.getParam("pk");
        this.key_evento = SNavigation.getParam("key_evento");
    }

    componentDidMount() {
        this.getData()
    }
    getData() {
        SSocket.sendPromise({
            component: "mesa",
            type: "getByKey",
            key: this.pk
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {

        })
    }

    handleEntregar() {
        SPopup.confirm({
            title: "¿Está seguro que quiere entregar la manilla?",
            message: "bla bla bla",
            onPress: () => {
                this.setState({ loading: true })
                SSocket.sendPromise({
                    component: "mesa",
                    type: "entregar",
                    key_mesa: this.pk,
                    key_usuario: Model.usuario.Action.getKey()
                }).then(e => {
                    this.setState({ loading: false })
                    this.componentDidMount();
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
        let permiso = Model.usuarioPage.Action.getPermiso({ url: "/entrega", permiso: "entregar", loading: "" });
        if (!this.state.data) return;
        if (!permiso) return null;
        const { fecha_entrega, key_usuario_entrega } = this.state.data;

        // console.log("data_usuario_entrega", data_usuario_entrega)
        if (this.state.loading) return <SLoad />
        if (!!fecha_entrega) return null
        return <SView col={"xs-12"} center row padding={5}>
            <SView width={187} height={40} row style={{
                backgroundColor: STheme.color.secondary,
                borderRadius: 8,
                borderWidth: 1,
                overflow: "hidden",
                borderColor: STheme.color.primary
            }} onPress={this.handleEntregar.bind(this)} >
                <SView width={50} height backgroundColor={STheme.color.primary} center style={{ overflow: "hidden" }}>
                    <SIcon name={'entregar'} fill={STheme.color.secondary} height={25} width={25} />
                </SView>
                <SView flex height center>
                    <SText center bold fontSize={16}>ENTREGAR</SText>
                </SView>
            </SView>
        </SView>
    }
    renderContenido() {
        if (!this.state.data) return <SLoad />
        return <Container>
            <SHr />
            <SText fontSize={18}>{this.state.data.evento}</SText>
            <SHr />
            <SHr />
            <SHr />
            <SHr />
            <SText>{this.state.data.sector}</SText>
            <SHr />
            <SText fontSize={20} bold>Bs. {SMath.formatMoney(this.state.data.precio)}</SText>
            <SHr h={50} />
            <UsuarioItem key_usuario={this.state?.data?.key_usuario} label={"Comprador"} fecha={new SDate(this.state?.data?.fecha_pago, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")} />
            <SHr h={8} />
            <UsuarioItem key_usuario={this.state?.data?.key_usuario_entrega} label={"Entregado por"} fecha={new SDate(this.state?.data?.fecha_entrega, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")} />
            {this.renderEntregar()}
            <SHr h={50} />
            <SView col={"xs-12"} card center padding={8} >
                <SHr height={15} />
                <MesaQR key_mesa={this.pk} />
                <SHr height={8} />
                <SText fontSize={12} color={STheme.color.lightGray}>No compartas este QR</SText>
            </SView>
            <SHr h={50} />
        </Container>
    }
    render() {
        return <SPage title={"Mesa"}>
            {this.renderContenido()}
        </SPage>
    }
}
