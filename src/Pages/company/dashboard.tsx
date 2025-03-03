import React, { Component } from 'react';
import { Text, TextStyle, View } from 'react-native';
import { SDate, SIcon, SImage, SNavigation, SPage, SText, STheme, SView, } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { DinamicTable } from 'servisofts-table'
import Model from '../../Model';

// type DataType = typeof DATATEST[0]
type DataType = any
const Col = DinamicTable.Col<DataType>


const ImageLabel = ({ label, src, textStyle, wrap = true }) => {
    return <SView row >
        <SView width={16} height={16} style={{ borderRadius: 100, overflow: "hidden", backgroundColor: STheme.color.card }}>
            <SImage src={src} style={{
                resizeMode: "cover"
            }} />
        </SView>
        <SView width={4} />
        <Text style={[textStyle as TextStyle, { flex: 1 }]} numberOfLines={!!wrap ? 0 : 1} >{label}</Text>
    </SView>
}
export default class dashboard extends Component {

    async loadData() {

        const resp: any = await SSocket.sendPromise({
            component: "board",
            type: "principal",
            // key_usuario: Model.usuario.Action.getKey()
        })
        return resp.data;
    }

    render() {
        return <SPage title={"Eventos y posiciones"} disableScroll>
            <SView col={"xs-12"} flex>
                <DinamicTable
                    loadInitialState={async () => {
                        return {
                            "filters": [],
                            "sorters": [
                                {
                                    "key": "fecha",
                                    "order": "desc",
                                    "type": "date"
                                },
                                {
                                    "key": "inicio",
                                    "order": "desc",
                                    "type": "date",
                                    "dateFormat": "HH"
                                }
                            ],
                        }
                    }}
                    loadData={this.loadData}
                    keyExtractor={(e: any) => e.staff.key}
                    colors={{
                        text: STheme.color.gray,
                        // accent: STheme.color.secondary,
                        border: STheme.color.card,
                        // background: STheme.color.secondary,
                        header: STheme.color.barColor,
                        background: STheme.color.background,
                        card: STheme.color.card
                    }}
                    cellStyle={{
                        borderWidth: 0,
                        // padding: 4,
                        // justifyContent: "flex-start"
                    }}
                    textStyle={{
                        fontSize: 12,
                    }}

                    selectType='multiple'

                >

                    <Col key={"company"} label='Company' width={100}
                        data={e => e.row.company.descripcion}
                        customComponent={e => <ImageLabel wrap={e.colData.wrap} label={e.data} src={SSocket.api.root + "company/" + e.row?.company?.key} textStyle={e.textStyle} />}
                    />
                    <Col key={"cliente"} label='Cliente' width={100}
                        data={e => e.row.cliente.descripcion}
                        customComponent={e => <ImageLabel wrap={e.colData.wrap} label={e.data} src={SSocket.api.root + "cliente/" + e.row?.cliente?.key} textStyle={e.textStyle} />}
                    />
                    <Col key={"evento"} label='Evento' width={100}
                        data={e => e.row.evento.descripcion}
                    />
                    <Col key={"staff"} label='Position' width={100}
                        data={e => e.row.staff_tipo.descripcion}
                        customComponent={e => <ImageLabel wrap={e.colData.wrap} label={e.data} src={SSocket.api.root + "staff_tipo/" + e.row?.staff_tipo?.key} textStyle={e.textStyle} />}
                    />
                    <Col key={"staff_personal"} label='#' width={40}
                        disableFilter
                        cellStyle={{ alignItems: "center" }}
                        textStyle={{ textAlign: "center" }}
                        data={e => `${e.row.staff.count_staff_usuario} / ${e.row.staff.cantidad}`}
                    />




                    <Col key={"state"} label='State' width={70}
                        data={e => {
                            const fecha_inicio = e.row?.staff?.fecha_inicio;
                            const fecha_fin = e.row?.staff?.fecha_fin;
                            if (!fecha_inicio || !fecha_fin) return "ERROR"
                            const fecha_inicio_time = new SDate(fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").getTime();
                            const fecha_fin_time = new SDate(fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").getTime();
                            if (fecha_inicio_time > fecha_fin_time) {
                                return "ERROR"
                            }
                            if (fecha_inicio_time > new Date().getTime()) {
                                return "PENDING"
                            }
                            if (fecha_fin_time < new Date().getTime()) {
                                return "FINISHED"
                            }
                            return "READY"
                        }}
                        customComponent={e => {
                            let color: any = STheme.color.primary;
                            switch (e.dataFormat) {
                                case "ERROR":
                                    color = STheme.color.danger;
                                    break;
                                case "PENDING":
                                    color = STheme.color.warning;
                                    break;
                                case "FINISHED":
                                    color = STheme.color.lightGray;
                                    break;
                                case "READY":
                                    color = STheme.color.success;
                                    break;
                            }

                            return <SView col={"xs-12"} center >
                                <SView padding={3} center style={{
                                    backgroundColor: color,
                                    borderRadius: 4,
                                }}>
                                    <Text style={[e.textStyle as TextStyle, { color: "#fff", fontWeight: "bold", fontSize: 10 }]} >{e.dataFormat}</Text>
                                </SView>
                            </SView>
                        }} />
                    <Col key={"actions"} label='Actions' width={50}
                        data={e => ""}
                        disableFilter
                        disableExport
                        disableSorter
                        customComponent={e => <View style={{ flexDirection: "row" }} >
                            <SView width={20} height padding={1} center onPress={() => {
                                SNavigation.navigate("/staff/users", { pk: e.row.staff.key })
                            }} >
                                <SIcon name={"Eyes"} fill={e.dinamicTable.colors.accent} />
                            </SView>
                            <SView width={20} height padding={2} center onPress={() => {
                                SNavigation.navigate("/company/event", { key_evento: e.row.evento.key })
                            }} >
                                <SIcon name={"Pencil"} fill={e.dinamicTable.colors.accent} />
                            </SView>
                        </View>}

                    />
                    <Col key={"fecha"} label='Fecha' width={130}
                        textStyle={{
                            textAlign: "right"
                        }}
                        dataType='date'
                        data={e => new SDate(e.row.evento.fecha, "yyyy-MM-ddThh:mm:ss").date}
                        dateFormat='MONTH dd, yyyy'
                        // format={e => new SDate(e.data).toString("MONTH dd, yyyy")}

                    />
                    <Col key={"inicio"} label='Inicio' width={80}
                        dataType='date'
                        disableFilterGroup
                        data={e => new SDate(e.row.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").date}
                        dateFormat='HH'

                    // format={e => new SDate(e.data).toString("HH")}
                    // textStyle={{ color: STheme.color.success }}
                    />

                    <Col key={"fin"} label='Fin' width={80}
                        dataType='date'
                        data={e => !e.row.staff.fecha_fin ? null : new SDate(e.row.staff.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").date}
                        disableFilterGroup
                        dateFormat='HH'
                    />
                    <Col key={"horas"} label='Horas' width={60}
                        dataType='number'
                        disableFilterGroup
                        textStyle={{
                            textAlign: "right",
                            fontWeight: "bold"
                        }}
                        data={e => {
                            const time = new SDate(e.row.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").diffTime(new SDate(e.row.staff.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD"))
                            return time / 1000 / 60 / 60
                        }}
                        format={e => Number.isInteger(e.data) ? e.data : e.data.toFixed(2)}
                    />
                    <Col key={"staff_descripcion"} label='Staff Descripcion' width={200}
                        disableFilterGroup
                        data={e => e.row.staff.descripcion}
                    // wrap={false}
                    />

                    {/* <Col key={"testcustom"} label='TestCustom'
                        data={e => e.row.apellido}
                        customComponent={e => <Text style={[e.textStyle as TextStyle, { color: "#f0f" }]} >{e.dataFormat}</Text>} /> */}
                </DinamicTable>
            </SView>
        </SPage>
    }
}
