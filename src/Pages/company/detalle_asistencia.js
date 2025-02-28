import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { SButtom, SDate, SHr, SIcon, SNavigation, SNotification, SPage, SPopup, SText, STheme, SView, SLanguage, SList, SLoad, SList2, SImage } from 'servisofts-component';
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
            // version: "2.0",
            //     service: "usuario",
            component: "asistencia",
            type: "detalleStaff",
            key_staff: this.pk,
            // key_usuario: Model.usuario.Action.getKey(),
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
                        body: "Error al eliminar",
                        time:5000,
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

        let diferencia;
        if (obj?.fecha_salida) {
            let fecha_ingreso = new SDate(obj?.fecha_ingreso, "yyyy-MM-ddThh:mm:ss");
            let fecha_salida = new SDate(obj?.fecha_salida, "yyyy-MM-ddThh:mm:ss");
            let diferenciaMilisegundos = fecha_ingreso.diffTime(fecha_salida);

            // Convertir la diferencia a horas
            let diferenciaHoras = diferenciaMilisegundos / (1000 * 60 * 60);

            if (Math.abs(diferenciaHoras) >= 1) {
                console.log(`Diferencia en horas: ${diferenciaHoras.toFixed(2)}`);
                diferencia = `${diferenciaHoras.toFixed(2)} hrs.`;
            } else {
                // Convertir la diferencia a minutos
                const diferenciaMinutos = diferenciaMilisegundos / (1000 * 60);
                diferencia = `${diferenciaMinutos.toFixed(2)} min.`;
                console.log(`Diferencia en minutos: ${diferenciaMinutos.toFixed(2)}`);
            }
        }

        return <SView col={"xs-12"} padding={10} card >
            <SView col={"xs-12"} row>
                <SView card width={25} height={25} center
                    style={{ borderRadius: 4, overflow: "hidden" }}>
                    <SImage enablePreview src={SSocket.api.root + "usuario/" + obj?.key_usuario} style={{
                        resizeMode: "cover",
                    }} /></SView>
                <SView width={10} />
                <SText fontSize={14} bold>{dataUsuario.Nombres} {dataUsuario.Apellidos}</SText>
            </SView>
            <SView row col={"xs-12"}>
                <SHr />
                <SView col={"xs-6"} center style={{
                    // borderLeftWidth: 1,
                    // borderColor: STheme.color.lightGray
                }}>
                    <SText fontSize={12} color={STheme.color.gray} language={{
                        es: "Hora Inicio",
                        en: "Start Time"
                    }} />
                    <SText fontSize={14} bold color={STheme.color.text}>{new SDate(obj?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                </SView>
                {(obj?.staff?.fecha_fin) ? <SView col={"xs-6"} center style={{
                    borderLeftWidth: 1,
                    borderColor: STheme.color.lightGray
                }}>
                    <SText fontSize={12} color={STheme.color.gray} language={{
                        es: "Hora Fin",
                        en: "End Time"
                    }} />
                    <SText fontSize={14} bold color={STheme.color.text}>{new SDate(obj?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                </SView> : null}
                <SHr />
                <SHr height={1} color={STheme.color.lightGray} />
                <SHr />

                {(obj?.fecha_ingreso) ? <SView col={"xs-6"} center style={{
                    // borderLeftWidth: 1,
                    // borderColor: STheme.color.lightGray
                }}>
                    <SText fontSize={14} color={STheme.color.gray} language={{
                        es: "Marcar Ingreso",
                        en: "Clock In"

                    }} />
                    <SText fontSize={18} bold color={STheme.color.text}>{new SDate(obj?.fecha_ingreso, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                </SView> : <SText center color={STheme.color.warning} language={{
                    es: "No marcó asistencia",
                    en: "Did not mark attendance"
                }} />}

                {(obj?.fecha_salida) ? <SView col={"xs-6"} center style={{
                    borderLeftWidth: 1,
                    borderColor: STheme.color.lightGray
                }}>
                    <SText fontSize={14} color={STheme.color.gray} language={{
                        es: "Marcar Salida",
                        en: "Clock Out"
                    }} />
                    <SText fontSize={18} bold color={STheme.color.text}>{new SDate(obj?.fecha_salida, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                    <SHr />
                </SView> : null}

                {(obj?.fecha_salida) ? <SView col={"xs-12"} center style={{
                    borderTopWidth: 1,
                    borderColor: STheme.color.lightGray
                }}>
                    <SHr />
                    <SText fontSize={14} color={STheme.color.gray} language={{
                        es: "Tiempo de trabajo",
                        en: "Working time"
                    }} />
                    <SText fontSize={18} bold color={STheme.color.text}>{diferencia}</SText>
                </SView> : null}



            </SView>
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
            backAlternative={o => {
                if (this.key_evento) {
                    SNavigation.replace("/company/event", { key_evento: this.key_evento })
                } else {
                    SNavigation.goBack();
                }
            }}
            footer={<PBarraFooter url={'/company'} />}
        >
            <Container loading={!this.state.data || this.state.loading}>
                {this.renderHeader()}
                <SView col={"xs-12"} row>
                    <SText justify fontSize={16} bold >{this.state.dataStaff?.staff_tipo?.descripcion}</SText>
                    <SHr />
                    <SList2
                        data={this.state.dataStaff}
                        // data={this.state.dataStaff?.filter(e => e.fecha_atiende != null)}
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
