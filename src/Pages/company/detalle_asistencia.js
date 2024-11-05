import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { SButtom, SDate, SHr, SIcon, SNavigation, SNotification, SPage, SPopup, SText, STheme, SView, SLanguage, SList, SLoad, SList2 } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { Container } from '../../Components';
import Reclutas from './Components/Reclutas';
import Asistencias from './Components/Asistencias';
import Model from '../../Model';
import eventosPage from "../cliente/eventos"
import PBarraFooter from '../../Components/PBarraFooter';
// export default class detalle_asistencia extends Component {

class detalle_asistencia extends Component {
    // static INSTANCE: event;
    constructor(props) {
        super(props);
        this.state = {
        };
        this.key_evento = SNavigation.getParam("key_evento")
        this.pk = SNavigation.getParam("pk")
        // event.INSTANCE = this;
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

        SSocket.sendPromise({
            component: "staff",
            type: "getByKeyDetalle",
            key: this.pk,
            key_usuario: Model.usuario.Action.getKey(),
        }).then(e => {
            this.setState({ dataStaff: e.data })
        }).catch(e => {
            console.error(e);
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
        if (!this.state.dataStaff) return null;
        // console.log("STAFF", this.state.dataStaff);
        const { descripcion, observacion, fecha } = this.state.data
        return <SView col={"xs-12"} center>
            <SHr />

            <SHr />
            <SView col={"xs-12"} card center padding={10}>
                <SHr h={1} color={STheme.color.card} />
                <SHr h={10} />
                {/* <SText fontSize={10} col={"xs-12"} style={{ textAlign: "right" }} color={STheme.color.gray}>{new SDate(fecha, "yyyy-MM-ddThh:mm:ss").toString("MM-dd-yyyy hh:mm")}</SText> */}
                <SHr />
                <SText fontSize={18} center bold>{descripcion}</SText>
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
            <SHr h={10} />
        </SView >
    }

    item(obj) {
        console.log("obj")
        console.log(obj)
        let dataUsuario = Model.usuario.Action.getByKey(obj?.key_usuario);
        if (!dataUsuario) return <SLoad />;
        console.log("usuario", dataUsuario)
        return <SView col={"xs-12"} padding={10} card >
            <SText fontSize={14} bold>{dataUsuario.Nombres} {dataUsuario.Apellidos}</SText>
        </SView>
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
                <SView col={"xs-12"} row>
                    <SText justify fontSize={16} bold >{this.state.dataStaff?.staff_tipo?.descripcion}</SText>
                    <SHr />
                    <SList2
                        data={this.state.dataStaff?.staff_usuario?.filter(e => e.fecha_atiende != null)}
                        // filter={a => a.map(e => e.fecha_atiende != null)}
                        render={this.item.bind(this)}
                    />
                </SView>
                <SHr h={50} />

            </Container>
            <SHr height={60} />
        </SPage>
    }
}
const initStates = (state) => {
    return { state };
};
export default connect(initStates)(detalle_asistencia);
