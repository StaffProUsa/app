import React, { Component } from 'react';
import { Text, TextStyle, View } from 'react-native';
import { SDate, SIcon, SImage, SNavigation, SPage, SText, STheme, SView, } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { DinamicTable } from 'servisofts-table'

// type DataType = typeof DATATEST[0]
type DataType = any
const Col = DinamicTable.Col<DataType>


const ImageLabel = ({ label, src, textStyle }) => {
    return <SView row >
        <SView width={16} height={16} style={{ borderRadius: 100, overflow: "hidden", backgroundColor: STheme.color.card }}>
            <SImage src={src} style={{
                resizeMode: "cover"
            }} />
        </SView>
        <SView width={4} />
        <Text style={[textStyle as TextStyle, { flex: 1 }]} numberOfLines={1} >{label}</Text>
    </SView>
}
export default class dashboardTimeSheets extends Component {

    key_evento = SNavigation.getParam("pk")

    getByKeys = async (keys: string[]) => {
        // let keys = [...new Set(Object.values(e.data).map(a => a.key_usuario).filter(key => key !== null))

        const request = {
            version: "2.0",
            service: "usuario",
            component: "usuario",
            type: "getAllKeys",
            keys: keys,
        }
        const response: any = await SSocket.sendPromise(request)
        const data = Object.values(response.data).map((a: any) => a.usuario) as any[];
        return data;
    }

    async loadData() {
        const resp: any = await SSocket.sendPromise({
            component: "board",
            type: "timesheet",
            key_evento: this.key_evento
        })

        let keys: any[] = [...new Set(resp.data.map((a: any) => a.staff_usuario.key_usuario).filter(key => key !== null))]
        keys = [...keys, ...new Set(resp.data.map((a: any) => a.staff_usuario.key_usuario_atiende).filter(key => key !== null))]
        let usuarios = await this.getByKeys(keys);
        resp.data = Object.values(resp.data).map((a: any) => {
            a.usuario = usuarios.find((b: any) => b.key == a.staff_usuario.key_usuario)
            a.usuario_atiende = usuarios.find((b: any) => b.key == a.staff_usuario.key_usuario_atiende)
            return a;
        })


        return resp.data;
    }

    render() {
        return <SPage title={"Test"} disableScroll>
            <SView col={"xs-12"} flex>
                <DinamicTable loadData={this.loadData.bind(this)}
                    colors={{
                        text: STheme.color.text,
                        // accent: STheme.color.secondary,
                        border: STheme.color.card,
                        // background: STheme.color.secondary,
                        background: STheme.color.barColor,
                        card: STheme.color.card
                    }}
                    cellStyle={{
                        borderWidth: 0,
                        height: 30,
                        // borderBottomWidth:1,
                    }}
                    textStyle={{
                        fontSize: 12,
                    }}
                >
                    <Col key={"index"} label='#' width={30}
                        data={e => e.index + 1}
                    />
                    <Col key={"inicio"} label='Fecha' width={80}
                        dataType='date'
                        data={e => new SDate(e.row.staff.fecha_inicio, "yyyy-MM-dd").date}
                        format={e => new SDate(e.data).toString("yyyy-MM-dd")}
                    // textStyle={{ color: STheme.color.success }}
                    />
                    <Col key={"usuario"} label='Usuario' width={120}
                        data={e => `${e.row.usuario?.Nombres} ${e.row.usuario?.Apellidos}`}
                        customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "usuario/" + e.row?.usuario?.key} textStyle={e.textStyle} />}
                    />

                    <Col key={"usuario_atiende"} label='Boss' width={120}
                        data={e => `${e.row.usuario_atiende?.Nombres ?? ""} ${e.row.usuario_atiende?.Apellidos ?? ""}`}
                        customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "usuario/" + e.row?.usuario_atiende?.key} textStyle={e.textStyle} />}
                    />

                    <Col key={"staff"} label='Position' width={100}
                        data={e => e.row.staff_tipo.descripcion}
                        customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "staff_tipo/" + e.row?.staff_tipo?.key} textStyle={e.textStyle} />}
                    />
                    <Col key={"inicio"} label='Inicio' width={80}
                        dataType='date'
                        data={e => new SDate(e.row.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").date}
                        format={e => new SDate(e.data).toString("HH")}
                    // textStyle={{ color: STheme.color.success }}
                    />

                    <Col key={"fin"} label='Fin' width={80}
                        dataType='date'
                        data={e => (!e.row.staff_usuario.fecha_ingreso) ? null : new SDate(e.row.staff_usuario.fecha_salida, "yyyy-MM-ddThh:mm:ssTZD").date}
                        format={e => (!e.row.staff_usuario.fecha_ingreso) ? null : new SDate(e.data).toString("HH")}
                    // textStyle={{ color: STheme.color.danger }}
                    />
                    <Col key={"horas"} label='Horas' width={60}
                        dataType='number'
                        cellStyle={{
                            // alignItems: "flex-end"

                        }}
                        textStyle={{
                            fontWeight: "bold"
                        }}
                        data={e => {
                            if (!e.row.staff_usuario.fecha_ingreso) return "";
                            const time = new SDate(e.row.staff_usuario.fecha_ingreso, "yyyy-MM-ddThh:mm:ssTZD").diffTime(new SDate(e.row.staff_usuario.fecha_salida, "yyyy-MM-ddThh:mm:ssTZD"))
                            return isNaN(time) ? "" : time / 1000 / 60 / 60;
                        }}
                        format={e => isNaN(e.data) ? null : Number.isInteger(e.data) ? e.data : e.data.toFixed(2)}
                    />

                </DinamicTable>
            </SView>
        </SPage>
    }
}
