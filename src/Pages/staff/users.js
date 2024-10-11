import React, { Component, version } from 'react';
import { View, Text } from 'react-native';
import { SHr, SIcon, SImage, SInput, SList, SNavigation, SNotification, SPage, SSwitch, STable, STable2, SText, STheme, SView, SLanguage } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import { Container } from '../../Components';
import BtnWhatsapp from '../../Components/BtnWhatsapp';

export default class users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_disponibles: {},
            no_disponibles: {}
        };
        this.pk = SNavigation.getParam("pk");
        this.usuarios = {}
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
                this.usuarios = resp.data;
                e.data.forEach(staff => {
                    if (staff.tipos_staff) {
                        staff.tipos_staff.sort((a, b) => {
                            if (a.descripcion.toLowerCase() === this.state?.data?.staff_tipo?.descripcion.toLowerCase() && b.descripcion.toLowerCase() !== this.state?.data?.staff_tipo?.descripcion.toLowerCase()) {
                                return -1; // Mover  al principio
                            } else if (a.descripcion.toLowerCase() !== this.state?.data?.staff_tipo?.descripcion.toLowerCase() && b.descripcion.toLowerCase() === this.state?.data?.staff_tipo?.descripcion.toLowerCase()) {
                                return 1; // Mantener el orden
                            }
                            return 0; // Si ambos o ninguno son , mantener el orden
                        });
                    }
                });

                this.setState({ data_disponibles: e.data })

            })

        }).catch(e => {
            console.error(e);
        })


    }

    handleAsignarJefe = (post) => {
        if (!this.state?.data?.evento?.key_company) {
            SNotification.send({
                title: "No se encontro la compañia",
                color: STheme.color.danger,
                time: 5000
            })
            return;
        }
        SNavigation.navigate("/company/roles", {
            key_company: this.state.data.evento.key_company,
            onSelect: (usuario) => {
                SNotification.send({
                    key: "staff_usuario-asingJefe",
                    title: "Applying...",
                    body: "Please wait.",
                    type: "loading"
                })
                SSocket.sendPromise({
                    component: "staff_usuario",
                    type: "asignarJefe",
                    key_usuario: Model.usuario.Action.getKey(),
                    key_staff_usuario: post.key,
                    key_usuario_atiende: usuario.key_usuario,
                }).then(e => {
                    SNotification.send({
                        key: "staff_usuario-asingJefe",
                        title: "Successfully applied.",
                        body: "Successfully registered.",
                        color: STheme.color.success,
                        time: 5000,
                    })
                    // if (this.state?.staf_usuario[e.data.key]) {
                    //     this.state.staf_usuario[e.data.key] = {
                    //         ...this.state.staf_usuario[e.data.key],
                    //         ...e.data
                    //     }
                    //     this.setState({ ...this.state })
                    // }
                    this.componentDidMount();
                    console.log(e);
                }).catch(e => {
                    SNotification.send({
                        key: "staff_usuario-asingJefe",
                        title: "Error.",
                        body: e.error ?? "Unknown error.",
                        color: STheme.color.danger,
                        time: 5000,
                    })
                })
            }
        })
    }

    renderStaffUsuario(staff_usuario) {
        if (!staff_usuario) return
        if (staff_usuario.estado == 2) return <SText fontSize={12} color={STheme.color.lightGray} language={{ en: "Pendiente de confirmar", es: "Pendiente de confirmar" }} />
        if (!staff_usuario.key_usuario_aprueba) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "Esperando aprobacion", es: "Esperando aprobacion" }} />
        if (!staff_usuario.key_usuario_atiende) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "Sin jefe", es: "Sin jefe" }}
            onPress={this.handleAsignarJefe.bind(this, staff_usuario)} />
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

        // console.log(this.data?.evento?.key_company)
        return <SPage disableScroll titleLanguage={{
            es: "Armando mi STAFF",
            en: "Building my STAFF"
        }}>
            <SView col={"xs-12"} row style={{ alignItems: "flex-end", paddingRight: 8, paddingLeft: 8 }} >
                {/* <SText fontSize={16} bold color={STheme.color.gray}>Evento: </SText> */}
                <SText bold fontSize={16}>{this.state?.data?.evento?.descripcion} </SText>
                <SView width={6} />
                <SText center color={STheme.color.lightGray}>{"( "}{this.state?.data?.descripcion}{" )"}</SText>
                {/* {this.separator()} */}
                <SHr />
                <SView col={"xs-12"} row>
                    <SView row>
                        {/* <SText fontSize={12} bold color={STheme.color.gray}>Se requiere:</SText> */}
                        {/* <SView width={6} /> */}
                        <SView style={{
                            borderWidth: 1,
                            borderColor: STheme.color.success,
                            borderRadius: 4,
                            padding: 5,
                        }} center>
                            <SText fontSize={14} color={STheme.color.success}>{this.state?.data?.staff_tipo?.descripcion}</SText>
                        </SView>
                    </SView>
                    <SView flex />
                </SView>
            </SView>
            <SView row col={"xs-12"} flex padding={4} >
                <SView flex={2} height backgroundColor='#232323' style={{ borderRadius: 4 }}>
                    <SHr h={4} />
                    <SText fontSize={12} center language={{
                        es: "Staff Disponibles",
                        en: "Available Staff"
                    }} />
                    <SView onPress={() => {
                        let keys_usuarios = this.state.data_disponibles.filter(a => !a.staff_usuario).map(a => {
                            return a.key_usuario
                        })
                        SSocket.sendPromise({
                            component: "staff_usuario",
                            type: "invitarGrupo",
                            key_usuarios_invitados: keys_usuarios,
                            key_staff: this.pk,
                            key_usuario: Model.usuario.Action.getKey(),
                        }).then(e => {
                            this.componentDidMount();
                            console.log(e)
                        }).catch(e => {
                            console.error(e)
                        })
                    }}><SText>ALL</SText></SView>
                    <STable2
                        key={"Algo"}
                        data={this.state.data_disponibles}
                        filter={(a) => !a.staff_usuario || a?.staff_usuario?.estado == 2}
                        rowHeight={25}
                        cellStyle={{
                            justifyContent: "center",
                            paddingStart: 2,
                            height: 30

                        }}
                        // filter={a => a.estado != 0}
                        headerColor='#666666'
                        header={[
                            // { key: "index", label: "#", width: 30 },
                            {
                                key: "-", width: 25, component: (elm) => <SView col={"xs-12"} center><SView width={20} height={20}><SInput type='checkBox' defaultValue={elm?.staff_usuario} onChangeText={e => {
                                    elm.invitar = !!e;
                                    if (elm.invitar) {
                                        SSocket.sendPromise({
                                            component: "staff_usuario",
                                            type: "invitarGrupo",
                                            key_usuarios_invitados: [elm.key_usuario],
                                            key_staff: this.pk,
                                            key_usuario: Model.usuario.Action.getKey(),
                                        }).then(e => {
                                            this.componentDidMount();
                                            console.log(e)
                                        }).catch(e => {
                                            console.error(e)
                                        })
                                    } else {
                                        SSocket.sendPromise({
                                            component: "staff_usuario",
                                            type: "desinvitarGrupo",
                                            key_usuarios_desinvitados: [elm.key_usuario],
                                            key_staff: this.pk,
                                            key_usuario: Model.usuario.Action.getKey(),
                                        }).then(e => {
                                            this.componentDidMount();
                                            console.log(e)
                                        }).catch(e => {
                                            console.error(e)
                                        })
                                    }
                                    // console.log(elm);

                                }} /></SView></SView>
                            },
                            {
                                key: "key_usuario", label: "Photo", width: 30, component: (usr) => <SView card width={25} height={25} center
                                    style={{ borderRadius: 4, overflow: "hidden" }}>
                                    <SImage enablePreview src={SSocket.api.root + "usuario/" + usr} style={{
                                        resizeMode: "cover",
                                    }} /></SView>
                            },
                            { key: "usuario", label: "User", width: 150, render: (usr) => `${usr.Nombres ?? ""} ${usr.Apellidos ?? ""}` },
                            { key: "participacion", label: "Events", width: 50, order: "desc" },
                            { key: "rechazos", label: "Rejects", width: 50, component: (number) => <SText fontSize={12} color={(number > 0) ? STheme.color.danger : STheme.color.text} bold >{(number > 0) ? number : null}</SText> },
                            // { key: "usuario/Telefono", label: "Telefono", width: 100 },
                            {
                                key: "usuario/Telefono", label: "Phone", width: 100, component: (number) => <BtnWhatsapp telefono={number}
                                    texto={this.state?.data?.evento?.observacion}
                                    >
                                    <SText fontSize={11} color={STheme.color.text} underLine>
                                        {number}
                                    </SText>
                                </BtnWhatsapp>
                            },
                            {
                                key: "tipos_staff_favoritos", label: "Skills", width: 300,
                                render: (tipo_staff) => (tipo_staff) ? tipo_staff.map(a => a.descripcion).join(", ") : "",
                            },

                        ]} />
                </SView>

                <SView width={25} height center>

                </SView>
                <SView flex height backgroundColor='#232323' style={{ borderRadius: 4 }} >
                    <SHr h={4} />
                    <SText center fontSize={12} language={{
                        es: "Staff Seleccionado",
                        en: "Selected Staff"
                    }} />
                    <STable2
                        key={"Algo1"}
                        data={this.state.data_disponibles}
                        headerColor='#666666'
                        filter={(a) => !!a.staff_usuario && a?.staff_usuario?.estado != 2}
                        rowHeight={25}
                        cellStyle={{
                            justifyContent: "center",
                            paddingStart: 2,
                            height: 30

                        }}
                        header={[
                            // {
                            //     key: "-", width: 25, component: (elm) => <SView col={"xs-12"} center><SView width={20} height={20}><SInput type='checkBox' defaultValue={elm.desinvitar} onChangeText={e => {
                            //         elm.desinvitar = !!e;
                            //     }} /></SView></SView>
                            // },
                            {
                                key: "key_usuario", label: "Photo", width: 30, component: (usr) => <SView card width={25} height={25} center
                                    style={{ borderRadius: 4, overflow: "hidden" }}>
                                    <SImage enablePreview src={SSocket.api.root + "usuario/" + usr} style={{
                                        resizeMode: "cover",
                                    }} /></SView>
                            },
                            { key: "usuario", label: "User", width: 150, render: (usr) => `${usr.Nombres ?? ""} ${usr.Apellidos ?? ""}` },
                            {
                                key: "staff_usuario", label: "Status", width: 140, component: (obj) => <SView col={"xs-12"} center>
                                    {/* <SView width={24} height={18} style={{ borderRadius: 100 }} backgroundColor={STheme.color.warning}></SView> */}
                                    {this.renderStaffUsuario(obj)}
                                </SView>
                            },
                            {
                                key: "staff_usuario-2", label: "Boss", width: 140, component: (obj) => {
                                    const user = this.usuarios[obj.key_usuario_atiende]?.usuario
                                    return <SView col={"xs-12"} flex onPress={() => {
                                        this.handleAsignarJefe(obj)
                                    }} center>
                                        {user ? <SView row><SView width={20} height={20} card>
                                            <SImage src={SSocket.api.root + "usuario/" + obj.key_usuario_atiende} />
                                        </SView><SText flex fontSize={10}>{user.Nombres} {user.Apellidos}</SText></SView> : <SText fontSize={10}>{"Sin jefe"}</SText>}

                                        {/* <SView width={24} height={18} style={{ borderRadius: 100 }} backgroundColor={STheme.color.warning}></SView> */}
                                        {/* {this.renderStaffUsuario(obj)} */}
                                    </SView>
                                }
                            },
                            // { key: "usuario/Telefono", label: "Telefono", width: 100 },
                            {
                                key: "usuario/Telefono", label: "Phone", width: 100, component: (number) => <BtnWhatsapp telefono={number} texto={"Hola, Staff Pro USA te saluda!"}>
                                    <SText fontSize={11} color={STheme.color.text} underLine>
                                        {number}
                                    </SText>
                                </BtnWhatsapp>
                            },
                            // {
                            //     key: "tipos_staff_favoritos", label: "Tipos", width: 200,
                            //     render: (tipo_staff) => (tipo_staff) ? tipo_staff.map(a => a.descripcion).join(", ") : ""
                            // },
                            // {
                            //     key: "tipos_staff", label: "Tipos", width: 150, component: (tipo_staff) => <SView col={"xs-12"} row center>{
                            //         tipo_staff
                            //             ? tipo_staff.map((a, index) => (
                            //                 <SText row key={index} style={{ color: a.descripcion === "cocinero" ? "green" : "white" }}>
                            //                     {a.descripcion}
                            //                 </SText>
                            //             ))
                            //             // .reduce((prev, curr) => [prev, ', ', curr]) // Para añadir coma entre los elementos
                            //             : ""
                            //     }</SView>
                            // },



                        ]} />
                </SView>
            </SView>
        </SPage >
    }
}
