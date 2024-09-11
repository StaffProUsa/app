import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SDate, SHr, SNavigation, SNotification, SPage, SPopup, SText, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { Container } from '../../Components';
import Reclutas from './Components/Reclutas';
import Asistencias from './Components/Asistencias';
import Model from '../../Model';
import eventosPage from "./eventos"
export default class event extends Component {
    static INSTANCE;
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
    renderHeader() {
        if (!this.state.data) return null;
        const { descripcion, observacion, fecha } = this.state.data
        return <SView col={"xs-12"} center>
            <SHr />
            <SText underLine fontSize={12} col={"xs-12"} onPress={() => {
                SNavigation.navigate('admin/evento/registro', { key_company: this.state?.data?.key_company, key: this.key_evento });
                // SNavigation.navigate("/company/")registro
            }}>{"Editar el evento"}</SText>
            <SHr />
            <SText fontSize={16} bold>{descripcion}</SText>
            <SHr />
            <SText fontSize={12}>{observacion}</SText>
            <SHr />
            <SHr />
            <SText fontSize={12} col={"xs-12"}>{fecha}</SText>
            <SHr />


            <SHr h={50} />
            <SText card padding={16} onPress={() => {
                SNavigation.navigate("/staff/add", { key_evento: this.key_evento, key_company: this.state.data.key_company, fecha: new SDate(fecha, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd") })
            }} language={{ en: "Add new staff", es: "Crear nuevo staff" }}></SText>
            <Reclutas key_evento={this.key_evento} />
            <SHr h={50} />
            <Asistencias key_evento={this.key_evento} />
            <SHr h={50} />
        </SView >
    }
    render() {
        return <SPage titleLanguage={{
            en: "Event",
            es: "Evento"
        }} onRefresh={() => {
            this.componentDidMount();
        }}>
            <Container loading={!this.state.data || this.state.loading}>
                {this.renderHeader()}
                <SHr h={50} />
                <SButtom type='danger' onPress={() => {
                    // SNavigation.navigate('admin/evento/registro', { key: item });
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
                }}><SText center language={{
                    en: "DELETE EVENT",
                    es: "ELIMINAR EL EVENTO",
                }} /></SButtom>
                <SHr h={50} />
            </Container>
        </SPage>
    }
}
