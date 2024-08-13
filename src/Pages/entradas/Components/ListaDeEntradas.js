import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SHr, SInput, SList, SSwitch, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';
import EntradaItem from './EntradaItem';

export default class ListaDeEntradas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtros: {
                ver_disponibles: true,
                ver_invitados: false,
                ver_entregadas: false,
            }
        };
    }

    componentDidMount() {
        this.getData()
    }
    getData() {
        SSocket.sendPromise({
            component: "entrada",
            type: "getMisEntradas",
            key_usuario: Model.usuario.Action.getKey(),
        }).then(e => {
            this.setState({ entradas: Object.values(e.entradas), refreshing: false })
        }).catch(e => {
            this.setState({ refreshing: false })
        })
    }


    handleFilter(a) {
        if (!this.state.filtros.ver_disponibles) {
            if (!a.key_participante && !a.fecha_entrega) return false;
        }

        if (!this.state.filtros.ver_entregadas) {
            if (!!a.fecha_entrega) return false;
        }
        if (this.state.filtros.ver_disponibles) {
            if (a.key_participante == Model.usuario.Action.getKey()) return true;
        }
        if (!this.state.filtros.ver_invitados) {
            if (!!a.key_participante) return false;
        }



        return true;
    }

    renderFilterItem({ key, label }) {
        return <SText padding={8} fontSize={10} underLine color={!this.state.filtros[key] ? STheme.color.lightGray : STheme.color.text}
            onPress={() => {
                this.state.filtros[key] = !this.state.filtros[key]
                this.setState({ ...this.state })
            }}
        >{!this.state.filtros[key] ? "Ver" : "Ocultar"} {label}</SText>
    }
    renderFilter() {
        return <SView row>
            {this.renderFilterItem({ key: "ver_disponibles", label: "disponibles" })}
            {this.renderFilterItem({ key: "ver_invitados", label: "con invitados" })}
            {this.renderFilterItem({ key: "ver_entregadas", label: "entregadas" })}
        </SView>
    }
    handleRefresh = async () => {
        // this.state.page = 0;
        this.state.entradas = [];
        // this.state.endData = false;
        this.setState({ refreshing: true })
        this.getData();
        // this.requestData();
    };
    render() {
        return <SView col={"xs-12"} height>
            {this.renderFilter()}
            <FlatList
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh.bind(this)} />
                }
                data={(this.state.entradas ?? []).filter(this.handleFilter.bind(this))}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                ListFooterComponent={() => <View style={{ height: 100 }} />}
                renderItem={(props) => <EntradaItem data={props.item} />}
            />
        </SView>
    }
}
