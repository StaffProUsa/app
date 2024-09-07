import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SDate, SIcon, SLoad, SPage, SText, STheme, SThread, SView, SNavigation, SImage, SLanguage, SGradient, SHr, SList } from 'servisofts-component';
import parametro from '../../../Services/Casagrandeadmin/Components/parametro';
import venta from '../../../Services/Casagrandeadmin/Components/venta';
import Model from '../../../Model';
import SSocket from 'servisofts-socket';
import BtnAsistencia from './BtnAsistencia';

export default class MisTrabajosDelEvento extends Component {
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
            component: "staff_usuario",
            type: "getMisTrabajos",
            key_usuario: Model.usuario.Action.getKey(),
            key_evento: this.props.key_evento
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {

        })
    }
    item(obj) {
        const { staff_tipo, staff } = obj
        return <SView col={"xs-12"} padding={4} row>
            <SView width={30} height={30} style={{ borderRadius: 4, overflow: "hidden" }}>
                <SImage src={SSocket.api.root + "staff_tipo/" + staff_tipo.key} />
            </SView>
            <SView width={4} />
            <SView>
                <SText>{staff_tipo.descripcion}</SText>
                <SText fontSize={12} color={STheme.color.lightGray}>{staff.descripcion}</SText>
                <SHr />
                <SText fontSize={10} color={STheme.color.lightGray} language={{
                    en: `Start ${new SDate(staff.fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}`,
                    es: `Inicia el ${new SDate(staff.fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}`
                }} />
                <SText fontSize={10} color={STheme.color.lightGray} language={{
                    en: `End ${new SDate(staff.fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}`,
                    es: `Termina el ${new SDate(staff.fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}`
                }} />
                {/* <SText fontSize={12} color={STheme.color.lightGray}>{staff.fecha_fin}</SText> */}
            </SView>
        </SView>
    }
    render() {
        if (!this.state.data) return null;
        if (Object.values(this.state.data).length <= 0) return null;

        return (
            <SView col={'xs-12'} >
                <SText language={{ en: "My works in this event", es: "Mis trabajos en el evento" }} fontSize={16} bold />
                <SHr />
                <SView col={'xs-12'} style={{ borderRadius: 8, overflow: "hidden", borderWidth: 1, borderColor: STheme.color.darkGray }}>
                    <SGradient
                        colors={['#040405', '#0C0C10']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                    />
                    <SHr height={8} />
                    <SList
                        data={this.state.data}
                        render={this.item.bind(this)}
                    />
                    <SHr height={8} />
                </SView>
            </SView>
        );
    }
}
