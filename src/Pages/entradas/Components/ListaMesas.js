import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';
import { SHr, SText, SView } from 'servisofts-component';
import MesaItem from './MesaItem';

export default class ListaMesas extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        this.loadData()
    }

    loadData() {
        SSocket.sendPromise({
            component: "mesa",
            // type: "getMisMesas",
            type: "getMisMesasGroup",
            key_usuario: Model.usuario.Action.getKey(),
        }).then(e => {
            this.setState({ data: Object.values(e.data), refreshing: false })
        }).catch(e => {
            this.setState({ refreshing: false })
        })
    }

    agruparData(data) {
        const groupedData = data.reduce((acc, item) => {
            const { key_evento } = item;
            if (!acc[key_evento]) {
                acc[key_evento] = [];
            }
            acc[key_evento].push(item);
            return acc;
        }, {});
        return Object.values(groupedData);
    }


    handleRefresh = async () => {
        // this.state.page = 0;
        this.state.data = [];
        // this.state.endData = false;
        this.setState({ refreshing: true })
        this.loadData();
        // this.requestData();
    };
    render() {
        if (!this.state.data) return;
        var dataAgrupado = this.agruparData(this.state.data)
        console.log("dataAgrupado", dataAgrupado)

        return <SView col={"xs-12"} height>
            <SHr height={20} />
            <FlatList
                data={this.state.data}
                // data={dataAgrupado}
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh.bind(this)} />
                }
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                ListFooterComponent={() => <View style={{ height: 100 }} />}
                renderItem={(props) => <MesaItem data={props.item} />}
            />
        </SView>
    }
}
