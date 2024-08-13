import React, { Component } from 'react'
import SSocket from 'servisofts-socket'
import { SDate, SHr, SInput, SLoad, SMath, SNavigation, SPage, STable2, STheme, SView } from 'servisofts-component'
import { SelectEntreFechas } from '../../Components/Fechas'
import { Container } from '../../Components'
import Config from '../../Config'
import { Linking } from 'react-native'
export default class index extends Component {
    state = {
        ...(SNavigation.getAllParams() ?? {}),
        fecha_inicio: SNavigation.getParam("fecha_inicio", new SDate().setDay(1).toString("yyyy-MM-dd")),
        fecha_fin: SNavigation.getParam("fecha_fin", new SDate().setDay(1).addMonth(1).addDay(-1).toString("yyyy-MM-dd")),
    }
    componentDidMount() {
        this.getData({
            fecha_inicio: this.state.fecha_inicio,
            fecha_fin: this.state.fecha_fin,
        })
    }
    getData({ fecha_inicio, fecha_fin }) {
        this.state.fecha = { fecha_inicio, fecha_fin };
        const request = {
            component: "reportes",
            type: "ventas_por_evento_detalle",
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin,
            key_evento: this.state.key_evento
        }
        this.setState({ loading: true })
        SSocket.sendHttpAsync(SSocket.api.root + "api", request).then(e => {
            console.log(e);
            let keys = [...new Set(Object.values(e.data).map(a => a.key_usuario).filter(key => key !== null))];
            SSocket.sendPromise({
                version: "2.0",
                service: "usuario",
                component: "usuario",
                type: "getAllKeys",
                keys: keys,
            }).then(e2 => {
                Object.values(e.data).map(a => {
                    a.usuario = e2?.data[a.key_usuario]?.usuario ?? {}
                })
                this.setState({ data: e.data })
            }).catch(e2 => {
                SPopup.alert(e2.error)
            })
            this.setState({ data: e.data, loading: false })
        }).catch(e => {
            this.setState({ loading: false, error: e?.error })
            console.error(e);
        })
    }

    getTable() {
        if (!this.state.data) return null
        return <STable2
            rowHeight={24}
            headerColor='#666'
            cellStyle={{
                fontSize: 14,
                padding: 2,
            }}
            header={[
                { key: "index", width: 30 },
                { key: "fecha_on", width: 140, order: "desc", orderType: "date", render: a => new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm:ss") },
                { key: "usuario/Nombres", width: 100 },
                { key: "usuario/Apellidos", width: 100 },
                {
                    key: "usuario/Telefono",
                    width: 100,
                    label: "WhatsApp",
                    cellStyle: {
                        color: "#7AD26D"
                    },
                    onPress: (e) => {

                        const link = "https://wa.me/" + e.replace(/\+|\s/g, "");
                        console.log(link);
                        Linking.openURL(link)
                    }
                },
                { key: "usuario/Correo", width: 200 },

                // { key: "usuario/Correo", width: 100 },
                {
                    key: "tipo", width: 70
                },
                { key: "producto", width: 100 },
                { key: "tipo_pago", width: 100 },
                { key: "cantidad", width: 70, sumar: true, center: true },
                { key: "precio", width: 70, sumar: true, cellStyle: { textAlign: "right" } },
                { key: "-total", width: 70, sumar: true, cellStyle: { textAlign: "right" }, render: a => a.cantidad * a.precio },
                // { key: "key_usuario", width: 70 },
            ]}
            limit={50}
            data={this.state?.data} />
    }
    render() {
        return (
            <SPage title="Productos más vendidos" disableScroll>
                {/* <Container>
                    <SelectEntreFechas fecha_inicio={this.state.fecha_inicio} fecha_fin={this.state.fecha_fin} onChange={e => this.getData(e)} />
                </Container> */}
                {/* <SHr /> */}
                <SView flex>
                    {this.getTable()}
                </SView>
            </SPage>
        )
    }
}