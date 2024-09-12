import React, { Component, version } from 'react';
import { View, Text } from 'react-native';
import { SHr, SIcon, SImage, SInput, SList, SNavigation, SPage, SSwitch, STable, STable2, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import { Container } from '../../Components';

export default class users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_disponibles: {},
            no_disponibles: {}
        };
        this.pk = SNavigation.getParam("pk");
    }

    componentDidMount() {
        SSocket.sendPromise({
            component: "staff",
            type: "getByKeyDetalle",
            key: this.pk,
            key_usuario: Model.usuario.Action.getKey(),
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {
            console.error(e);
        })
        SSocket.sendPromise({
            component: "staff",
            type: "getUsuariosDisponibles",
            key_staff: this.pk,
            key_usuario: Model.usuario.Action.getKey(),
        }).then(e => {

            let keys = [...new Set(Object.values(e.data).map(a => a.key_usuario).filter(key => key !== null))];
            SSocket.sendPromise({
                version: "2.0",
                service: "usuario",
                component: "usuario",
                type: "getAllKeys",
                keys: keys,
            }).then(resp => {
                console.log(resp)
                Object.values(e.data).map(o => {
                    o.usuario = resp.data[o.key_usuario]?.usuario;
                })
                this.setState({ data_disponibles: e.data })
            })

        }).catch(e => {
            console.error(e);
        })


    }

    renderStaffUsuario(staff_usuario) {
        if (!staff_usuario) return
        if (staff_usuario.estado == 2) return <SText fontSize={12} color={STheme.color.lightGray} language={{ en: "Pendiente de confirmar", es: "Pendiente de confirmar" }} />
        if (!staff_usuario.key_usuario_aprueba) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "Esperando aprobacion", es: "Esperando aprobacion" }} />
        if (!staff_usuario.key_usuario_atiende) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "Sin jefe", es: "Sin jefe" }} />
        return <>
            <SText fontSize={12} color={STheme.color.success} language={{ en: "Registrado en el puesto", es: "Registrado en el puesto" }} />
        </>
    }

    item(obj) {
        return <SView col={"xs-12"} card padding={8}>
            <SView row flex>
                <SView width={30} height={30}>
                    <SImage src={SSocket.api.root + "usuario/" + obj.key_usuario} />
                </SView>
                <SView>
                    <SText flex>{obj.key_usuario}</SText>
                    {this.renderStaffUsuario(obj)}
                </SView>
            </SView>

        </SView>
    }
    separator() {
        return <>
            <SView width={4} />
            <SText>{"-"}</SText>
            <SView width={4} />
        </>
    }
    render() {
        console.log("this.state.data")
        console.log(this.state.data)
        console.log(this.state.data_disponibles)

        // console.log(this.data?.evento?.key_company)
        return <SPage disableScroll title={"Armando mi STAFF"}>
            <SView col={"xs-12"} row style={{ alignItems: "flex-end", paddingRight: 16, paddingLeft: 16 }} >
                <SText fontSize={16} bold color={STheme.color.gray}>Evento: </SText>
                <SText bold fontSize={16}>{this.state?.data?.evento?.descripcion} </SText>
                <SView width={6} />
                <SText center color={STheme.color.lightGray}>{"( "}{this.state?.data?.descripcion}{" )"}</SText>
                {/* {this.separator()} */}
                <SHr />
                <SText fontSize={16} bold color={STheme.color.gray}>Se requiere:</SText>
                <SView width={6} />
                <SView style={{
                    borderWidth: 1,
                    borderColor: STheme.color.success,
                    borderRadius: 4,
                    padding: 4,
                }}>
                    <SText fontSize={18} color={STheme.color.success}>{this.state?.data?.staff_tipo?.descripcion}</SText>
                </SView>
                {/* {this.separator()} */}

                {/* {this.separator()} */}
                {/* <SText fontSize={10} color={STheme.color.lightGray}>{this.state?.data?.fecha_inicio} {this.state?.data?.fecha_fin}</SText> */}
            </SView>
            {/* <SList
                    buscador
                    data={this.state?.data?.staff_usuario ?? []}
                    render={this.item.bind(this)}
                /> */}
            <SView row col={"xs-12"} flex padding={16} >
                <SView flex height backgroundColor='#232323' style={{ borderRadius: 4 }}>
                    <SText padding={8} card>{"Staff Disponibles"}</SText>
                    <SView width={30} height={30} style={{
                        position: "absolute",
                        right: 2,
                        top: 2,
                    }} onPress={() => {
                        SNavigation.navigate("/company/roles/add", { key_company: this.state.data?.evento?.key_company })
                    }}>
                        <SIcon name='Add' />
                    </SView>
                    <STable2
                        key={"Algo"}
                        data={this.state.data_disponibles}
                        filter={(a) => !a.staff_usuario}
                        rowHeight={25}
                        cellStyle={{
                            justifyContent: "center",
                            paddingStart: 2,

                        }}
                        // filter={a => a.estado != 0}
                        headerColor='#666666'
                        header={[
                            // { key: "index", label: "#", width: 30 },
                            {
                                key: "-", width: 30, component: (elm) => <SView col={"xs-12"} center><SView width={20}><SInput type='checkBox' defaultValue={elm.invitar} onChangeText={e => {
                                    elm.invitar = !!e;
                                }} /></SView></SView>
                            },
                            { key: "usuario", width: 150, render: (usr) => `${usr.Nombres} ${usr.Apellidos}` },
                            { key: "participacion", label: "#P", width: 50, order: "desc" },
                            { key: "usuario/Telefono", label: "Telefono", width: 100 },
                            { key: "tipos_staff", label: "Tipos",width: 150, render: (tipo_staff) => (tipo_staff) ? tipo_staff.map(a => a.descripcion).join(", "):"" },

                        ]} />
                </SView>

                <SView width={30} height center>
                    {/* <SText padding={8} card>{">"}</SText> */}
                    {/* <SHr /> */}
                    <SText padding={8} card onPress={() => {

                        const key_usuarios_invitados = Object.values(this.state.data_disponibles).filter(a => !!a.invitar).map(a => a.key_usuario);
                        if (key_usuarios_invitados.length <= 0) return;
                        SSocket.sendPromise({
                            component: "staff_usuario",
                            type: "invitarGrupo",
                            key_usuarios_invitados: key_usuarios_invitados,
                            key_staff: this.pk,
                            key_usuario: Model.usuario.Action.getKey(),
                        }).then(e => {
                            this.componentDidMount();
                            console.log(e)
                        }).catch(e => {
                            console.error(e)
                        })
                    }}>{">"}</SText>
                    <SHr h={50} />
                    <SText padding={8} card onPress={() => {
                        const key_usuarios_desinvitados = Object.values(this.state.data_disponibles).filter(a => !!a.desinvitar).map(a => a.key_usuario);
                        if (key_usuarios_desinvitados.length <= 0) return;
                        SSocket.sendPromise({
                            component: "staff_usuario",
                            type: "desinvitarGrupo",
                            key_usuarios_desinvitados: key_usuarios_desinvitados,
                            key_staff: this.pk,
                            key_usuario: Model.usuario.Action.getKey(),
                        }).then(e => {
                            this.componentDidMount();
                            console.log(e)
                        }).catch(e => {
                            console.error(e)
                        })
                    }}>{"<"}</SText>
                </SView>
                <SView flex height backgroundColor='#232323' style={{ borderRadius: 4 }} >
                    <SText padding={8} card>{"Staff Seleccionado"}</SText>
                    <STable2
                        key={"Algo1"}
                        data={this.state.data_disponibles}
                        headerColor='#666666'
                        filter={(a) => !!a.staff_usuario}
                        rowHeight={25}
                        cellStyle={{
                            justifyContent: "center",
                            paddingStart: 2,

                        }}
                        header={[
                            {
                                key: "-", width: 30, component: (elm) => <SView col={"xs-12"} center><SView width={20}><SInput type='checkBox' defaultValue={elm.desinvitar} onChangeText={e => {
                                    elm.desinvitar = !!e;
                                }} /></SView></SView>
                            },
                            { key: "usuario", width: 150, render: (usr) => `${usr.Nombres} ${usr.Apellidos}` },
                            {
                                key: "staff_usuario", label: "Estado", width: 140, component: (obj) => <SView col={"xs-12"} center>
                                    {/* <SView width={24} height={18} style={{ borderRadius: 100 }} backgroundColor={STheme.color.warning}></SView> */}
                                    {this.renderStaffUsuario(obj)}
                                </SView>
                            },
                            { key: "usuario/Telefono", label: "Telefono", width: 100 },
                            { key: "tipos_staff", label: "Tipos", width: 150, render: (tipo_staff) => (tipo_staff) ? tipo_staff.map(a => a.descripcion).join(", ") : "" },


                        ]} />
                </SView>
            </SView>
        </SPage>
    }
}
