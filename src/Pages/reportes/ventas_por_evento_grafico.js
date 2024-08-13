import React, { Component } from 'react'
import SSocket from 'servisofts-socket'
import { SDate, SHr, SInput, SLoad, SMath, SNavigation, SPage, STable2, SText, STheme, SView } from 'servisofts-component'
import { SelectEntreFechas } from '../../Components/Fechas'
import { Container } from '../../Components'
import Config from '../../Config'
import { Linking } from 'react-native'
import SCharts from "servisofts-charts"
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
            type: "ventas_por_evento_grafico",
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin,
            key_evento: this.state.key_evento
        }
        this.setState({ loading: true })
        SSocket.sendHttpAsync(SSocket.api.root + "api", request).then(e => {
            console.log(e);
            // let keys = [...new Set(Object.values(e.data).map(a => a.key_usuario).filter(key => key !== null))];
            // SSocket.sendPromise({
            //     version: "2.0",
            //     service: "usuario",
            //     component: "usuario",
            //     type: "getAllKeys",
            //     keys: keys,
            // }).then(e2 => {
            //     this.setState({ data: e.data })
            // }).catch(e2 => {
            //     SPopup.alert(e2.error)
            // })
            this.setState({ data: e.data, loading: false })
            recargar();
        }).catch(e => {
            this.setState({ loading: false, error: e?.error })
            console.error(e);
        })
    }

    recargar=async()=>{
        await  setTimeout(() => {resolve()}, 10000);
        
        getData({fecha_inicio:this.state.fecha_inicio, fecha_fin:this.state.fecha_fin})
    }

    getTable() {
        if (!this.state.data) return <SLoad />
        return <SCharts
            showGuide
            showValue
            showLabel
            strokeWidth={1}
            textColor='#fff'
            colors={["#ffff00", "#ff00ff", "#00ffff"]}
            data={this.state.data}
            type='Column'
        />
    }
    render() {
        return (
            <SPage title="Productos más vendidos" disableScroll>
                {/* <Container>
                    <SelectEntreFechas fecha_inicio={this.state.fecha_inicio} fecha_fin={this.state.fecha_fin} onChange={e => this.getData(e)} />
                </Container> */}
                {/* <SHr /> */}

                <SView flex height>
                    {this.getTable()}

                </SView>
            </SPage>
        )
    }
}