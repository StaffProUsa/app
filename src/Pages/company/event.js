import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SNavigation, SPage, SText, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { Container } from '../../Components';
import Reclutas from './Components/Reclutas';
import Asistencias from './Components/Asistencias';

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
            <SText fontSize={16} bold>{descripcion}</SText>
            <SHr />
            <SText fontSize={12}>{observacion}</SText>
            <SHr />
            <SHr />
            <SText fontSize={12} col={"xs-12"}>{fecha}</SText>
            <SHr h={50} />
            <SText onPress={() => {
                SNavigation.navigate("/staff/add", { key_evento: this.key_evento })
            }} language={{ en: "Add new staff", es: "Crear nuevo staff" }}></SText>
            <SHr h={50} />
            <Reclutas key_evento={this.key_evento} />
            <SHr h={50} />
            <Asistencias key_evento={this.key_evento} />
            <SHr h={50} />
        </SView>
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
            </Container>
        </SPage>
    }
}
