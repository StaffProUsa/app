import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SNavigation, SPage, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import EntradaItem from '../entradas/Components/EntradaItem';
import { Container } from '../../Components';
// import ItemEntrega from './Components/ItemEntrega';


export default class entradas extends Component {
    state = {
        data: [],
        key_evento: SNavigation.getParam("key_evento"),
        key_venta: SNavigation.getParam("key_venta"),
    }
    componentDidMount() {
        SSocket.sendPromise({
            component: "evento",
            type: "getEntregas",
            key_evento: this.state.key_evento,
            key_venta: this.state.key_venta,
        }).then(e => {
            this.setState({ data: Object.values(e.data).sort((a, b) => a.key_tipo_entrada > b.key_tipo_entrada ? -1 : 1) })
        }).catch(e => {
            console.error(e);
        })
    }
    handleRefresh = async () => {
        this.state.data = [];
        this.componentDidMount();
    };
    render() {
        return <SPage title={"Entradas"}>
            <Container>
                <SView col={"xs-12"}>
                    <FlatList
                        refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh.bind(this)} />
                        }
                        data={this.state.data}
                        keyExtractor={item => item.key.toString()}
                        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                        // numColumns={2}
                        renderItem={({ item, index }) => {
                            return <EntradaItem key={item.key} data={item} onChange={(obj) => {
                                this.state.data[index] = obj;
                                this.setState({ ...this.state })
                            }} />
                        }}
                    />
                </SView>
            </Container>
        </SPage>
    }
}
