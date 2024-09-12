import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SDate, SHr, SIcon, SNavigation, SNotification, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { Container } from '../../Components';
import Reclutas from './Components/Reclutas';
import Asistencias from './Components/Asistencias';
import Model from '../../Model';
import eventosPage from "../cliente/eventos"
export default class event extends Component {
    static INSTANCE: event;
    constructor(props) {
        super(props);
        this.state = {
        };
        this.key_evento = SNavigation.getParam("key_evento")
        event.INSTANCE = this;
    }

    componentDidMount() {
        this.setState({ loading: true })
        SSocket.sendPromise({
            component: "evento",
            type: "getByKey",
            key: this.key_evento
        }).then(e => {
            this.setState({ data: e.data, loading: false })
        }).catch(e => {
            this.setState({ loading: false })
        })
    }
    handleEliminar() {
        SPopup.confirm({
            title: 'Eliminar',
            message: '¿Esta seguro de eliminar?',
            onPress: () => {
                // evento.Actions.eliminar(this.state.data, this.props);
                SSocket.sendPromise({
                    component: "evento",
                    type: "editar",
                    data: {
                        key: this.key_evento,
                        estado: 0,
                    },
                    key_usuario: Model.usuario.Action.getKey()
                }).then(e => {
                    if (eventosPage.INSTANCE) eventosPage.INSTANCE.componentDidMount();
                    SNavigation.goBack();
                }).catch(e => {
                    SNotification.send({
                        title: "error",
                        body: "Error al eliminar"
                    })
                })

            }
        });
    }
    renderHeader() {
        if (!this.state.data) return null;
        const { descripcion, observacion, fecha } = this.state.data
        return <SView col={"xs-12"} center>
            <SHr />
            <SView col={"xs-12"} row>
                <SView width={30} height={30} onPress={() => {
                    this.handleEliminar()
                    // SNavigation.navigate("/company/")registro
                }}>
                    <SIcon name='Delete' />
                </SView>
                <SView width={32} />
                <SView width={30} height={30} onPress={() => {
                    SNavigation.navigate('/evento/registro', { key_company: this.state?.data?.key_company, key: this.key_evento });
                    // SNavigation.navigate("/company/")registro
                }}>
                    <SIcon name='Edit' />
                </SView>
            </SView>
            <SHr />
            <SHr h={1} color={STheme.color.card} />
            <SHr h={24} />
            <SText fontSize={10} col={"xs-12"} style={{ textAlign: "right" }} color={STheme.color.lightGray}>{new SDate(fecha, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}</SText>
            <SHr />
            <SText fontSize={18} bold>{descripcion}</SText>
            <SHr />
            <SText fontSize={12} color={STheme.color.lightGray}>{observacion}</SText>
            <SHr />
            <SHr h={25} />
            <SHr h={1} color={STheme.color.card} />
            <SHr h={25} />
            <SView col={"xs-12"} >
                <SView col={"xs-12"} row>
                    <SText fontSize={18} language={{
                        en: "Recruitment",
                        es: "Reclutas"
                    }} />
                    <SView flex />
                    <SView width={30} height={30} onPress={() => {
                        SNavigation.navigate("/staff/add", { key_evento: this.key_evento, key_company: this.state.data.key_company, fecha: new SDate(fecha, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd") })
                    }}>
                        <SIcon name='Add' />
                    </SView>
                </SView>
                {/* <SText card padding={16} o language={{ en: "Add new staff", es: "Crear nuevo staff" }}></SText> */}
                <Reclutas key_evento={this.key_evento} />
            </SView>
            {/* <SHr h={300} /> */}
            {/* <SHr h={1} color={STheme.color.card} /> */}
            {/* <SHr h={25} />
            <Asistencias key_evento={this.key_evento} />
            <SHr h={50} /> */}
        </SView >
    }
    render() {
        return <SPage
            // titleLanguage={{
            //     en: "Event",
            //     es: "Evento"
            // }}
            onRefresh={() => {
                this.componentDidMount();
            }}>
            <Container loading={!this.state.data || this.state.loading}>
                {this.renderHeader()}
                <SHr h={50} />

            </Container>
        </SPage>
    }
}
