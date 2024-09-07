import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SDate, SIcon, SLoad, SPage, SText, STheme, SThread, SView, SNavigation, SImage, SLanguage, SGradient, SHr, SList } from 'servisofts-component';
import Model from '../../../Model';
import SSocket from 'servisofts-socket';

export default class TrabajosDelEvento extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curtime: new SDate()
        };
    }

    componentDidMount() {
        this.state.run = true;
        this.getData()
    }
    componentWillUnmount() {
        this.state.run = false;
    }

    getData() {
        SSocket.sendPromise({
            component: "evento",
            type: "getTrabajosPerfil",
            key_usuario: Model.usuario.Action.getKey(),
            key_evento: this.props.key_evento
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {

        })
    }
    item(obj) {
        const { key_staff_tipo, staff_tipo, descripcion, fecha_inicio, fecha_fin } = obj
        return <SView col={"xs-12"} row padding={4}>
            <SView width={30} height={30} style={{ borderRadius: 4, overflow: "hidden", backgroundColor: STheme.color.card }}>
                <SImage src={SSocket.api.root + "staff_tipo/" + key_staff_tipo} />
            </SView>
            <SView width={4} />
            <SView flex>
                <SText fontSize={14}>{staff_tipo}</SText>
                <SText fontSize={12} color={STheme.color.lightGray}>{descripcion}</SText>
                <SHr h={4} />
                <SText col={"xs-12"} style={{ textAlign: "right" }} fontSize={10} color={STheme.color.gray} language={{
                    en: `Start ${new SDate(fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")} to ${new SDate(fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}`,
                    es: `Desde ${new SDate(fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")} hasta ${new SDate(fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}`
                }} />
                <SHr h={8} />
                <SHr h={1} color={STheme.color.card} />
            </SView>
        </SView>
    }
    render() {
        if (!this.state.data) return null;
        if (Object.values(this.state.data).length <= 0) return <SText>{"No hay trabajos para en evento"}</SText>

        return (
            <SView col={'xs-12'} >
                <SText language={{ en: "Works", es: "Trabajos" }} fontSize={16} bold />
                <SHr />
                <SView col={'xs-12'} style={{ borderRadius: 8, overflow: "hidden", borderWidth: 1, borderColor: STheme.color.darkGray }} center>
                    <SGradient
                        colors={['#040405', '#0C0C10']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                    />
                    <SHr height={8} />
                    <SList
                        space={16}
                        data={this.state.data}
                        render={this.item.bind(this)}
                    />
                    <SText language={{ en: "TODO INGLES VER EN ESPANOL", es: "Recuerda que luego de postular al evento tienes que marcar tu asistencia con el jefe asignado etc etc" }} color={STheme.color.warning} fontSize={10} />
                    <SHr height={8} />
                </SView>
            </SView>
        );
    }
}
