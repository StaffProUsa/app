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
        if (!staff_usuario) return <SView padding={5} style={{
            borderRadius: 10,
            backgroundColor: STheme.color.secondary,
            overflow: "hidden",
            height: 40,

        }} center row onPress={() => {
            SPopup.confirm({
                title: "Seguro",
                onPress: () => {
                    this.handlePostular(obj.key)
                }
            })
        }}>
            <SIcon name={"mano1"} width={20} height={20} fill={STheme.color.primary} />
            <SView width={5} />
            <SText language={{
                en: "APPLY",
                es: "POSTULARME"
            }} /></SView>;
        if (staff_usuario.estado == 2) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "Invitation to be confirmed", es: "Invitación pendiente de confirmar" }} />
        if (!staff_usuario.key_usuario_aprueba) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "Waiting for approval", es: "Esperando aprobación" }} />
        if (!staff_usuario.key_usuario_atiende) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "No boss", es: "Sin jefe" }} />
        return <>
            <SText fontSize={12} color={STheme.color.success} language={{ en: "Registered in the post", es: "Registrado en el puesto" }} />
        </>
    }


    // item_(obj) {
    //     const { key_staff_tipo, staff_tipo, descripcion, fecha_inicio, fecha_fin, asistencia, staff_usuario } = obj
    //     return <SView col={"xs-12"} row padding={10} >
    //         <SView width={60} height={60} style={{ borderRadius: 4, overflow: "hidden", backgroundColor: STheme.color.card }}>
    //             <SImage src={SSocket.api.root + "staff_tipo/" + key_staff_tipo} />
    //         </SView>
    //         <SView width={8} />
    //         <SView flex>
    //             <SView>
    //                 <SText fontSize={14}>{staff_tipo}</SText>
    //                 <SText fontSize={12} color={STheme.color.lightGray}>{descripcion}</SText>
    //                 {this.renderStaffUsuario(obj)}
    //                 {!asistencia ? null : <SText fontSize={12} color={STheme.color.success} language={{ en: "Marked Assistance", es: "Asistencia Marcada" }} />}
    //             </SView>
    //             <SHr h={4} />
    //             <SText col={"xs-12"} style={{ textAlign: "right" }} fontSize={10} color={STheme.color.gray} language={{
    //                 en: `Start ${new SDate(fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")} to ${new SDate(fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}`,
    //                 es: `Desde ${new SDate(fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")} hasta ${new SDate(fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}`
    //             }} />
    //             <SHr h={8} />
    //             <SHr h={1} color={STheme.color.card} />
    //         </SView>
    //     </SView>
    // }

    formatearFecha(fecha, lenguaje) {
        const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
        //  return fecha.toLocaleDateString('en-US', opciones);
        return fecha.toLocaleDateString(lenguaje, opciones);
    }

    item(obj) {

        let fecha_ini = new Date(obj.fecha_inicio);
        let fecha_fi = new Date(obj.fecha_fin);

        const { key_staff_tipo, staff_tipo, descripcion, fecha_inicio, fecha_fin, asistencia, staff_usuario } = obj
        return <SView col={"xs-12"} row padding={10} >
            <SView col={"xs-1.5"} row>
                <SView width={60} height={60} style={{ borderRadius: 4, overflow: "hidden", backgroundColor: STheme.color.card }}>
                    <SImage src={SSocket.api.root + "staff_tipo/" + key_staff_tipo} />
                </SView>
            </SView>
            <SView col={"xs-12 sm-10.5"} row>
                <SView col={"xs-7 sm-8"}>
                    <SText fontSize={14}>{staff_tipo}</SText>
                    <SText fontSize={12} color={STheme.color.lightGray}>{descripcion}</SText>
                </SView>
                <SView col={"xs-5 sm-4"} style={{alignItems:"flex-end"}}>
                    {this.renderStaffUsuario(obj)}
                    {!asistencia ? null : <SText fontSize={12} color={STheme.color.success} language={{ en: "Marked Assistance", es: "Asistencia Marcada" }} />}
                </SView>
                <SHr h={4} />
                <SText col={"xs-12"} style={{ textAlign: "right" }} fontSize={10} color={STheme.color.gray} language={{
                    // en: `Start ${new SDate(fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")} to ${new SDate(fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}`,
                    // es: `Desde ${new SDate(fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")} hasta ${new SDate(fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd hh:mm")}`
                    en: `Start ${this.formatearFecha(fecha_ini,'en-US')} | ${new SDate(fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("hh:mm")}`,
                    es: `Desde ${this.formatearFecha(fecha_ini,'es-ES')} | ${new SDate(fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("hh:mm")}`
                }} />
                <SText col={"xs-12"} style={{ textAlign: "right" }} fontSize={10} color={STheme.color.gray} language={{
                    en: `End ${this.formatearFecha(fecha_fi,'en-US')} | ${new SDate(fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("hh:mm")}`,
                    es: `Hasta ${this.formatearFecha(fecha_fi,'es-ES')} | ${new SDate(fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("hh:mm")}`
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
                    <SText padding={10} language={{
                        es: "Puede seleccionar los trabajos en los que desea participar en el evento desde la lista superior. Su selección nos permitirá asignarle las tareas que más le interesen.",
                        en: "You can select the jobs you wish to participate in for the event from the list above. Your selection will allow us to assign you the tasks that interest you the most."
                    }} color={STheme.color.warning} fontSize={10} />
                    <SHr height={8} />
                </SView>
            </SView>
        );
    }
}
