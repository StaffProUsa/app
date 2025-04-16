import React, { Component } from 'react';
import { View, Text, TextStyle } from 'react-native';
import { SDate, SIcon, SNotification, SPage, SPopup, STable2, SText, STheme, SView, SLanguage, SImage } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import { connect } from 'react-redux';
import InputHora from '../Components/NuevoInputs/InputHora';
import InputFloat from '../Components/NuevoInputs/InputFloat';
import { DinamicTable } from 'servisofts-table';
import Config from '../Config';

const ImageLabel = ({ label, src, textStyle, wrap = true }) => {
    return <SView row >
        <SView width={16} height={16} style={{ borderRadius: 100, overflow: "hidden", backgroundColor: STheme.color.card }}>
            <SImage src={src} style={{
                resizeMode: "cover"
            }} />
        </SView>
        <SView width={4} />
        <Text style={[textStyle, { flex: 1 }]} numberOfLines={!wrap ? 0 : 1} >{label}</Text>
    </SView>
}

class boss extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
    }
    componentDidMount() {
        // this.loadData()
    }

    loadData = async () => {
        const resp = await SSocket.sendPromise({
            component: "staff_usuario",
            type: "getMisTrabajadores",
            key_usuario: Model.usuario.Action.getKey()
        })
        // return resp.data
        return Object.values(resp.data)
        // return ["asdsa", "ASdsad", "fgdghe", "$35345"]
    }

    // loadData() {
    //     SSocket.sendPromise({
    //         component: "staff_usuario",
    //         type: "getMisTrabajadores",
    //         key_usuario: Model.usuario.Action.getKey()
    //     }).then(e => {
    //         this.setState({ data: e.data })
    //     }).catch(e => {
    //         console.log(e);
    //     })
    // }

    handlePressEdit(obj) {
        SPopup.open({
            key: "editar",
            content: <SView col={"xs-12"} height={300} backgroundColor={STheme.color.background} withoutFeedback center>

            </SView>
        })
    }
    handleOpen(obj) {
        SPopup.confirm({
            title: "Seguro de marcar Clock in al usuario",
            onPress: () => {
                SNotification.send({
                    key: "register_object",
                    title: "Loading...",
                    type: "loading",
                })
                SSocket.sendPromise({
                    component: "staff_usuario",
                    type: "editar",
                    data: {
                        key: obj.key,
                        fecha_ingreso: new SDate().toString("yyyy-MM-ddThh:mm:ssTZD")
                    }
                }).then(e => {
                    SNotification.send({
                        key: "register_object",
                        title: "Success",
                        time: 5000,
                        color: STheme.color.success
                    })
                    this.loadData()
                }).catch(e => {
                    SNotification.send({
                        key: "register_object",
                        title: "error",
                        time: 5000,
                        color: STheme.color.danger
                    })
                })
            }
        })
    }
    handleClose(obj) {
        SPopup.confirm({
            title: "Seguro de marcar Clock out al usuario",
            onPress: () => {

                SNotification.send({
                    key: "register_object",
                    title: "Loading...",
                    type: "loading",
                })
                SSocket.sendPromise({
                    component: "staff_usuario",
                    type: "editar",
                    data: {
                        key: obj.key,
                        fecha_salida: new SDate().toString("yyyy-MM-ddThh:mm:ssTZD")
                    }
                }).then(e => {
                    SNotification.send({
                        key: "register_object",
                        title: "Success",
                        time: 5000,
                        color: STheme.color.success
                    })
                    this.loadData()
                }).catch(e => {
                    SNotification.send({
                        key: "register_object",
                        title: "error",
                        time: 5000,
                        color: STheme.color.danger
                    })
                })
            }
        })
    }

    //  ImageLabel = ({ label, src, textStyle, wrap = true }) => {
    //     return <SView row >
    //       <SView width={16} height={16} style={{ borderRadius: 100, overflow: "hidden", backgroundColor: STheme.color.card }}>
    //         <SImage src={src} style={{
    //           resizeMode: "cover"
    //         }} />
    //       </SView>
    //       <SView width={4} />
    //       <Text style={[textStyle as TextStyle, { flex: 1 }]} numberOfLines={!!wrap ? 0 : 1} >{label}</Text>
    //     </SView>
    //   }

     calculador_hora(hora_inicio, hora_fin) {
        if (!hora_inicio) return "";
        const time = new SDate(hora_inicio, "yyyy-MM-ddThh:mm:ssTZD").diffTime(new SDate(hora_fin, "yyyy-MM-ddThh:mm:ssTZD"))
        return isNaN(time) ? "" : time / 1000 / 60 / 60;
    
    
    
      }

    render() {
        const users = Model.usuario.Action.getAll() ?? {};
        return <SPage titleLanguage={{ en: "Boss", es: "Jefe" }} disableScroll
        // header={<SView col={"xs-12"} height={24} style={{
        //     justifyContent: "center"
        // }}>
        //     <SView width={80} height={20} card center row onPress={() => {
        //         this.setState({ data: {} })
        //         this.loadData()
        //     }}>
        //         <SView height={20} width={20}>
        //             <SIcon name='Reload' fill={STheme.color.text} />
        //         </SView>
        //         <SView width={4} />
        //         <SText>{"Refresh"}</SText>
        //     </SView>
        // </SView>}
        >
            <SView col={"xs-12"} height backgroundColor={STheme.color.background} withoutFeedback>
                <DinamicTable
                    loadInitialState={async () => {
                        return {
                            "filters": [
                                {
                                    // "col": "estado",
                                    // "operator": "=",
                                    // "type": "date",
                                    // "value": [
                                    //     "enabled"
                                    // ]
                                },

                            ],
                            "sorters": [
                                {
                                    // "key": "alta",
                                    // "order": "asc",
                                    // "type": "date"
                                }
                            ]
                        }
                    }}
                    loadData={this.loadData.bind(this)}
                    colors={Config.table.styles()}
                    cellStyle={Config.table.cellStyle()}
                    textStyle={Config.table.textStyle()}
                >
                    {/* <DinamicTable.Col key={"index"} data={p => p.index} label='#' width={30} /> */}
                    <DinamicTable.Col key={"actions"} label={SLanguage.select({ en: "Actions", es: "Acciones" })} width={100}
                        data={e => {
                            let mensaje = "--";
                            let onPress = null;
                            const sdate = new SDate(e?.row?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD");
                            if (sdate.isAfter(new SDate())) {
                                mensaje = "--"
                            } else if (!e.row.fecha_ingreso) {
                                mensaje = "CLOCK IN"
                                onPress = () => {
                                    this.handleOpen(e.row);
                                }
                            } else if (!e.row.fecha_salida) {
                                mensaje = "CLOCK OUT"
                                onPress = () => {
                                    this.handleClose(e.row);
                                }
                            }
                            return mensaje;
                        }}
                        customComponent={e => {
                            let mensaje = "--";
                            let onPress = null;
                            const sdate = new SDate(e?.row?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD");
                            if (sdate.isAfter(new SDate())) {
                                mensaje = "--"
                            } else if (!e.row.fecha_ingreso) {
                                mensaje = "CLOCK IN"
                                onPress = () => {
                                    this.handleOpen(e.row);
                                }
                            } else if (!e.row.fecha_salida) {
                                mensaje = "CLOCK OUT"
                                onPress = () => {
                                    this.handleClose(e.row);
                                }
                            }
                            return <SView col={"xs-12"} flex row center>
                                <SText card padding={4} onPress={onPress}>{mensaje}</SText>
                            </SView>
                        }}

                    />
                    <DinamicTable.Col key={"status"} label={SLanguage.select({ en: "Status", es: "Estado" })} width={200}
                        data={e => {
                            let CONT = <SText color={STheme.color.gray} fontSize={10}>{"--"}</SText>

                            // const fecha = new SDate(obj?.evento?.fecha, "yyyy-MM-ddThh:mm:ss");
                            // const hora = new SDate(obj?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ss");
                            const sdate = new SDate(e?.row?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD");
                            // const sdate = new SDate(fecha.toString("yyyy-MM-dd") + "T" + hora.toString("hh:mm:ss"), "yyyy-MM-ddThh:mm:ss");
                            const timerun = sdate.isBefore(new SDate())
                            // console.log("obj", obj)
                            let allowLoading = false;
                            let estadoAsistencia = "";
                            if (sdate.isAfter(new SDate())) {
                                // Si la fecha inicio aun no paso
                                CONT = <SText center color={STheme.color.gray} fontSize={10} language={{ es: "Esperando la hora de ingreso...", en: "Waiting for check-in time..." }} />
                                // estadoAsistencia = "Esperando la hora de ingreso..."
                            } else if ((!e?.row?.fecha_ingreso) && (!e?.row?.fecha_salida) && (new SDate(e?.row?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").isBefore(new SDate()))) {
                                console.log(e?.row, new SDate(e?.row?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD"));
                                CONT = <SText center color={STheme.color.danger} fontSize={10} language={{
                                    es: "El evento ya finalizó y no se marcó ingreso ni salida",
                                    en: "The event has already ended and no check-in or check-out was marked"
                                }} />
                                // estadoAsistencia = "EL evento ya finalizo y no marcaste ingreso ni salida"
                            } else if (!e?.row?.fecha_ingreso) {
                                allowLoading = true;
                                CONT = <SText center color={STheme.color.warning} fontSize={10} language={{
                                    es: "Debes marcar ingreso en el evento",
                                    en: "You must check-in at the event"
                                }} />
                                // estadoAsistencia = "Debes marcar ingreso en el evento"
                            } else if (!e?.row?.fecha_salida) {
                                allowLoading = true;
                                CONT = <SText center color={STheme.color.warning} fontSize={10} language={{
                                    es: "Debes marcar salida",
                                    en: "You must check-out"
                                }} />
                                // estadoAsistencia = "Debes marcar la salida"
                            } else {
                                CONT = <SText center color={STheme.color.success} fontSize={10} language={{
                                    es: "Evento finalizado",
                                    en: "Event finished"
                                }} />
                            }
                            return CONT
                        }}
                        customComponent={e => {
                            let CONT = <SText center color={STheme.color.gray} fontSize={10}>{"--"}</SText>
                            const sdate = new SDate(e?.row?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD");
                            const timerun = sdate.isBefore(new SDate())
                            // console.log("obj", obj)
                            let allowLoading = false;
                            let estadoAsistencia = "";
                            if (sdate.isAfter(new SDate())) {
                                CONT = <SText col={"xs-12"} center color={STheme.color.gray} fontSize={10} language={{ es: "Esperando la hora de ingreso...", en: "Waiting for check-in time..." }} />
                                // estadoAsistencia = "Esperando la hora de ingreso..."
                            } else if ((!e?.row?.fecha_ingreso) && (!e?.row?.fecha_salida) && (new SDate(e?.row?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").isBefore(new SDate()))) {
                                CONT = <SText col={"xs-12"} center color={STheme.color.danger} fontSize={10} language={{
                                    es: "El evento ya finalizó y no se marcó ingreso ni salida",
                                    en: "The event has already ended and no check-in or check-out was marked"
                                }} />
                                // estadoAsistencia = "EL evento ya finalizo y no marcaste ingreso ni salida"
                            } else if (!e?.row?.fecha_ingreso) {
                                allowLoading = true;
                                CONT = <SText col={"xs-12"} center color={STheme.color.warning} fontSize={10} language={{
                                    es: "Debes marcar ingreso en el evento",
                                    en: "You must check-in at the event"
                                }} />
                                // estadoAsistencia = "Debes marcar ingreso en el evento"
                            } else if (!e?.row?.fecha_salida) {
                                allowLoading = true;
                                CONT = <SText col={"xs-12"} center color={STheme.color.warning} fontSize={10} language={{
                                    es: "Debes marcar salida",
                                    en: "You must check-out"
                                }} />
                                // estadoAsistencia = "Debes marcar la salida"
                            } else {
                                CONT = <SText col={"xs-12"} center color={STheme.color.success} fontSize={10} language={{
                                    es: "Evento finalizado",
                                    en: "Event finished"
                                }} />
                            }
                            return <SView col={"xs-12"} row center>
                                {CONT}
                            </SView>
                        }
                        }


                    />
                    <DinamicTable.Col key={"key_usuario"} label={SLanguage.select({ en: "Name", es: "Nombre" })} width={100}
                        data={e => { return users[e.row.key_usuario]?.Nombres + " " + users[e.row.key_usuario]?.Apellidos }}
                    />
                    <DinamicTable.Col key={"key_usuario_"} label={SLanguage.select({ en: "Employee Number", es: "Número de empleado" })} width={120}
                        data={e => { return users[e.row.key_usuario]?.employee_number }}
                    />
                    <DinamicTable.Col key={"eventoFecha"} label={SLanguage.select({ en: "Date", es: "Fecha" })} width={120}
                        data={e => new SDate(e.row.evento.fecha, "yyyy-MM-ddThh:mm:ss").toString("MONTH dd, yyyy")}
                    />
                    <DinamicTable.Col key={"start"} label={SLanguage.select({ en: "Start", es: "Inicio" })} width={120}
                        data={e => !e.row.staff.fecha_inicio ? null : new SDate(e.row.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}
                    />
                    <DinamicTable.Col key={"end"} label={SLanguage.select({ en: "End", es: "Fin" })} width={120}
                        data={e => !e.row.staff.fecha_fin ? null : new SDate(e.row.staff.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}
                    />
                    <DinamicTable.Col key={"clock_in"} label={SLanguage.select({ en: "Clock In", es: "Entrada" })} width={120}
                        data={e => e.row.fecha_ingreso ? new SDate(e.row.fecha_ingreso, "yyyy-MM-ddThh:mm:ssTZD").toString("HH") : null}
                    />
                    <DinamicTable.Col key={"clock_out"} label={SLanguage.select({ en: "Clock Out", es: "Salida" })} width={120}
                        data={e => e.row.fecha_salida ? new SDate(e.row.fecha_salida, "yyyy-MM-ddThh:mm:ssTZD").toString("HH") : null}
                    />

                    <DinamicTable.Col key={"hour"} label={SLanguage.select({ en: "Hours", es: "Horas" })} width={120}
                        data={e => {
                            // if (!e.row.fecha_ingreso) {
                            //     return "";
                            // }
                            // const fi = new SDate(e.row.fecha_ingreso, "yyyy-MM-ddThh:mm:ss.sssTZD")
                            // const fs = e.row.salida ? new SDate(e.row.fecha_salida, "yyyy-MM-ddThh:mm:ss.sssTZD") : new SDate()
                            // const disf = fi.diffTime(fs);
                            // return ((disf / 1000) / 60 / 60).toFixed(2);
                            if (!e.row.fecha_ingreso || !e.row.fecha_salida) return "";
                            let hora44 = this.calculador_hora(e.row?.fecha_ingreso, e.row?.fecha_salida);
                            return hora44;
                        }}
                    />
                    <DinamicTable.Col key={"cliente"} label={SLanguage.select({ en: "Client", es: "Cliente" })} width={100}
                        data={e => e.row.cliente.descripcion}
                        customComponent={e => <ImageLabel wrap={e.colData.wrap} label={e.data} src={SSocket.api.root + "cliente/" + e.row?.cliente?.key} textStyle={e.textStyle} />}
                    />
                    <DinamicTable.Col key={"evento"} label={SLanguage.select({ en: "Event", es: "Evento" })} width={100}
                        data={e => e.row.evento.descripcion}
                        customComponent={e => <ImageLabel wrap={e.colData.wrap} label={e.data} src={SSocket.api.root + "evento/" + e.row?.evento?.key} textStyle={e.textStyle} />}
                    />
                    <DinamicTable.Col key={"posicion"} label={SLanguage.select({ en: "Position", es: "Posición" })} width={100}
                        data={e => e.row.staff_tipo.descripcion}
                    />
                    <DinamicTable.Col key={"descrip"} label={SLanguage.select({ en: "Description", es: "Descripción" })} width={100}
                        data={e => e.row.staff.descripcion}
                    />
                </DinamicTable>
            </SView >
        </SPage>
    }
}

const initStates = (state) => {
    return { state };
};
export default connect(initStates)(boss);
