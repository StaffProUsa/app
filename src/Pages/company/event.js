import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SDate, SHr, SIcon, SNavigation, SNotification, SPage, SPopup, SText, STheme, SView, SLanguage } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { Container } from '../../Components';
import Reclutas from './Components/Reclutas';
import Asistencias from './Components/Asistencias';
import Model from '../../Model';
import eventosPage from "../cliente/eventos"
import PBarraFooter from '../../Components/PBarraFooter';
export default class event extends Component {
    static INSTANCE: event;
    constructor(props) {
        super(props);
        this.state = {
        };
        this.key_evento = SNavigation.getParam("key_evento")
        event.INSTANCE = this;
    }


    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
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
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }
    handleEliminar() {
        let lenguaje = SLanguage.language;
        SPopup.confirm({
            title: (lenguaje == "es") ? 'Eliminar' : 'Delete',
            message: (lenguaje == "es") ? '¿Está seguro de eliminar?' : 'Are you sure you want to delete?',
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

    EsFechaMenorOIgual(fecha) {
        // Convertir la fecha de cadena a objeto Date
        const fechaObj = new Date(fecha);

        // Obtener la fecha actual
        const fechaActual = new Date();
        return fechaObj.getDate() < fechaActual.getDate()
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
            <SView col={"xs-12"} card center padding={10}>
                <SHr h={1} color={STheme.color.card} />
                <SHr h={10} />
                {/* <SText fontSize={10} col={"xs-12"} style={{ textAlign: "right" }} color={STheme.color.gray}>{new SDate(fecha, "yyyy-MM-ddThh:mm:ss").toString("MM-dd-yyyy hh:mm")}</SText> */}
                <SHr />
                <SText fontSize={18} center bold>{descripcion}</SText>
                <SHr />
                <SText fontSize={14} color={STheme.color.gray}>{observacion}</SText>
                <SHr />
                <SView row>
                    <SText language={{
                        en: "Start date:",
                        es: "Fecha de inicio:"
                    }} color={STheme.color.gray}
                    />
                    <SView width={10} />
                    <SText fontSize={16} center color={STheme.color.text}>{new SDate(fecha, "yyyy-MM-ddThh:mm:ss").toString("MONTH dd, yyyy")}</SText>
                </SView>
                {(this.EsFechaMenorOIgual(new Date(fecha))) ? <SText fontSize={16} center color={STheme.color.danger} language={{
                    en: "(Past event)",
                    es: "(Evento pasado)"
                }} /> : null}
                <SHr h={25} />
                <SHr h={1} color={STheme.color.card} />
            </SView>
            <SHr h={25} />
            <SView col={"xs-12"} >
                <SView col={"xs-12"} row>
                    <SText fontSize={18} language={{
                        en: "Booking",
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
            <SHr h={25} />
            <Asistencias key_evento={this.key_evento} />
            <SHr h={50} />
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
            }}
            footer={<PBarraFooter url={'/company'} />}
        >
            <Container loading={!this.state.data || this.state.loading}>
                {this.renderHeader()}
                <SHr h={50} />

            </Container>
            <SHr height={60} />
        </SPage>
    }
}
