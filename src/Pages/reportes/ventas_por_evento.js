import React, { Component } from 'react'
import SSocket from 'servisofts-socket'
import { SDate, SHr, SInput, SLoad, SMath, SNavigation, SPage, STable2, SView } from 'servisofts-component'
import { SelectEntreFechas } from '../../Components/Fechas'
import { Container } from '../../Components'
import Config from '../../Config'
export default class index extends Component {
    state = {
        fecha_inicio: SNavigation.getParam("fecha_inicio", new SDate().setDay(1).toString("yyyy-MM-dd")),
        fecha_fin: SNavigation.getParam("fecha_fin", new SDate().setDay(1).addMonth(1).addDay(-1).toString("yyyy-MM-dd")),
    }
    getData({ fecha_inicio, fecha_fin }) {
        this.state.fecha = { fecha_inicio, fecha_fin };
        const request = {
            component: "reportes",
            type: "ventas_por_eventos",
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin,
        }
        this.setState({ loading: true })
        SSocket.sendHttpAsync(SSocket.api.root + "api", request).then(e => {
            console.log(e);
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
                { key: "descripcion", width: 150, },
                { label:"fecha", key: "fecha", width: 150, order:"desc" },
                { key: "entradas/cantidad", width: 70 },
                { key: "entradas/monto", width: 70 },
                { key: "mesas/cantidad", width: 70 },
                { key: "mesas/monto", width: 70 },
                { key: "key-", label:"Detalle",width: 70, render: (data) => `${Config.URLDeepLink}/reportes/ventas_por_evento_detalle?key_evento=${data}&fecha_inicio=${this.state.fecha_inicio}&fecha_fin=${this.state.fecha_fin}`, onPress: (e) => { SNavigation.openDeepLink(e) } },
                { key: "key-2",label:"Grafico", width: 70, render: (data) => `${Config.URLDeepLink}/reportes/ventas_por_evento_grafico?key_evento=${data}&fecha_inicio=${this.state.fecha_inicio}&fecha_fin=${this.state.fecha_fin}`, onPress: (e) => { SNavigation.openDeepLink(e) } },
                { key: "key-3",label:"Entradas", width: 70, render: (data) => `${Config.URLDeepLink}/reportes/entradas_por_evento?key_evento=${data}`, onPress: (e) => { SNavigation.openDeepLink(e) } },
                // { key: "prdcod", width: 70, label: "Código" },
                // { key: "prdnom", width: 300, label: "Nombre producto" },
                // { key: "cantidad", width: 100, cellStyle: { textAlign: "center" }, sumar: true, order: "desc" },
                // { key: "monto", width: 100, cellStyle: { textAlign: "right" }, sumar: true, render: a => SMath.formatMoney(a), renderTotal: a => SMath.formatMoney(a) },
            ]}
            limit={50}
            data={this.state?.data} />
    }
    render() {
        return (
            <SPage title="Eventos" disableScroll>
                <Container>
                    <SelectEntreFechas fecha_inicio={this.state.fecha_inicio} fecha_fin={this.state.fecha_fin} onChange={e => this.getData(e)} />
                </Container>
                <SHr />
                <SView flex>
                    {this.getTable()}
                </SView>
            </SPage>
        )
    }
}