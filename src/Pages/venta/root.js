import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SLoad, SNavigation, SPage, SText, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { venta_states } from '.';



export default class root extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.key = SNavigation.getParam("key");
    }

    componentDidMount() {
        this.getVenta()
    }
    getVenta(extra = {}) {
        if (this.state.loading) return;
        this.state.loading = true
        SSocket.sendPromise({
            component: "venta",
            type: "getByKey",
            key: this.key
        }).then(e => {
            this.state.loading = false
            console.log(e);
            this.setState({ venta: { ...e.data, ...extra } })
        }).catch(e => {
            this.state.loading = false
            console.log(e);
            // this.setState({ loading:})
        })
    }
    handleReload = (extra) => {
        this.getVenta(extra)
    }

    renderState = () => {
        if (!this.state.venta) return <SView center padding={8}>
            <SLoad />
            <SHr />
            <SText>Obteniendo la venta...</SText>
        </SView>
        const { state } = this.state.venta;
        const COMPONENT = venta_states[state]
        if (!COMPONENT) return <SText>{`STATE NOT FOUND ( ${state} )`}</SText>
        return <COMPONENT data={this.state.venta} reload={this.handleReload.bind(this)} />
    }

    render() {
        return <SPage title={"Venta"} >
            {this.renderState()}
        </SPage>
    }
}
