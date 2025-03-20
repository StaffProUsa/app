import React from "react";
import { SDate, SHr, SIcon, SLanguage, SList, SNavigation, SNotification, SPage, SText, STheme, SUtil, SView } from "servisofts-component";
import SSocket from "servisofts-socket";
import { Container } from "../../Components";
import FloatButtom from "../../Components/FloatButtom";

const getColorFromPercentage = (percentage) => {
    // Asegurarse de que el valor esté entre 0 y 100
    percentage = Math.max(0, Math.min(percentage, 100));

    let r, g;

    if (percentage < 50) {
        // De 0 a 50, rojo (255, 0, 0) a amarillo (255, 255, 0)
        r = 255;
        g = Math.floor((percentage / 50) * 255);
    } else {
        // De 50 a 100, amarillo (255, 255, 0) a verde (0, 255, 0)
        r = Math.floor(255 - ((percentage - 50) / 50) * 255);
        g = 255;
    }

    // El color siempre tiene el componente azul en 0
    return `rgb(${r}, ${g}, 0)`;
}

export default class Eventos extends React.Component {
    static INSTANCE = null;

    key_cliente = this.props.key_cliente ?? SNavigation.getParam("key_cliente")
    state = {

    }

    componentDidMount() {
        Eventos.INSTANCE = this;
        this.setState({ loading: true })
        SSocket.sendPromise({
            component: "evento",
            type: "getEstadoEventos",
            key_cliente: this.key_cliente
        }).then(e => {
            this.setState({ data: e.data, loading: false })
        }).catch(e => {
            this.setState({ loading: false })
        })
    }

    renderBarra({ porcentaje, color, key }) {
        return <SView row col={"xs-12"} >
            <SView flex center>
                <SView style={{
                    width: "100%",
                    height: 4,
                    borderRadius: 100,
                    backgroundColor: STheme.color.card,
                    overflow: 'hidden',
                }} >
                    <SView
                        width={parseFloat(porcentaje ?? 0) + "%"}
                        style={{
                            height: "100%",
                            backgroundColor: getColorFromPercentage(porcentaje)
                        }} />
                </SView>
            </SView>
            <SView width={40} style={{
                alignItems: "flex-end"
            }}>
                <SText>{porcentaje ?? 0}%</SText>
            </SView>
        </SView>
    }
    renderItem(obj) {

        let pasadoSelect = this.props.pasadoSelect ?? true;
        let fecha = new Date(obj.fecha);
        let hoy = new Date();

        // Ajustar "hoy" para ignorar la hora y comparar solo la fecha.
        hoy.setHours(0, 0, 0, 0);
        let pasado = false;
        if (fecha < hoy) {
            console.log("La fecha es pasada.");
            pasado = true;
        } else if (fecha.getTime() === hoy.getTime()) {
            pasado = false;
            console.log("La fecha es hoy.");
        } else {
            pasado = false;
            console.log("La fecha es futura.");
        }

        //validando si el evento es pasado o no
        if (pasadoSelect == pasado) {
            return null;
        }

        let lenguaje = SLanguage.language;
        return <SView col={"xs-12"} style={{
            borderWidth: 1,
            borderRadius: 8,
            borderColor: STheme.color.gray + "50",
        }} padding={8} onPress={() => {
            SNavigation.navigate("/company/event", { key_evento: obj.key })
        }}>

            <SView col={"xs-12"} row center>
                <SView flex>
                    <SText fontSize={14} bold>{obj.descripcion}</SText>
                </SView>
                <SView>
                    {pasado ? <SText fontSize={12} backgroundColor={STheme.color.danger} padding={5} color={STheme.color.white} language={{
                        es: "EVENTO PASADO",
                        en: "PAST EVENT"
                    }} /> : null}
                    {/* <SText fontSize={12} color={STheme.color.gray}>ESTADO</SText> */}
                </SView>
                <SView width={5} />
                <SView width={40} center row padding={3}
                    onPress={() => {
                        SSocket.sendPromise({
                            component: "evento",
                            type: "duplicar",
                            key_evento: obj.key
                        }).then(e => {
                            SNotification.send({
                                title: (lenguaje == "es") ? "Éxito" : "Success",
                                body: (lenguaje == "es") ? "Evento duplicado correctamente" : "Event duplicated successfully",
                                color: STheme.color.success,
                                time: 5000,
                            })
                            this.componentDidMount();
                        }).catch(e => {
                            SNotification.send({
                                title: (lenguaje == "es") ? "Error" : "Error",
                                body: e.error ?? (lenguaje == "es") ? "Error desconocido" : "Unknown error",
                                color: STheme.color.danger,
                                time: 5000,
                            })
                        })
                    }}
                    style={{
                        alignItems: "flex-end",
                        backgroundColor: STheme.color.success,
                        borderRadius: 4,
                    }}>
                    <SIcon name={"duplicar"} fill={STheme.color.white} width={15} height={15} />
                    <SText fontSize={8} color={STheme.color.white} language={
                        {
                            es: "Duplicar",
                            en: "Duplicate"
                        }
                    } />
                </SView>
            </SView>

            <SHr h={4} />
            <SText fontSize={12} color={STheme.color.gray}>{SUtil.limitString(obj?.observacion, 200, "...")?.trim()}</SText>
            <SHr />
            <SText fontSize={12} color={STheme.color.gray}>{`${SLanguage.select({
                en: "Booking",
                es: "Reclutas"
            })} ${obj.actual ?? 0}/${obj.cantidad ?? 0}`}</SText>
            {this.renderBarra({ color: null, porcentaje: obj.porcentaje_reclutas, key: obj.key + "b" })}
            <SHr />
            <SText fontSize={12} color={STheme.color.gray}>{`${SLanguage.select({
                en: "Attendance",
                es: "Asistencias"
            })} ${obj.asistencias ?? 0}/${obj.actual ?? 0}`}</SText>
            {this.renderBarra({ color: null, porcentaje: obj.porcentaje_asistencia, key: obj.key + "a" })}
            <SHr />
            {/* <SText col={"xs-12"} style={{ textAlign: "right" }} fontSize={10} color={STheme.color.gray}>{new SDate(obj.fecha).toString("MONTH dd, yyyy,  HH")}</SText> */}
            <SText col={"xs-12"} style={{ textAlign: "right" }} fontSize={10} color={STheme.color.gray}>{new SDate(obj.fecha).toString("MONTH dd, yyyy")}</SText>

            {/* <SText color={STheme.color.lightGray}>{new SDate(obj.fecha_on).toString("yyyy-MM-dd hh:mm")}</SText> */}
            {/* <SText>{obj.}</SText> */}
        </SView>
    }
    render() {
        let pasadoSelectOk = this.props.pasadoSelect ?? true;
        return <SList
            buscador
            space={16}
            data={this.state?.data}
            order={[{ key: "fecha", order: "desc" }]}
            filter={d => {
                let fechaEvento = new Date(d.fecha);
                let hoy = new Date();
                hoy.setHours(0, 0, 0, 0); // Ignorar la hora, solo comparar fechas
                if (!pasadoSelectOk) {
                    return fechaEvento < hoy; // Solo eventos pasados
                } else {
                    return fechaEvento >= hoy; // Solo eventos futuros
                }
            }}
            render={this.renderItem.bind(this)}
        />
    }
}