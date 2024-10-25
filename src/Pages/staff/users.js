import React, { Component, version } from 'react';
import { View, Text } from 'react-native';
import { SHr, SIcon, SImage, SInput, SList, SNavigation, SNotification, SPage, SSwitch, STable, STable2, SText, STheme, SView, SLanguage, SPopup } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import { Container } from '../../Components';
import BtnWhatsapp from '../../Components/BtnWhatsapp';

export default class users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_disponibles: [],
            no_disponibles: []
        };
        this.pk = SNavigation.getParam("pk");
        this.usuarios = {}
    }
    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }

    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
        this.loadData();
        SSocket.addEventListener("onMessage", this.handleSocketMessage.bind(this))
    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
        SSocket.removeEventListener("onMessage", this.handleSocketMessage.bind(this));
    }
    handleSocketMessage(obj) {
        if (obj.component == "staff_usuario" && obj.type == "invitarGrupoNotify") {
            this.loadData();
        }
        // if (obj.component == "staff_usuario" && obj.type == "invitarGrupoNotify") {

        // }
    }
    loadData() {
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

    formatearFecha(fecha, lenguaje) {
        const opciones = {
            day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric',
            minute: 'numeric',
            hour12: true // Esto es opcional, si quieres formato de 12 horas 
        };
        //  return fecha.toLocaleDateString('en-US', opciones);
        return fecha.toLocaleDateString(lenguaje, opciones);
    }

    EsFechaMenorOIgual(fecha) {
        // Convertir la fecha de cadena a objeto Date
        const fechaObj = new Date(fecha);

        // Obtener la fecha actual
        const fechaActual = new Date();
        return fechaObj.getDate() < fechaActual.getDate()
    }

    handleInvitarArray(keys_usuarios) {
        SSocket.sendPromise({
            component: "staff_usuario",
            type: "invitarGrupo",
            key_usuarios_invitados: keys_usuarios,
            key_staff: this.pk,
            key_usuario: Model.usuario.Action.getKey(),
        }).then(e => {
            this.componentDidMount();
            console.log(e)
            SNotification.send({
                title: SLanguage.select({ en: "Invitations sent", es: "Invitaciones enviadas" }),
                // body: (lenguaje == "es") ? "Se enviaron las invitaciones a los usuarios seleccionados" : "Invitations were sent to the selected users",
                body: SLanguage.select({ en: "Invitations were sent to the selected users", es: "Se enviaron las invitaciones a los usuarios seleccionados" }),
                color: STheme.color.success,
                time: 5000
            })
        }).catch(e => {
            console.error(e)
            SNotification.send({
                title: SLanguage.select({ en: "Error sending invitations", es: "Error al enviar invitaciones" }),
                body: SLanguage.select({ en: "An error occurred while sending the invitations", es: "Ocurrio un error al enviar las invitaciones" }),
                color: STheme.color.danger,
                time: 5000
            })
        })
    }
    renderInvitar() {
        if (!this.state.data_disponibles) return;
        const selecteds = this.state.data_disponibles.filter(a => !!a._select).map(a => a.key_usuario)
        if (selecteds.length <= 0) return;
        return <SView card padding={4} width={100} center
            style={{
                backgroundColor: STheme.color.warning,
                position: "absolute",
            }}
            onPress={() => {
                this.handleInvitarArray(selecteds)
            }}>
            <SText bold>Invitar {selecteds.length}</SText>
        </SView>
    }
    render() {
        let lenguaje = SLanguage.language;
        // console.log(this.state.data_disponibles)
        return <SPage disableScroll titleLanguage={{
            es: "Armando mi STAFF",
            en: "Building my STAFF"
        }}>
            <SView col={"xs-12"} row style={{ alignItems: "flex-end", paddingRight: 8, paddingLeft: 8 }} >
                {/* <SText fontSize={16} bold color={STheme.color.gray}>Evento: </SText> */}
                <SText bold fontSize={16}>{this.state?.data?.evento?.descripcion} </SText>
                <SView width={6} />
                <SText center color={STheme.color.gray}>{"( "}{this.state?.data?.descripcion}{" )"}</SText>
                <SView width={6} />
                <SText onPress={() => { this.loadData() }}>{"Reload"}</SText>
                {/* <SText center fontSize={15} color={STheme.color.gray}>{"( "}{this.state?.data?.descripcion}{" )"}</SText> */}
                {/* {this.separator()} */}
                <SHr />
                <SText center color={STheme.color.gray} language={{
                    es: "Inicio:",
                    en: "Start:"
                }} />
                <SView width={6} />
                <SText fontSize={14} language={{
                    es: this.formatearFecha(new Date(this.state?.data?.fecha_inicio), "es"),
                    en: this.formatearFecha(new Date(this.state?.data?.fecha_inicio), "en")
                }} />
                <SView width={6} />
                {(this.EsFechaMenorOIgual(new Date(this.state?.data?.fecha_inicio))) ? <SText fontSize={16} center color={STheme.color.danger} language={{
                    en: "[ Past event ]",
                    es: "[ Evento pasado ]"
                }} /> : null}

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
                    <SView width={7} />
                    <SView row>
                        {/* <SText fontSize={12} bold color={STheme.color.gray}>Se requiere:</SText> */}
                        {/* <SView width={6} /> */}
                        <SView style={{
                            borderWidth: 1,
                            borderColor: STheme.color.warning,
                            borderRadius: 4,
                            padding: 5,
                        }} center>
                            <SText fontSize={14} color={STheme.color.warning}> {SLanguage.select({ es: "Nivel de inglés: ", en: "English level: " })} {this.state?.data?.nivel_ingles}</SText>
                        </SView>
                    </SView>
                    <SView flex />
                </SView>
            </SView>
            <SView row col={"xs-12"} flex padding={4} >
                <SView flex={1} height backgroundColor={STheme.color.info} style={{ borderRadius: 4 }}>
                    {/* <SView flex={2} height backgroundColor={STheme.color.darkGray} style={{ borderRadius: 4 }}> */}
                    <SHr h={4} />
                    <SText fontSize={12} color={STheme.color.text} center language={{
                        es: "Staff Disponibles",
                        en: "Available Staff"
                    }} />
                    {this.renderInvitar()}
                    {/* <SView style={{
                        position: "absolute",
                        left: 2,
                        top: 2,
                        // borderWidth : 1,
                        // borderColor : STheme.color.white
                    }} onPress={() => {
                        let keys_usuarios = this.state.data_disponibles.filter(a => !a.staff_usuario).map(a => {
                            return a.key_usuario
                        })
                      this.handleInvitarArray(keys_usuarios)
                    }}>
                        <SIcon name={"checkAll"} fill={STheme.color.gray} width={20} height={20} />
                    </SView> */}
                    <STable2
                        key={"Algo"}
                        data={this.state.data_disponibles}
                        filter={(a) => !a.staff_usuario || a?.staff_usuario?.estado == 2}
                        rowHeight={25}
                        cellStyle={{
                            justifyContent: "center",
                            paddingStart: 2,
                            height: 30,
                            color: STheme.color.text

                        }}
                        // filter={a => a.estado != 0}
                        headerColor={STheme.color.primary}
                        header={[
                            {
                                key: "-select", width: 25, component: (elm) => <SView col={"xs-12"} center>
                                    <SView width={20} height={20} >
                                        {
                                            elm?.staff_usuario ? null :
                                                <SInput type='checkBox' defaultValue={elm?._select} onChangeText={e => {
                                                    elm._select = !!e;
                                                    this.setState({ ...this.state })
                                                }} />
                                        }
                                    </SView>
                                </SView>
                            },
                            {
                                key: "-", width: 25, component: (elm) => <SView col={"xs-12"} center><SView width={20} height={20} style={{
                                    borderColor: STheme.color.gray,
                                    borderWidth: 0,
                                    borderRadius: 5
                                }}><SInput type='checkBox' defaultValue={elm?.staff_usuario} onChangeText={e => {
                                    elm.invitar = !!e;
                                    if (elm.invitar) {
                                        SSocket.sendPromise({
                                            component: "staff_usuario",
                                            type: "invitarGrupo",
                                            key_usuarios_invitados: [elm.key_usuario],
                                            key_staff: this.pk,
                                            key_usuario: Model.usuario.Action.getKey(),
                                        }).then(e => {
                                            this.loadData();
                                            console.log(e)
                                            SNotification.send({
                                                title: (lenguaje == "es") ? "Invitación enviada" : "Invitation sent",
                                                body: (lenguaje == "es") ? "Se envió la invitación al usuario seleccionado" : "Invitation sent to the selected user",
                                                color: STheme.color.success,
                                                time: 5000
                                            })
                                        }).catch(e => {
                                            console.error(e)
                                            SNotification.send({
                                                title: (lenguaje == "es") ? "Error al enviar invitación" : "Error sending invitation",
                                                body: (lenguaje == "es") ? "Ocurrio un error al enviar la invitación" : "An error occurred while sending the invitation",
                                                color: STheme.color.danger,
                                                time: 5000
                                            })
                                        })
                                    }
                                },
                                // {
                                //     key: "-", width: 25, component: (elm) => <SView col={"xs-12"} center><SView width={20} height={20} ><SInput type='checkBox' defaultValue={elm?.staff_usuario} onChangeText={e => {
                                //         elm.invitar = !!e;
                                //         if (elm.invitar) {
                                //             SSocket.sendPromise({
                                //                 component: "staff_usuario",
                                //                 type: "invitarGrupo",
                                //                 key_usuarios_invitados: [elm.key_usuario],
                                //                 key_staff: this.pk,
                                //                 key_usuario: Model.usuario.Action.getKey(),
                                //             }).then(e => {
                                //                 this.loadData();
                                //                 console.log(e)
                                //                 SNotification.send({
                                //                     title: (lenguaje == "es") ? "Invitación enviada" : "Invitation sent",
                                //                     body: (lenguaje == "es") ? "Se envió la invitación al usuario seleccionado" : "Invitation sent to the selected user",
                                //                     color: STheme.color.success,
                                //                     time: 5000
                                //                 })
                                //             }).catch(e => {
                                //                 console.error(e)
                                //                 SNotification.send({
                                //                     title: (lenguaje == "es") ? "Error al enviar invitación" : "Error sending invitation",
                                //                     body: (lenguaje == "es") ? "Ocurrio un error al enviar la invitación" : "An error occurred while sending the invitation",
                                //                     color: STheme.color.danger,
                                //                     time: 5000
                                //                 })
                                //             })
                                //         } else {
                                //             SSocket.sendPromise({
                                //                 component: "staff_usuario",
                                //                 type: "desinvitarGrupo",
                                //                 key_usuarios_desinvitados: [elm.key_usuario],
                                //                 key_staff: this.pk,
                                //                 key_usuario: Model.usuario.Action.getKey(),
                                //             }).then(e => {
                                //                 this.loadData();
                                //                 console.log(e)
                                //                 SNotification.send({
                                //                     title: (lenguaje == "es") ? "Cancelación de la Invitación" : "Invitation Canceled",
                                //                     body: (lenguaje == "es") ? "Se canceló la invitación al usuario seleccionado" : "The invitation to the selected user was canceled",
                                //                     color: STheme.color.success,
                                //                     time: 5000
                                //                 })
                                //             }).catch(e => {
                                //                 console.error(e)
                                //                 SNotification.send({
                                //                     title: (lenguaje == "es") ? "Error al cancelar la invitación" : "Error canceling the invitation",
                                //                     body: (lenguaje == "es") ? "Ocurrio un error al cancelar la invitación" : "An error occurred while canceling the invitation",
                                //                     color: STheme.color.danger,
                                //                     time: 5000
                                //                 })
                                //             })
                                //         }
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
                                    { key: "participacion", label: "Events", width: 50, order: "desc" },
                                    { key: "rechazos", label: "Rejects", width: 50, component: (number) => <SText fontSize={12} color={(number > 0) ? STheme.color.danger : STheme.color.text} bold >{(number > 0) ? number : null}</SText> },
                                // {key: "usuario/Telefono", label: "Telefono", width: 100 },
                                {
                                    key: "usuario/Telefono", label: "Phone", width: 140, component: (number) => <BtnWhatsapp telefono={number}
                                        texto={this.state?.data?.evento?.observacion}
                                    >
                                        <SText fontSize={11} color={STheme.color.text} underLine>
                                            {number}
                                        </SText>
                                    </BtnWhatsapp>
                                },
                                    { key: "usuario/nivel_ingles", label: "English level", width: 60, },
                                {
                                    key: "tipos_staff_favoritos", label: "Skills", width: 300,
                                    render: (tipo_staff) => (tipo_staff) ? tipo_staff.map(a => a.descripcion).join(", ") : "",
                                },

                        ]} />
                                </SView >

                                    <SView width={25} height center>

                                    </SView>
                                    <SView flex height backgroundColor={STheme.color.info} style={{ borderRadius: 4 }} >
                                        <SHr h={4} />
                                        <SText center fontSize={12} color={STheme.color.text} language={{
                                            es: "Staff Aceptado",
                                            en: "Staff Accepted"
                                        }} />
                                        <STable2
                                            key={"Algo1"}
                                            data={this.state.data_disponibles}
                                            headerColor={STheme.color.primary}
                                            filter={(a) => !!a.staff_usuario && a?.staff_usuario?.estado != 2}
                                            rowHeight={25}
                                            cellStyle={{
                                                justifyContent: "center",
                                                paddingStart: 2,
                                                height: 30,
                                                color: STheme.color.text

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
                                                            </SView><SText color={STheme.color.text} flex fontSize={10}>{user.Nombres} {user.Apellidos}</SText></SView> : <SText color={STheme.color.text} fontSize={10}>{"Sin jefe"}</SText>}

                                                            {/* <SView width={24} height={18} style={{ borderRadius: 100 }} backgroundColor={STheme.color.warning}></SView> */}
                                                            {/* {this.renderStaffUsuario(obj)} */}
                                                        </SView>
                                                    }
                                                },

                                                {
                                                    key: "usuario/Telefono", label: "Phone", width: 100, component: (number) => <BtnWhatsapp telefono={number} texto={"Hola, Staff Pro USA te saluda!"}>
                                                        <SText fontSize={11} color={STheme.color.text} underLine>
                                                            {number}
                                                        </SText>
                                                    </BtnWhatsapp>
                                                },
                                                {
                                                    key: "-delete", label: "Delete", width: 100, component: (e) => {
                                                        return <SText color={STheme.color.text} onPress={() => {
                                                            // console.log(e);
                                                            SPopup.confirm({
                                                                title: "Seguro de eliminar?",
                                                                onPress: () => {
                                                                    SSocket.send({
                                                                        component: "staff_usuario",
                                                                        type: "editar",
                                                                        data: {
                                                                            key: e.staff_usuario.key,
                                                                            estado: 0
                                                                        }
                                                                    }).then(e => {
                                                                        this.loadData();
                                                                    }).catch(e => {

                                                                    })
                                                                }
                                                            })
                                                        }}>{"Delete"}</SText>
                                                    }
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
                                </SView >
        </SPage >
    }
}
