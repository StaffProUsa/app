import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SIcon, SNotification, SPage, SPopup, STable2, SText, STheme, SView, SLanguage } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import { connect } from 'react-redux';
import InputHora from '../Components/NuevoInputs/InputHora';
import InputFloat from '../Components/NuevoInputs/InputFloat';

class boss extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
    }
    componentDidMount() {
        this.loadData()
    }

    loadData() {
        SSocket.sendPromise({
            component: "staff_usuario",
            type: "getMisTrabajadores",
            key_usuario: Model.usuario.Action.getKey()
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {
            console.log(e);
        })
    }

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

    render() {
        const users = Model.usuario.Action.getAll() ?? {};
        return <SPage titleLanguage={{ en: "Boss", es: "Jefe" }} disableScroll
            header={<SView col={"xs-12"} height={24} style={{
                justifyContent: "center"
            }}>
                <SView width={80} height={20} card center row onPress={() => {
                    this.setState({ data: {} })
                    this.loadData()
                }}>
                    <SView height={20} width={20}>
                        <SIcon name='Reload' fill={STheme.color.text} />
                    </SView>
                    <SView width={4} />
                    <SText>{"Refresh"}</SText>
                </SView>
            </SView>}>
            <STable2 data={this.state.data}
                rowHeight={30}

                header={[
                    {
                        key: "-options", label: "Actions", width: 80, renderExcel: a => "-", component: (obj) => {
                            let mensaje = "--";
                            let onPress = null;
                            const sdate = new SDate(obj?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD");
                            if (sdate.isAfter(new SDate())) {
                                mensaje = "--"
                            } else if (!obj.fecha_ingreso) {
                                mensaje = "CLOCK IN"
                                onPress = () => {
                                    this.handleOpen(obj);
                                }
                            } else if (!obj.fecha_salida) {
                                mensaje = "CLOCK OUT"
                                onPress = () => {
                                    this.handleClose(obj);
                                }
                            }
                            return <SView col={"xs-12"} flex row center>
                                <SText card padding={4} onPress={onPress}>{mensaje}</SText>
                                {/* <SView width={8} /> */}
                                {/* <SView width={20} height={20} onPress={this.handlePressEdit.bind(this, obj)}><SIcon name='Edit' /></SView> */}
                                {/* <SView width={8} /> */}
                                {/* {!!obj.fecha_ingreso ? null : <SView width={20} height={20} onPress={this.handleOpen.bind(this, obj)}><SIcon name='Add' /></SView>} */}
                                {/* <SView width={8} /> */}
                                {/* {!obj.fecha_salida && !!obj.fecha_ingreso ? <SView width={20} height={20} onPress={this.handleClose.bind(this, obj)}><SIcon name='Close' fill={"#fff"} /></SView> : null} */}
                            </SView>
                        }
                    },
                    {
                        key: "-status", label: "Status", width: 150, renderExcel: a => "-", component: (obj) => {
                            let CONT = <SText color={STheme.color.gray} fontSize={10}>{"--"}</SText>

                            // const fecha = new SDate(obj?.evento?.fecha, "yyyy-MM-ddThh:mm:ss");
                            // const hora = new SDate(obj?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ss");
                            const sdate = new SDate(obj?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD");
                            // const sdate = new SDate(fecha.toString("yyyy-MM-dd") + "T" + hora.toString("hh:mm:ss"), "yyyy-MM-ddThh:mm:ss");
                            const timerun = sdate.isBefore(new SDate())
                            // console.log("obj", obj)
                            let allowLoading = false;
                            let estadoAsistencia = "";
                            if (sdate.isAfter(new SDate())) {
                                // Si la fecha inicio aun no paso
                                CONT = <SText center color={STheme.color.gray} fontSize={10} language={{ es: "Esperando la hora de ingreso...", en: "Waiting for check-in time..." }} />
                                // estadoAsistencia = "Esperando la hora de ingreso..."
                            } else if ((!obj?.fecha_ingreso) && (!obj?.fecha_salida) && (new SDate(obj?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").isBefore(new SDate()))) {
                                console.log(obj, new SDate(obj.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD"));
                                CONT = <SText center color={STheme.color.danger} fontSize={10} language={{
                                    es: "El evento ya finalizó y no se marcó ingreso ni salida",
                                    en: "The event has already ended and no check-in or check-out was marked"
                                }} />
                                // estadoAsistencia = "EL evento ya finalizo y no marcaste ingreso ni salida"
                            } else if (!obj?.fecha_ingreso) {
                                allowLoading = true;
                                CONT = <SText center color={STheme.color.warning} fontSize={10} language={{
                                    es: "Debes marcar ingreso en el evento",
                                    en: "You must check-in at the event"
                                }} />
                                // estadoAsistencia = "Debes marcar ingreso en el evento"
                            } else if (!obj?.fecha_salida) {
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

                            return <SView col={"xs-12"} flex center>
                                {CONT}
                            </SView>
                        }
                    },
                    {
                        key: "key_usuario-employee_number", label: "Employee Number", width: 120, render: ku => {
                            const user = users[ku]
                            return `${user?.employee_number}`
                        }
                    },
                    {
                        key: "key_usuario", label: "Name", width: 150, render: ku => {
                            const user = users[ku]
                            return `${user?.Nombres} ${user?.Apellidos}`
                        }
                    },

                    { key: "evento/fecha", label: "Date", width: 100, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("MONTH dd, yyyy") },
                    { key: "staff/fecha_inicio", label: "Start", center: true, width: 70, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("HH") },
                    { key: "staff/fecha_fin", label: "End", center: true, width: 70, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("HH") },
                    {
                        key: "fecha_ingreso", label: "Clock In", center: true,
                        width: 150,
                        render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("yyyy MONTH dd, HH"),
                    },
                    {
                        key: "fecha_salida", label: "Clock Out", center: true, width: 150,
                        render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("yyyy MONTH dd, HH")
                    },
                    {
                        key: "-horas", label: "Hours", center: true, width: 50,
                        cellStyle: { fontSize: 14, fontWeight: "bold" },
                        render: a => {
                            if (!a.fecha_ingreso) {
                                return "";
                            }

                            const fi = new SDate(a.fecha_ingreso, "yyyy-MM-ddThh:mm:ss.sssTZD")
                            const fs = a.fecha_salida ? new SDate(a.fecha_salida, "yyyy-MM-ddThh:mm:ss.sssTZD") : new SDate()
                            const disf = fi.diffTime(fs);
                            return ((disf / 1000) / 60 / 60).toFixed(2);

                        },
                    },

                    { key: "cliente/descripcion", label: "Client", width: 150 },
                    { key: "evento/descripcion", label: "Event", width: 150 },
                    { key: "staff_tipo/descripcion", label: "Position", width: 150 },
                    { key: "staff/descripcion", label: "Description", width: 300 },

                ]}
            />
        </SPage>
    }
}

const initStates = (state) => {
    return { state };
};
export default connect(initStates)(boss);
