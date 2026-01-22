import React, { Component } from 'react';
import { View, Text, TextStyle } from 'react-native';
import { SDate, SIcon, SNotification, SPage, SPopup, STable2, SText, STheme, SView, SLanguage, SImage, SNavigation } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import { connect } from 'react-redux';
import InputHora from '../Components/NuevoInputs/InputHora';
import InputFloat from '../Components/NuevoInputs/InputFloat';
import { DinamicTable } from 'servisofts-table';
import Config from '../Config';
import TableIcon from '../Components/Table/TableIcon';
import Col from 'servisofts-table/DinamicTable/Col';
import BtnWhatsapp from '../Components/BtnWhatsapp';

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
    key_staff = SNavigation.getParam("key_staff")
    sta = SNavigation.getParam("sta")
    componentDidMount() {
        // this.loadData()
    }

    loadData = async () => {
        const resp = await SSocket.sendPromise({
            component: "staff_usuario",
            type: "getMisTrabajadoresBoss",
            key_usuario: Model.usuario.Action.getKey(),
            key_staff: this.key_staff
        })
        // return resp.data
        let ks = Object.values(resp.data).map((a) => a.key_usuario).filter(key => key !== null);
        let keys = [...new Set(ks.filter(key => key !== null))]

        const request = {
            version: "2.0",
            service: "usuario",
            component: "usuario",
            type: "getAllKeys",
            keys: keys,
        }
        const response = await SSocket.sendPromise(request)
        const dataUsuarios = Object.values(response.data).map((a) => a.usuario);

        const data = Object.values(resp.data).map((a) => {
            let usuario = dataUsuarios.find((b) => b.key == a.key_usuario);
            return {
                ...a,
                usuario: usuario,
            }
        })

        return data
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
        //const users = Model.usuario.Action.getAll() ?? {};
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
                        const filter = []
                        if (this.sta) {
                            filter.push({
                                "col": "state",
                                "operator": "=",
                                "type": "string",
                                "value": [
                                    this.sta
                                ]
                            })
                        }

                        return {
                            "filters": filter,
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
                    <DinamicTable.Col key={"status"} label={SLanguage.select({ en: "Status", es: "Estado" })} width={140}
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
                    <Col key={"state"} label={SLanguage.select({ es: "State", en: "Estado" })} width={70}
                        data={e => {

                            if (e.row?.fecha_salida) {
                                return "COMPLETED"
                            }

                            if (e.row?.fecha_ingreso) {
                                return "READY"
                            }

                            //if (new SDate(e.row?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").getTime() < new SDate().getTime()) {
                            // return "FINISHED"
                            //}

                            return "PENDING"

                        }}

                        customComponent={e => {
                            let color = STheme.color.primary;
                            switch (e.dataFormat) {
                                case "FINISHED":
                                    color = STheme.color.danger;
                                    break;
                                case "READY":
                                    color = STheme.color.warning;
                                    break;
                                case "PENDING":
                                    color = STheme.color.lightGray;
                                    break;
                                case "COMPLETED":
                                    color = STheme.color.success;
                                    break;
                            }

                            return <SView col={"xs-12"} center >
                                <SView padding={3} center style={{
                                    backgroundColor: color,
                                    borderRadius: 4,
                                }}>
                                    <Text style={[e.textStyle, { color: "#fff", fontSize: 10 }]} >{e.dataFormat}</Text>
                                </SView>
                            </SView>
                        }} />

                    {/* <DinamicTable.Col key={"fecha"} label={SLanguage.select({ es: "Fecha", en: "Date" })} width={80}
                        dataType='date'
                        data={e => new SDate(e.row.evento.fecha, "yyyy-MM-dd").date}
                        format={e => new SDate(e.data).toString("yyyy-MM-dd")}
                    /> */}
                    <DinamicTable.Col key={"cliente"} label={SLanguage.select({ en: "Client", es: "Cliente" })} width={100}
                        data={e => e.row.cliente.descripcion}
                        labelIcon={<TableIcon name='icliente' />}
                        customComponent={e => <ImageLabel wrap={e.colData.wrap} label={e.data} src={SSocket.api.root + "cliente/" + e.row?.cliente?.key} textStyle={e.textStyle} />}

                    />
                    <DinamicTable.Col key={"evento"} label={SLanguage.select({ en: "Event", es: "Evento" })} width={100}
                        data={e => e.row.evento.descripcion}

                    />

                    <DinamicTable.Col key={"employee_number"} label={SLanguage.select({ en: "Employee Number", es: "Número de empleado" })} width={70}
                        data={e => { return e.row?.usuario_company?.employee_number }}
                    />
                    <DinamicTable.Col key={"nombre"} label={SLanguage.select({ en: "User", es: "Usuario" })} width={100}
                        data={e => { return e.row?.usuario?.Nombres + " " + e.row?.usuario?.Apellidos }

                        }
                    />
                    <DinamicTable.Col key={"Telefono_"} label={SLanguage.select({ en: "Phone", es: "Teléfono" })} width={100}
                        data={e => { return e.row?.usuario?.Telefono }}
                        customComponent={e => <BtnWhatsapp telefono={e.row?.usuario?.Telefono}
                            texto={e.row.evento.observacion}
                        >
                            <SText fontSize={11} color={STheme.color.text} underLine>
                                {e.row?.usuario?.Telefono}
                            </SText>
                        </BtnWhatsapp>}
                    />
                    {/* <DinamicTable.Col key={"salario"} label={SLanguage.select({ en: "Salary", es: "Salario" })}
                        width={100}
                        data={e => e.row?.salario_hora}
                    /> */}
                    <DinamicTable.Col key={"staff"}
                        labelIcon={<TableIcon name='iposition' />}
                        label={SLanguage.select({ es: "Posición", en: "Position" })} width={100}
                        data={e => e.row.staff_tipo.descripcion}
                        customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "staff_tipo/" + e.row?.staff_tipo?.key} textStyle={e.textStyle} />}
                    />

                     <DinamicTable.Col key={"staff_"}
                        // labelIcon={<TableIcon name='iposition_' />}
                        label={SLanguage.select({ es: "Ubicación", en: "Location" })} width={140}
                        data={e => e.row.staff.location}
                        // customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "staff_tipo/" + e.row?.staff_tipo?.key} textStyle={e.textStyle} />}
                    />

                    <DinamicTable.Col key={"inicio"} label={SLanguage.select({ es: "Hora inicio", en: "Clock In" })} width={80}
                        dataType='date'
                        data={e => (!e.row.fecha_ingreso) ? null : new SDate(e.row.fecha_ingreso, "yyyy-MM-ddThh:mm:ssTZD").date}
                        // format={e => new SDate(e.data).toString("HH")}
                        dateFormat='HH'
                    />

                    <DinamicTable.Col key={"fin"} label={SLanguage.select({ es: "Hora fin", en: "Clock Out" })} width={80}
                        dataType='date'
                        data={e => (!e.row.fecha_salida) ? null : new SDate(e.row.fecha_salida, "yyyy-MM-ddThh:mm:ssTZD").date}
                        dateFormat='HH'
                    />
                    <DinamicTable.Col key={"horas"} label={SLanguage.select({ es: "Horas", en: "Times" })} width={60}
                        dataType='number'
                        data={e => {
                            if (!e.row.fecha_ingreso || !e.row.fecha_salida) return 0;
                            let hora44 = this.calculador_hora(e.row.fecha_ingreso, e.row.fecha_salida);
                            return hora44;
                        }}

                        format={a => !a.data ? null : a.data.toFixed(2)}
                        cellStyle={{ alignItems: "flex-end" }}
                        sumExcel
                        excelFormat='0.00'
                        listFooterComponent={(p) => {
                            if (!p.dinamicTable.dataFiltrada) return null;
                            if (p.dinamicTable.dataFiltrada.length == 0) return null;
                            const total = p.dinamicTable.dataFiltrada.reduce((acc: number, e: any) => {
                                return acc + (e.horas ?? 0);
                            }, 0);
                            console.log(total);
                            // console.log(p.dinamicTable.dataFiltrada);
                            return <SView col={"xs-12"} center backgroundColor={STheme.color.barColor} style={{ borderWidth: 1, borderColor: "#99999965", borderTopWidth: 0 }} >
                                <SText fontSize={7} color={STheme.color.text}>{"Sum:"}</SText>
                                <SText col={"xs-12"} color={STheme.color.text} fontSize={10} style={{ textAlign: "right" }}>{total.toFixed(2)}</SText>
                            </SView>
                        }}
                    // format={e => e.data.toFixed(2)}
                    />
                    {/* <DinamicTable.Col key={"subtotal"} label={SLanguage.select({ es: "Subtotal", en: "Subtotal" })} width={60}
                        dataType='number'
                        data={e => {
                            if (!e.row.fecha_ingreso || !e.row.fecha_salida) return 0;
                            let hora44: any = this.calculador_hora(e.row.fecha_ingreso, e.row.fecha_salida);
                            let dadda = parseFloat(hora44 ?? "") * e.row?.salario_hora;
                            return dadda;
                        }}
                        format={a => !a.data ? null : a.data.toFixed(2)}
                        cellStyle={{ alignItems: "flex-end" }}
                        excelFormat='0.00'
                        sumExcel
                        listFooterComponent={(p) => {
                            if (!p.dinamicTable.dataFiltrada) return null;
                            if (p.dinamicTable.dataFiltrada.length == 0) return null;
                            console.log(p.dinamicTable.dataFiltrada);
                            const total = p.dinamicTable.dataFiltrada.reduce((acc: number, e: any) => {
                                return acc + (e.subtotal ?? 0);
                            }, 0);
                            // console.log(p.dinamicTable.dataFiltrada);
                            return <SView col={"xs-12"} center backgroundColor={STheme.color.barColor} style={{ borderRightWidth: 1, borderColor: "#99999965", borderBottomWidth: 1 }} >
                                <SText fontSize={7} color={STheme.color.text}>{"Sum:"}</SText>
                                <SText col={"xs-12"} color={STheme.color.text} fontSize={10} style={{ textAlign: "right" }}>{total.toFixed(2)}</SText>
                            </SView>
                        }}
                    /> */}



                </DinamicTable>
            </SView >
        </SPage>
    }
}




const initStates = (state) => {
    return { state };
};
export default connect(initStates)(boss);
