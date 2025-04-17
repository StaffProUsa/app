import React from "react";
import { SDate, SHr, SIcon, SLanguage, SList, SNavigation, SNotification, SPage, SPopup, SText, STheme, SUtil, SView } from "servisofts-component";
import SSocket from "servisofts-socket";
import { Container } from "../../Components";
import FloatButtom from "../../Components/FloatButtom";
import { SelectEntreFechas } from "../../Components/Fechas";

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

    // componentDidMount() {
    //     Eventos.INSTANCE = this;
    //     this.setState({ loading: true })
    //     SSocket.sendPromise({
    //         component: "evento",
    //         type: "getEstadoEventos",
    //         key_cliente: this.key_cliente
    //     }).then(e => {
    //         this.setState({ data: e.data, loading: false })
    //     }).catch(e => {
    //         this.setState({ loading: false })
    //     })
    // }

    loadData({ fecha_inicio, fecha_fin }) {
        SSocket.sendPromise({
            component: "evento",
            // type: "getMisTrabajos",
            type: "getEstadoEventos",
            key_cliente: this.key_cliente,

        }).then(e => {
            // Object.values(e.data).map((obj) => {
            // const f = new SDate(obj.evento.fecha, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd")
            // const hi = new SDate(obj.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("hh:mm:ss")
            // const hf = new SDate(obj.staff.fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("hh:mm:ss")
            // obj._fecha_inicio = f + "T" + hi
            // if (obj.staff.fecha_fin) {
            //     obj._fecha_fin = f + "T" + hf
            // }

            // })
            console.log(fecha_inicio, fecha_fin)
            const hoy = new SDate().toString("yyyy-MM-dd"); // fecha actual
            const eventosFiltrados = Object.values(e.data).filter(evento => {
                const fechaEvento = new SDate(evento.fecha).toString("yyyy-MM-dd");
                if (this.props.pasadoSelect) {
                    return fechaEvento >= fecha_inicio && fechaEvento <= fecha_fin && fechaEvento >= hoy;
                } else {
                    return fechaEvento >= fecha_inicio && fechaEvento <= fecha_fin && fechaEvento < hoy;
                }
            });
            // this.setState({ data: e.data })



            this.setState({ data: eventosFiltrados })
            console.log("Eventos filtrados:", eventosFiltrados);
        }).catch(e => {
            console.error(e);
        })


        // SSocket.sendPromise({
        //     component: "staff_usuario",
        //     // type: "getHistorico",
        //     type: "getHistoricoEntreFechas",
        //     fecha_inicio: fecha_inicio,
        //     fecha_fin: fecha_fin,
        //     key_usuario: Model.usuario.Action.getKey()
        // }).then(e => {
        //     this.setState({ dataResumen: e.data })
        // }).catch(e => {
        //     console.error(e);
        // })
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
                        SPopup.confirm({
                            title: (lenguaje == "es") ? "¿Está seguro de duplicar el evento?" : "Are you sure to duplicate the event?",
                            onPress: () => {
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
                            }
                        });

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
        console.log("pasadoSelectOk", pasadoSelectOk)
        // this.props.pasadoSelect ? null : this.loadData({ fecha_inicio: this.state.fecha_inicio, fecha_fin: this.state.fecha_fin });
        return <>
            <SelectEntreFechas
                fecha_inicio={new SDate().setDay(1).toString("yyyy-MM-dd")}
                onChange={e => {
                    this.entrefecha = e;
                    this.loadData(e)
                    this.setState({ fecha_inicio: e.fecha_inicio, fecha_fin: e.fecha_fin })
                }}
            />
            <SList
                buscador
                space={16}
                data={this.state?.data}
                order={[{ key: "fecha", order: "desc" }]}
                // filter={d => {
                //     let fechaEvento = new Date(d.fecha);
                //     let hoy = new Date();
                //     hoy.setHours(0, 0, 0, 0); // Ignorar la hora, solo comparar fechas
                //     if (!pasadoSelectOk) {
                //         return fechaEvento < hoy; // Solo eventos pasados
                //     } else {
                //         return fechaEvento >= hoy; // Solo eventos futuros
                //     }
                // }}
                render={this.renderItem.bind(this)}
            />
        </>
    }
}