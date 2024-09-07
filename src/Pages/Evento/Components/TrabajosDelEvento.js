import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SDate, SIcon, SLoad, SPage, SText, STheme, SThread, SView, SNavigation, SImage, SLanguage, SGradient, SHr, SList, SNotification, SPopup } from 'servisofts-component';
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


    handlePostular(key_staff) {
        SNotification.send({
            key: "staff_usuario-registro",
            title: "Applying...",
            body: "Please wait while the application is being processed.",
            type: "loading"
        })
        SSocket.sendPromise({
            component: "staff_usuario",
            type: "registro",
            key_usuario: Model.usuario.Action.getKey(),
            key_staff: key_staff,
        }).then(e => {
            SNotification.send({
                key: "staff_usuario-registro",
                title: "Successfully applied.",
                body: "Your application has been successfully registered.",
                color: STheme.color.success,
                time: 5000,
            })
            this.componentDidMount();
            console.log(e);
        }).catch(e => {
            SNotification.send({
                key: "staff_usuario-registro",
                title: "Application error.",
                body: e.error ?? "Unknown error.",
                color: STheme.color.danger,
                time: 5000,
            })
            console.error(e);
        })
    }
    renderStaffUsuario(obj) {
        const { staff_usuario } = obj
        if (!staff_usuario) return <SText onPress={() => {
            SPopup.confirm({
                title: "Seguro",
                onPress: () => {
                    this.handlePostular(obj.key)
                }
            })
        }} underLine>{"POSTULARME PARA EL PUESTO"}</SText>;
        if (staff_usuario.estado == 2) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "Invitacion pendiente de confirmar", es: "Invitacion pendiente de confirmar" }} />
        if (!staff_usuario.key_usuario_aprueba) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "Esperando aprobacion", es: "Esperando aprobacion" }} />
        if (!staff_usuario.key_usuario_atiende) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "Sin jefe", es: "Sin jefe" }} />
        return <>
            <SText fontSize={12} color={STheme.color.success} language={{ en: "Registrado en el puesto", es: "Registrado en el puesto" }} />
        </>
    }


    item(obj) {
        const { key_staff_tipo, staff_tipo, descripcion, fecha_inicio, fecha_fin, asistencia, staff_usuario } = obj
        return <SView col={"xs-12"} row padding={4} >
            <SView width={30} height={30} style={{ borderRadius: 4, overflow: "hidden", backgroundColor: STheme.color.card }}>
                <SImage src={SSocket.api.root + "staff_tipo/" + key_staff_tipo} />
            </SView>
            <SView width={8} />
            <SView flex>
                <SView>
                    <SText fontSize={14}>{staff_tipo}</SText>
                    <SText fontSize={12} color={STheme.color.lightGray}>{descripcion}</SText>
                    {this.renderStaffUsuario(obj)}
                    {!asistencia ? null : <SText fontSize={12} color={STheme.color.success} language={{ en: "Asistencia Marcada", es: "Asistencia Marcada" }} />}
                </SView>
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
                    <SText language={{
                        en: "Puede seleccionar los trabajos en los que desea participar en el evento desde la lista superior. Su selección nos permitirá asignarle las tareas que más le interesen.",
                        es: "You can select the jobs you wish to participate in for the event from the list above. Your selection will allow us to assign you the tasks that interest you the most."
                    }} color={STheme.color.warning} fontSize={10} />
                    <SHr height={8} />
                </SView>
            </SView>
        );
    }
}
