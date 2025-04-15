
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SImage, SNotification, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { DinamicTable } from 'servisofts-table';
import Config from '../../../Config';

export default class MoveStaff extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    loadData = async () => {
        console.log("ENTRO ACAAAA")
        const resp = await SSocket.sendPromise({
            component: "staff",
            type: "getStaffChange",
            key_staff: this.props.key_staff,
        })
        return resp.data
        // return ["asdsa", "ASdsad", "fgdghe", "$35345"]
    }
    handleChange = ({ key_staff_to }) => {
        SSocket.sendPromise({
            component: "staff_usuario",
            type: "cambiarEvento",
            data: this.props.staff_usuario_list,
            key_staff: key_staff_to,
        }).then(e => {
            SNotification.send({
                key: "staff_usuario-asingJefe",
                title: "Successfully applied.",
                body: "Successfully registered.",
                color: STheme.color.success,
                time: 5000,
            })
            if (this.props.onChange) {
                this.props.onChange()
            }
        }).catch(e => {
            console.error(e)

        })
    }
    render() {
        return <SView col={"xs-12"} flex>
            <DinamicTable loadData={this.loadData.bind(this)}
                colors={Config.table.styles()}
                cellStyle={Config.table.cellStyle()}
                textStyle={Config.table.textStyle()}>
                <DinamicTable.Col key={"company"} data={p => p.row.company.descripcion} label='Company'
                    customComponent={e => <ImageLabel wrap={e.colData.wrap} label={e.data} src={SSocket.api.root + "company/" + e.row?.company?.key} textStyle={e.textStyle} />}
                />
                <DinamicTable.Col key={"cliente"} data={p => p.row.cliente.descripcion} label='Client'
                    customComponent={e => <ImageLabel wrap={e.colData.wrap} label={e.data} src={SSocket.api.root + "cliente/" + e.row?.cliente?.key} textStyle={e.textStyle} />}
                />
                <DinamicTable.Col key={"evento"} data={p => p.row.evento.descripcion} label='Event'
                />
                <DinamicTable.Col key={"staff"} label='Position' width={100}
                    data={e => e.row.staff_tipo.descripcion}
                    customComponent={e => <ImageLabel wrap={e.colData.wrap} label={e.data} src={SSocket.api.root + "staff_tipo/" + e.row?.staff_tipo?.key} textStyle={e.textStyle} />}
                />
                <DinamicTable.Col key={"fecha"} label='Fecha' width={130}
                    textStyle={{
                        textAlign: "right"
                    }}
                    dataType='date'
                    data={e => new SDate(e.row.evento.fecha, "yyyy-MM-ddThh:mm:ss").date}
                    format={e => new SDate(e.data).toString("MONTH dd, yyyy")}

                />
                <DinamicTable.Col key={"inicio"} label='Inicio' width={80}
                    dataType='date'
                    data={e => new SDate(e.row.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").date}
                    // dateFormat='hh:mm'
                    dateFormat='HH'
                // format={e => new SDate(e.data).toString("HH")}
                // textStyle={{ color: STheme.color.success }}
                />

                <DinamicTable.Col key={"fin"} label='Fin' width={80}
                    dataType='date'
                    data={e => !e.row.staff.fecha_fin ? null : new SDate(e.row.staff.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").date}
                    dateFormat='HH'
                // format={e => new SDate(e.data).toString("HH")}
                // textStyle={{ color: STheme.color.danger }}
                />

                <DinamicTable.Col key={"select"} label='Select' width={80}
                    data={e => "select"}
                    customComponent={e => <SText onPress={() => {
                        this.handleChange({ key_staff_to: e.row.staff.key })
                    }} card padding={4} bold center>{"SELECT"}</SText>}
                // format={e => new SDate(e.data).toString("HH")}
                // textStyle={{ color: STheme.color.danger }}
                />
            </DinamicTable>
        </SView >
    }
}


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