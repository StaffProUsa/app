import React, { Component, version } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { SHr, SIcon, SImage, SInput, SList, SNavigation, SNotification, SPage, SSwitch, STable, STable2, SText, STheme, SView, SLanguage, SPopup, SDate, SScrollView2 } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import { Container } from '../../Components';
import BtnWhatsapp from '../../Components/BtnWhatsapp';
import ResizeDualPanel from '../../Components/ResizeDualPanel';
import EditClock from './Components/EditClock';
import MoveStaff from './Components/MoveStaff';
import PBarraFooter from '../../Components/PBarraFooter';


const ItemImage = ({ src, label }) => {
    return <SView row style={{ padding: 2, paddingRight: 16, justifyContent: "center", alignItems: "center" }}>
        <SView style={{
            width: 18,
            height: 18,
            borderRadius: 100,
            backgroundColor: STheme.color.card,
            overflow: "hidden",
        }}>
            <SImage src={src} style={{
                resizeMode: "cover",
            }} />
        </SView>
        <SView width={4} />
        <SText fontSize={12} bold color={STheme.color.lightGray}>{label}</SText>
    </SView>
}

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
        let nivelIngles = "";
        SSocket.sendPromise({
            component: "staff",
            type: "getByKeyDetalle",
            key: this.pk,
            key_usuario: Model.usuario.Action.getKey(),
        }).then(e => {
            nivelIngles = e.data.nivel_ingles;
            this.setState({ data: e.data })
            SSocket.sendPromise({
                component: "company",
                type: "getByKey",
                key: e.data.evento.key_company,
            }).then(e => {
                this.setState({ data_company: e.data })
            }
            ).catch(e => {
                console.error(e);
            })

            SSocket.sendPromise({
                component: "cliente",
                type: "getByKey",
                key: e.data.evento.key_cliente,
            }).then(e => {
                this.setState({ data_cliente: e.data })
            }
            ).catch(e => {
                console.error(e);
            })


        }).catch(e => {
            console.error(e);
        })
        SSocket.sendPromise({
            component: "staff",
            type: "getUsuariosDisponibles",
            key_staff: this.pk,
            key_usuario: Model.usuario.Action.getKey(),
        }).then(e => {

            let arr = [];
            arr.push(...Object.values(e.data).map(a => a.key_usuario));
            arr.push(...Object.values(e.data).map(a => a?.staff_usuario?.key_usuario_atiende));

            let keys = [...new Set(arr.filter(key => key !== null))];
            // e = e.data.filter(item => item.estado === 2);
            e.data = e.data.filter(item => item.estado === 2);
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

                //validar nivel de ingles
                let arrayNivelIngles = [];
                if (nivelIngles == "NONE") {
                    arrayNivelIngles = ["NONE", "BASIC", "BASICO","MEDIUM","MEDIO", "ADVANCED"]
                } else if (nivelIngles == "BASIC") {
                    arrayNivelIngles = ["BASIC", "BASICO","MEDIUM","MEDIO", "ADVANCED"]
                } else if (nivelIngles == "MEDIUM") {
                    arrayNivelIngles = ["MEDIUM", "MEDIO","ADVANCED"]
                } else if (nivelIngles == "ADVANCED") {
                    arrayNivelIngles = ["ADVANCED"]
                }
                const filtrados = e.data.filter(item =>
                    item.usuario &&
                    arrayNivelIngles.includes(item.usuario.nivel_ingles)
                );

                // this.setState({ data_disponibles: e.data })
                this.setState({ data_disponibles: filtrados })

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
            key_evento: this.state.data.key_evento,
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

    handleMoverStaff = (post) => {
        // if (!this.state?.data?.evento?.key_company) {
        //     SNotification.send({
        //         title: "No se encontro la compañia",
        //         color: STheme.color.danger,
        //         time: 5000
        //     })
        //     return;
        // }

        SPopup.open({
            key: "MoveStaff",
            content: <SView col={"xs-12"} style={{
                height: 500,
                borderRadius: 8,
                overflow: 'hidden',
                padding: 8,
                backgroundColor: STheme.color.background,
                borderWidth: 1,
                borderColor: STheme.color.card,
            }} withoutFeedback>
                <MoveStaff key_staff={post.key_staff} staff_usuario_list={[post.key]} onChange={e => {
                    this.loadData();
                    SPopup.close("MoveStaff")

                }} />
            </SView>,

        })
        return;
    }

    renderStaffUsuario(staff_usuario) {
        const fi = new SDate(staff_usuario.fecha_ingreso, "yyyy-MM-ddThh:mm:ssTZD")
        const fs = new SDate(staff_usuario.fecha_salida, "yyyy-MM-ddThh:mm:ssTZD")
        const disf = fi.diffTime(fs);
        // return ((disf / 1000) / 60 / 60).toFixed(2);
        if (!staff_usuario) return
        if (staff_usuario.estado == 2) return <SText fontSize={12} color={STheme.color.lightGray} language={{ en: "Pendiente de confirmar", es: "Pendiente de confirmar" }} />
        if (!staff_usuario.key_usuario_aprueba) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "Esperando aprobacion", es: "Esperando aprobacion" }} />
        if (!staff_usuario.key_usuario_atiende) return <SText fontSize={12} color={STheme.color.warning} language={{ en: "Sin jefe", es: "No boss" }}
            onPress={this.handleAsignarJefe.bind(this, staff_usuario)} />
        if ((staff_usuario.fecha_ingreso != null) && (staff_usuario.fecha_salida == null)) return <SText fontSize={12} color={STheme.color.success} language={{ en: "Working...", es: "Trabajando..." }} />
        if ((staff_usuario.fecha_salida != null)) return <SView row><SText fontSize={12} color={STheme.color.success} language={{ en: "Finished", es: "Finalizado" }} /><SText fontSize={12}> {"("} {((disf / 1000) / 60 / 60).toFixed(2)} {")"}</SText></SView>
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

    formatearFechaHora(fecha, lenguaje) {
        const opciones = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true // Esto es opcional, si quieres formato de 12 horas
        };
        //  return fecha.toLocaleDateString('en-US', opciones);
        return fecha.toLocaleDateString(lenguaje, opciones);
    }


    EsFechaMenorOIgual(fechaInicio, fechaFin) {
        // Convertir la fecha de cadena a objeto Date

        let fechaIni = new Date(fechaInicio);
        fechaIni.setDate(fechaIni.getDate() + 1);

        let fechaObj = (fechaFin === null) ? fechaIni : new Date(fechaFin);

        // Obtener la fecha actual
        const fechaActual = new Date();
        // console.log("fechaObj", fechaObj)
        // console.log("fechaActual", fechaActual)
        // console.log(fechaObj.getDate() < fechaActual.getDate())
        // return fechaObj.getDate() < fechaActual.getDate()

        // console.log(fechaObj.getTime() < fechaActual.getTime())
        return fechaObj.getTime() < fechaActual.getTime()
    }

    handleInvitarArray(usuarios) {
        SSocket.sendPromise({
            component: "staff_usuario",
            type: "invitarGrupo",
            usuarios_invitados: usuarios,
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
        // const selecteds = this.state.data_disponibles.filter(a => !!a._select).map(a => a.key_usuario)

        const selecteds = this.state.data_disponibles.filter(a => !!a._select).map(a => {
            console.log(a);
            return a.usuario
        })
        if (selecteds.length <= 0) return;

        return <SView card padding={2} row width={110}
            style={{
                backgroundColor: STheme.color.secondary,
                position: "absolute",
                top: -24,
                // right: -0,
            }}
            onPress={() => {
                this.handleInvitarArray(selecteds)
            }} center>
            <SView width={54} height={20} style={{ borderColor: STheme.color.white, borderRightWidth: 1 }} center row>
                <SText center color={STheme.color.white} bold > {selecteds.length}</SText>
                <SView width={4} />
                <SIcon name='invite2' fill={STheme.color.white} width={15} height={15} />
                <SView width={4} />
            </SView>
            <SView width={4} />
            {(selecteds.length > 1) ? <SText fontSize={12} style={{ paddingLeft: 2 }} color={STheme.color.white} bold language={{ es: "Invitar", en: "Invite all" }} /> :
                <SText color={STheme.color.white} style={{ paddingLeft: 2 }} fontSize={12} bold language={{ es: "Invitar", en: "Invite" }} />
            }

        </SView>
    }
    renderAsignarJefe() {
        if (!this.state.data_disponibles) return;
        const selecteds = this.state.data_disponibles.filter(a => !!a.select_derecha).map(a => a?.staff_usuario?.key)
        if (selecteds.length <= 0) return;


        return <SView card padding={2} width={110} center row
            style={{
                backgroundColor: STheme.color.warning,
                position: "absolute",
                top: -23
            }}
            onPress={() => {
                SNavigation.navigate("/company/roles", {
                    key_company: this.state.data.evento.key_company,
                    key_evento: this.state.data.key_evento,
                    onSelect: (usuario) => {
                        SSocket.sendPromise({
                            component: "staff_usuario",
                            type: "asignarJefeMultiple",
                            key_usuario: Model.usuario.Action.getKey(),
                            key_staff_usuario: selecteds,
                            key_usuario_atiende: usuario.key_usuario,
                        }).then(e => {
                            this.componentDidMount();
                        }).catch(e => {

                        })
                    }
                })

                // this.handleInvitarArray(selecteds)
            }}>
            <SText bold language={{ es: "Asignar Jefe", en: "Assign Boss" }} />
            <SText bold > {selecteds.length}</SText>
        </SView>
    }

    calculador_hora(hora_inicio, hora_fin) {
        if (!hora_inicio) return "";
        const time = new SDate(hora_inicio, "yyyy-MM-ddThh:mm:ssTZD").diffTime(new SDate(hora_fin, "yyyy-MM-ddThh:mm:ssTZD"))
        return isNaN(time) ? "" : time / 1000 / 60 / 60;
    }

    render() {
        let lenguaje = SLanguage.language;
        // console.log(this.state.data_disponibles)
        return <SPage disableScroll titleLanguage={{
            es: "Armando mi STAFF",
            en: "Building my STAFF"
            
        }}
            backAlternative={o => {
                if (this.state.data.key_evento) {
                    SNavigation.replace("/company/event", { key_evento: this.state.data.key_evento })
                } else {
                    SNavigation.goBack();
                }
            }}
            footer={<PBarraFooter url={'/company'} />}
        >
            <SView col={"xs-12"} row style={{ alignItems: "flex-end", paddingRight: 8, paddingLeft: 8, marginTop: 10 }} >
                <SText bold fontSize={16}>{this.state?.data?.evento?.descripcion} holaa </SText>
                <SView width={6} />
                <SView width={16} />
                <SText onPress={() => { window.location.reload() }}><SIcon name='Reload' width={20} height={20} fill={STheme.color.text} />{" Reload"}</SText>
                <SHr />
                <SView col={"xs-12"} row>
                    <ItemImage src={SSocket.api.root + "company/" + this.state?.data?.evento?.key_company} label={this.state?.data_company?.descripcion} />
                    <ItemImage src={SSocket.api.root + "cliente/" + this.state?.data?.evento?.key_cliente} label={this.state?.data_cliente?.descripcion} />
                    <ItemImage src={SSocket.api.root + "staff_tipo/" + this.state?.data?.staff_tipo?.key} label={this.state?.data?.staff_tipo?.descripcion} />
                    <SView col={'xs-12'} flex row height={32}>
                        <SScrollView2 disableHorizontal>
                            <SText fontSize={11} color={STheme.color.gray}   >{"( "}{this.state?.data?.descripcion}{" )"}</SText>
                        </SScrollView2>
                    </SView>
                    {/* <SText fontSize={11} center color={STheme.color.gray} backgroundColor='red' >{"( "}{this.state?.data?.descripcion}{" )"}</SText> */}
                </SView>
                <SHr />

                <SHr />
                <SText center color={STheme.color.gray} language={{ es: "Inicio:", en: "Start:" }} />
                <SView width={6} />
                {/* <SText fontSize={14} language={{
                    es: this.formatearFecha(new Date(this.state?.data?.fecha_inicio), "es"),
                    en: this.formatearFecha(new Date(this.state?.data?.fecha_inicio), "en")
                }} /> */}
                {/* <SText fontSize={14} language={{
                    es: new SDate(this.state?.data?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("MONTH dd, yyyy,  HH"),
                    en: new SDate(this.state?.data?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("MONTH dd, yyyy,  HH")
                }} /> */}
                <SText fontSize={14} >{new SDate(this.state?.data?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("MONTH dd, yyyy  HH")}</SText>
                {(this.state?.data?.fecha_fin) ? <>
                    <SText center color={STheme.color.gray} language={{
                        es: " | Fin:",
                        en: " | End:"
                    }} />
                    <SView width={6} />
                    <SText fontSize={14} >{new SDate(this.state?.data?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("MONTH dd, yyyy  HH")}</SText>
                </> : null}
                <SView width={6} />
                {(this.EsFechaMenorOIgual(this.state?.data?.fecha_inicio, this.state?.data?.fecha_fin)) ? <SText fontSize={16} center color={STheme.color.danger} language={{
                    en: "[ Past event ]",
                    es: "[ Evento pasado ]"
                }} /> : null}

                <SHr />
                <SView col={"xs-12"} style={{ alignItems: "flex-end" }}>
                    {/* <SView row>
                        <SView style={{
                            borderWidth: 1,
                            borderColor: STheme.color.success,
                            borderRadius: 4,
                            padding: 5,
                        }} center>
                            <SText fontSize={14} color={STheme.color.success}>{this.state?.data?.staff_tipo?.descripcion}</SText>
                        </SView>
                    </SView>
                    <SView width={7} /> */}
                    {/* <SView row col={"xs-12"} > */}
                    {/* <SText fontSize={12} bold color={STheme.color.gray}>Se requiere:</SText> */}
                    {/* <SView width={6} /> */}
                    <SView flex style={{
                        borderWidth: 1,
                        borderColor: STheme.color.warning,
                        borderRadius: 4,
                        padding: 5,
                    }} center>
                        <SText fontSize={12} color={STheme.color.warning}> {SLanguage.select({ es: "Nivel de inglés: ", en: "English level: " })} {this.state?.data?.nivel_ingles}</SText>
                    </SView>
                    {/* </SView> */}
                    <SView flex />
                </SView>
            </SView>
            <SView row col={"xs-12"} flex style={{ paddingBottom: 20, paddingLeft: 4, paddingRight: 4, paddingTop: 4 }} >
                <ResizeDualPanel
                    startX={(Dimensions.get("window").width / 2) - 8}
                    content1={
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
                                filter={(a) => (!a.staff_usuario || a?.staff_usuario?.estado == 2) && (!!a?.usuario)}
                                rowHeight={25}
                                cellStyle={{
                                    justifyContent: "center",
                                    paddingStart: 2,
                                    height: 40,
                                    color: STheme.color.text

                                }}
                                // filter={a => a.estado != 0}
                                headerColor={STheme.color.primary}
                                header={[
                                    {
                                        key: "-select", width: 25,
                                        renderHeader: () => {
                                            const ff = this.state.data_disponibles.filter(a => (!a.staff_usuario || a?.staff_usuario?.estado == 2) && (!!a?.usuario));
                                            const ff_disponible = ff.filter(a => !a.staff_usuario);
                                            const ff_select = ff.filter(a => !!a._select);
                                            let active = false;
                                            if (ff_disponible.length == ff_select.length) {
                                                active = true
                                            }
                                            return <SView width={20} height={20}>
                                                <SInput type={"checkBox"} defaultValue={active} onChangeText={e => {
                                                    if (e) {
                                                        ff_disponible.map((itm) => {
                                                            itm._select = true;
                                                        })
                                                        this.setState({ ...this.state })
                                                    } else {
                                                        ff_select.map((itm) => {
                                                            itm._select = false;
                                                        })
                                                        this.setState({ ...this.state })
                                                    }
                                                    console.log(e);
                                                }}
                                                    {...(this.EsFechaMenorOIgual(this.state?.data?.fecha_inicio, this.state?.data?.fecha_fin) ? { disabled: true } : {})}
                                                />
                                            </SView>
                                        },
                                        component: (elm) => <SView col={"xs-12"} center>
                                            <SView width={20} height={20} >
                                                <SInput key={elm.key ?? ""} type='checkBox' defaultValue={elm?._select ?? elm?.staff_usuario}
                                                    disabled={this.EsFechaMenorOIgual(this.state?.data?.fecha_inicio, this.state?.data?.fecha_fin)}
                                                    backgroundColor={elm?.staff_usuario ? STheme.color.lightGray : "#1975FF"}
                                                    onChangeText={e => {
                                                        if (elm?.staff_usuario) {

                                                            SSocket.sendPromise({
                                                                component: "staff_usuario",
                                                                type: "desinvitarGrupo",
                                                                key_usuarios_desinvitados: [elm.key_usuario],
                                                                key_staff: this.pk,
                                                                key_usuario: Model.usuario.Action.getKey(),
                                                            }).then(e => {
                                                                // this.loadData();
                                                                elm._select = false;
                                                                this.setState({ ...this.state })
                                                                SNotification.send({
                                                                    title: (lenguaje == "es") ? "Cancelación de la Invitación" : "Invitation Canceled",
                                                                    body: (lenguaje == "es") ? "Se canceló la invitación al usuario seleccionado" : "The invitation to the selected user was canceled",
                                                                    color: STheme.color.success,
                                                                    time: 5000
                                                                })
                                                            }).catch(e => {
                                                                console.error(e)
                                                                SNotification.send({
                                                                    title: (lenguaje == "es") ? "Error al cancelar la invitación" : "Error canceling the invitation",
                                                                    body: (lenguaje == "es") ? "Ocurrio un error al cancelar la invitación" : "An error occurred while canceling the invitation",
                                                                    color: STheme.color.danger,
                                                                    time: 5000
                                                                })
                                                            })
                                                            console.log("Ya tiene staff")
                                                        }
                                                        elm._select = !!e;
                                                        this.setState({ ...this.state })
                                                    }}
                                                />
                                            </SView>
                                        </SView>,
                                        renderExcel: (a) => {
                                            return "";
                                        }
                                    },
                                    // {
                                    //     key: "-", width: 50, component: (elm) => <SView col={"xs-12"} center>
                                    //         {!elm.staff_usuario ? null : <SText color={STheme.color.danger} fontSize={12} underLine onPress={() => {
                                    //             SSocket.sendPromise({
                                    //                 component: "staff_usuario",
                                    //                 type: "desinvitarGrupo",
                                    //                 key_usuarios_desinvitados: [elm.key_usuario],
                                    //                 key_staff: this.pk,
                                    //                 key_usuario: Model.usuario.Action.getKey(),
                                    //             }).then(e => {
                                    //                 this.loadData();
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
                                    //         }}>{"Uninvite"}</SText>}
                                    //     </SView>,
                                    //     renderExcel: (a) => {
                                    //         return "";
                                    //     }
                                    // },

                                    // {
                                    //     key: "-", width: 50, component: (elm) => <SView col={"xs-12"} center>
                                    //         {!elm.staff_usuario ? null : <SView width={20} height={20} ><SInput key={elm.key ?? ""} defaultValue={true} type='checkBox' onChangeText={e => {

                                    //             SSocket.sendPromise({
                                    //                 component: "staff_usuario",
                                    //                 type: "desinvitarGrupo",
                                    //                 key_usuarios_desinvitados: [elm.key_usuario],
                                    //                 key_staff: this.pk,
                                    //                 key_usuario: Model.usuario.Action.getKey(),
                                    //             }).then(e => {
                                    //                 this.loadData();
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
                                    //         }} /></SView>}
                                    //         </SView>,
                                    //     renderExcel: (a) => {
                                    //         return "";
                                    //     }
                                    // },



                                    // {
                                    //     key: "eventos_duplicados", label: SLanguage.select({
                                    //         en: "Avail.",
                                    //         es: "Disp."
                                    //     }), width: 34, component: (a) => {
                                    //         let color = STheme.color.warning
                                    //         let onPress = null;
                                    //         if (!a || !a.length) {
                                    //             color = STheme.color.success
                                    //         } else {
                                    //             onPress = () => {
                                    //                 SPopup.open({
                                    //                     content: <SView col={"xs-12"} height={230} backgroundColor={STheme.color.primary} center>
                                    //                         <SHr height={15} />
                                    //                         <SIcon name='noUser' fill={STheme.color.text} width={100} height={100} />
                                    //                         <SHr h={4} />
                                    //                         <SText fontSize={16} language={{
                                    //                             es: "Usuario registrado en otro evento",
                                    //                             en: "User registered in another event"
                                    //                         }} />
                                    //                         <SHr height={8} />
                                    //                         <SView padding={10} center style={{
                                    //                             borderRadius: 4,
                                    //                             borderWidth: 1,
                                    //                             borderColor: STheme.color.text
                                    //                         }}>
                                    //                             <SView center>
                                    //                                 <SText language={{
                                    //                                     es: "Evento: ",
                                    //                                     en: "Event: "
                                    //                                 }} />{a.map(p => <SView>
                                    //                                     <SText fontSize={16} bold>{p.evento}</SText>
                                    //                                 </SView>)}
                                    //                             </SView>
                                    //                             <SView row center>
                                    //                                 <SText language={{
                                    //                                     es: "Horario: ",
                                    //                                     en: "Schedule: "
                                    //                                 }} />{a.map(p => <SView>
                                    //                                     <SView row>
                                    //                                         <SText fontSize={16} bold>{new SDate(p.fecha_inicio, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("HH")} </SText>
                                    //                                         <SText> - </SText>
                                    //                                         <SText fontSize={16} bold>{new SDate(p.fecha_fin, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("HH")}</SText>
                                    //                                     </SView>
                                    //                                 </SView>)}
                                    //                             </SView>
                                    //                         </SView>
                                    //                         <SHr height={15} />
                                    //                     </SView>
                                    //                 })
                                    //             }
                                    //         }

                                    //         return <SView onPress={onPress}>

                                    //             <SIcon name={(!a || !a.length) ? 'dispo' : 'noDispo'} fill={color} width={22} height={22} />
                                    //         </SView>
                                    //     },
                                    //     renderExcel: (a) => {
                                    //         return "";
                                    //     }
                                    // },



                                    {
                                        key: "key_usuario", label: SLanguage.select({
                                            en: "Photo",
                                            es: "Foto"
                                        }), width: 30, component: (usr) => <SView card width={25} height={25} center
                                            style={{ borderRadius: 4, overflow: "hidden" }}>
                                            <SImage enablePreview src={SSocket.api.root + "usuario/" + usr} style={{
                                                resizeMode: "cover",
                                            }} /></SView>
                                    },
                                    // {
                                    //     key: "employee_number", label: SLanguage.select({
                                    //         en: "E. Number",
                                    //         es: "N. de empleado"
                                    //     }), width: 60,
                                    // },

                                    {
                                        key: "usuario", label: SLanguage.select({
                                            en: "User",
                                            es: "Usuario"
                                        }), width: 130, render: (usr) => `${usr.Nombres ?? ""} ${usr.Apellidos ?? ""}`

                                    },

                                    {
                                        key: "participacion", label: SLanguage.select({
                                            en: "Events\nTREND",
                                            es: "Eventos\nTENDEN."
                                        }), width: 45, order: "desc", headerColor: STheme.color.warning + "70",
                                    },
                                    {
                                        key: "rechazos", label: SLanguage.select({
                                            en: "Rejects",
                                            es: "Rechazos"
                                        }), width: 45, component: (number) => <SText fontSize={12} color={(number > 0) ? STheme.color.danger : STheme.color.text} bold >{(number > 0) ? number : null}</SText>
                                    },

                                    // { key: "horas_trabajadas_tipo", label: SLanguage.select({
                                    //     en: "Hrs. Staff\nTREND",
                                    //     es: "Hrs. Staff\nTENDEN."
                                    // }), width: 65, order: "desc", render: a => !a ? "" : parseFloat(a).toFixed(2) },

                                    // component: (a) => {

                                    // {
                                    //  key: "horas_trabajadas_tipo", label: SLanguage.select({
                                    //   en: "Hrs. Staff",
                                    //   es: "Hrs. Staff"
                                    //  }), width: 65, render: (a) => {
                                    //   if (a) {
                                    //    return parseFloat(a).toFixed(2)
                                    //   } else {
                                    //    return ""
                                    //   }
                                    //  }
                                    // },

                                    // {
                                    //  key: "horas_trabajadas_company", label: SLanguage.select({
                                    //   en: "Hrs. Company",
                                    //   es: "Hrs. Empresa"
                                    //  }), width: 75, render: a => !a ? "" : parseFloat(a).toFixed(2)
                                    // },


                                    // {key: "usuario/Telefono", label: "Telefono", width: 100 },
                                    {
                                        key: "usuario/Telefono", label: SLanguage.select({
                                            en: "Phone",
                                            es: "Telefono"
                                        }), width: 110, component: (number) => <BtnWhatsapp telefono={number}
                                            texto={this.state?.data?.evento?.observacion}
                                        >
                                            <SText fontSize={11} color={STheme.color.text} underLine>
                                                {number}
                                            </SText>
                                        </BtnWhatsapp>
                                    },
                                    {
                                        key: "usuario/nivel_ingles", label: SLanguage.select({
                                            en: "English level",
                                            es: "Nivel de inglés"
                                        }), width: 60,
                                    },

                                    {
                                        key: "salario_hora", label: SLanguage.select({
                                            en: "Salary",
                                            es: "Salario"
                                        }), width: 60, component: (obj) => {
                                            const user = this.usuarios
                                            console.log(user)
                                            return <SView col={"xs-12"} row
                                                onPress={() => {
                                                    // // this.handleEditSalario(obj)
                                                    // SSocket.sendPromise({
                                                    //     component: "cliente",
                                                    //     type: "getByKey",
                                                    //     key: e.data.evento.key_cliente,
                                                    // }).then(e => {
                                                    //     this.setState({ data_cliente: e.data })
                                                    // }
                                                    // ).catch(e => {
                                                    //     console.error(e);
                                                    // })
                                                }} center>
                                                {/* <SIcon name="Edit" fill={STheme.color.success} width={20} height={20} /> */}
                                                <SView width={3} />
                                                <SText fontSize={11} color={STheme.color.text} >{obj}</SText>
                                            </SView>
                                        },
                                        renderExcel: (obj) => {
                                            const user = this.usuarios[obj.key_usuario_atiende]?.usuario
                                            return user ? `${user.Nombres} ${user.Apellidos}` : "Sin jefe"
                                            // return a.map(b => b.descripcion)
                                        }
                                    },

                                    // {
                                    //     key: "eventos_duplicados", label: SLanguage.select({
                                    //         en: "Photo",
                                    //         es: "Enviar"
                                    //     }), width: 70, component: (usr) => <SView backgroundColor='green' width={70} height={25} center
                                    //         style={{ borderRadius: 4, overflow: "hidden" }}
                                    //         onPress={(e) => {
                                    //             alert("traspasar", e?.key_usuario)
                                    //         }}
                                    //     >
                                    //         <SText fontSize={11} color={STheme.color.text} underLine>traspaso</SText>
                                    //     </SView>
                                    // },

                                    {
                                        key: "eventos_duplicados",
                                        label: SLanguage.select({
                                            en: "Avail.",
                                            es: "Disp."
                                        }),
                                        width: 300,
                                        component: (a) => {
                                            let color = STheme.color.warning;
                                            if (!a || !a.length) return null;

                                            return (
                                                <SView
                                                    onPress={() => {
                                                        SPopup.confirm({
                                                            title: "Are you sure?",
                                                            message: "Are you sure you want to transfer this user?",
                                                            onPress: () => {
                                                                SSocket.sendPromise({
                                                                    component: "staff_usuario",
                                                                    type: "cambiarEvento",
                                                                    data: [a[0].key_staff_usuario],
                                                                    key_staff: this.pk,
                                                                }).then(e => {
                                                                    SNotification.send({
                                                                        key: "staff_usuario-asingJefe",
                                                                        title: "Successfully applied.",
                                                                        body: "Successfully registered.",
                                                                        color: STheme.color.success,
                                                                        time: 5000,
                                                                    });
                                                                    this.loadData();
                                                                }).catch(console.error);
                                                            }
                                                        });
                                                    }}
                                                    row
                                                    center
                                                    col={"xs-12"}
                                                    style={{ padding: 4, borderRadius: 8 }}
                                                >

                                                    <SView col={"xs-2"} row center>
                                                        <SIcon name="noDispo" fill={color} width={18} height={18} />
                                                        <SView width={60} center>
                                                            <SText
                                                                center
                                                                fontSize={10}
                                                                color={color}
                                                                style={{ lineHeight: 12 }}
                                                                language={{
                                                                    es: "Transferir aquí",
                                                                    en: "Transfer here"
                                                                }}
                                                            />
                                                        </SView>
                                                    </SView>


                                                    <SView col={"xs-9"} style={{ paddingLeft: 6 }}>
                                                        {a.map(p => (

                                                            <SView key={p.key_staff_usuario} style={{ marginBottom: 6 }}>


                                                                <SView row style={{ gap: 4, marginTop: -5, marginLeft: 1 }}>
                                                                    <SText fontSize={7} color={STheme.color.text} style={{ maxWidth: 100 }} numberOfLines={1} language={{ es: `Evento ${p.evento}`, en: `Event ${p.evento}` }}></SText>
                                                                    <SText fontSize={7} color={STheme.color.text}>{new SDate(p.fecha_inicio, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("HH")}</SText>
                                                                    <SText fontSize={7} color={STheme.color.text}>-</SText>
                                                                    <SText fontSize={7} color={STheme.color.text}>{new SDate(p.fecha_fin, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("HH")}</SText>
                                                                </SView>
                                                                <SView row style={{ gap: 2, marginBottom: -8 }}>
                                                                    <SView style={{ color: STheme.color.text, borderWidth: 1, borderColor: STheme.color.primary, borderRadius: 4, backgroundColor: STheme.color.primary }} >
                                                                        <ItemImage src={SSocket.api.root + "staff_tipo/" + p.key_staff_tipo} label={p.descripcion_staff_tipo} />
                                                                    </SView>
                                                                    <SView style={{ color: STheme.color.text, borderWidth: 1, borderColor: STheme.color.primary, borderRadius: 4, backgroundColor: STheme.color.primary }} >
                                                                        <ItemImage src={SSocket.api.root + "cliente/" + p.key_cliente} label={p.descripcion_cliente} />
                                                                    </SView>
                                                                </SView>




                                                            </SView>
                                                        ))}
                                                    </SView>
                                                </SView>
                                            );
                                        }
                                    }

                                    // {
                                    //     key: "eventos_duplicados-otra",
                                    //     label: SLanguage.select({ en: "Event.", es: "Evento" }),
                                    //     width: 140,
                                    //     component: (a) => {
                                    //         if (!a || !a.length) return null;
                                    //         return (
                                    //             <SView>
                                    //                 {a.map((p, index) => (
                                    //                     <SText fontSize={8} key={index} color='red' bold>{p.evento} </SText>
                                    //                 ))}
                                    //             </SView>
                                    //         );
                                    //     },
                                    // },
                                    // {
                                    //     key: "eventos_duplicados-otra2",
                                    //     label: SLanguage.select({ en: "fecha_inicio.", es: "fecha_inicio" }),
                                    //     width: 140,
                                    //     component: (a) => {
                                    //         if (!a || !a.length) return null;
                                    //         return (
                                    //             <SView>
                                    //                 {a.map((p, index) => (
                                    //                     <SText fontSize={8} key={index}>{new SDate(p.fecha_inicio, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("HH")} </SText>
                                    //                 ))}
                                    //             </SView>
                                    //         );
                                    //     },
                                    // },
                                    // {
                                    //     key: "eventos_duplicados-otra3",
                                    //     label: SLanguage.select({ en: "fecha_fin.", es: "fecha_fin" }),
                                    //     width: 140,
                                    //     component: (a) => {
                                    //         if (!a || !a.length) return null;
                                    //         return (
                                    //             <SView>
                                    //                 {a.map((p, index) => (
                                    //                     <SText fontSize={8} key={index}>{new SDate(p.fecha_fin, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("HH")} </SText>
                                    //                 ))}
                                    //             </SView>
                                    //         );
                                    //     },
                                    // },

                                    // {
                                    //     key: "eventos_duplicados-otra4",
                                    //     label: SLanguage.select({ en: "Evento compl", es: "Evento compl" }),
                                    //     width: 140,
                                    //     component: (a) => {
                                    //         if (!a || !a.length) return null;
                                    //         return (
                                    //             <SView>
                                    //                 {a.map((p, index) => (<SView>
                                    //                     <SText fontSize={8} key={index} color='red' bold>{p.evento} </SText>
                                    //                     <SText fontSize={8} key={index}>{new SDate(p.fecha_inicio, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("HH")} </SText>
                                    //                     <SText fontSize={8} key={index}>{new SDate(p.fecha_fin, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("HH")} </SText>
                                    //                 </SView>
                                    //                 ))}
                                    //             </SView>
                                    //         );
                                    //     },
                                    // },
                                ]} />
                        </SView >
                    }
                    content2={
                        <SView flex height backgroundColor={STheme.color.info} style={{ borderRadius: 4 }} >
                            <SHr h={4} />
                            <SText center fontSize={12} color={STheme.color.text} language={{
                                es: "Staff Aceptado",
                                en: "Staff Accepted"
                            }} />
                            {this.renderAsignarJefe()}

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
                                    {
                                        key: "-", width: 25,
                                        renderHeader: () => {
                                            const ff = this.state.data_disponibles.filter(a => !!a.staff_usuario && a?.staff_usuario?.estado != 2);
                                            const ff_disponible = ff.filter(a => !!a.staff_usuario);
                                            const ff_select = ff.filter(a => !!a.select_derecha);
                                            let active = false;
                                            if (ff_disponible.length == ff_select.length) {
                                                active = true
                                            }
                                            return <SView width={20} height={20}>
                                                <SInput type={"checkBox"} defaultValue={active} onChangeText={e => {
                                                    if (e) {
                                                        ff_disponible.map((itm) => {
                                                            itm.select_derecha = true;
                                                        })
                                                        this.setState({ ...this.state })
                                                    } else {
                                                        ff_select.map((itm) => {
                                                            itm.select_derecha = false;
                                                        })
                                                        this.setState({ ...this.state })
                                                    }
                                                    console.log(e);
                                                }} />
                                            </SView>
                                        },
                                        component: (elm) => <SView col={"xs-12"} center><SView width={20} height={20}>
                                            <SInput type='checkBox' defaultValue={elm.select_derecha} onChangeText={e => {
                                                elm.select_derecha = !!e;
                                                this.setState({ ...this.state })
                                            }} /></SView></SView>,
                                        renderExcel: (a) => {
                                            return "";
                                        }
                                    },
                                    {
                                        key: "key_usuario", label: SLanguage.select({
                                            en: "Photo",
                                            es: "Foto"
                                        }), width: 30, component: (usr) => <SView card width={25} height={25} center
                                            style={{ borderRadius: 4, overflow: "hidden" }}>
                                            <SImage enablePreview src={SSocket.api.root + "usuario/" + usr} style={{
                                                resizeMode: "cover",
                                            }} /></SView>
                                    },
                                    // {
                                    //     key: "employee_number", label: SLanguage.select({
                                    //         en: "E. Number",
                                    //         es: "N. de empleado"
                                    //     }), width: 70,
                                    // },
                                    {
                                        key: "usuario", label: SLanguage.select({
                                            en: "User",
                                            es: "Usuario"
                                        }), width: 150, render: (usr) => `${usr.Nombres ?? ""} ${usr.Apellidos ?? ""}`
                                    },
                                    // {
                                    //     key: "staff_usuario", label: SLanguage.select({
                                    //         en: "Status",
                                    //         es: "Estado"
                                    //     }), width: 140, component: (obj) => <SView col={"xs-12"} center>
                                    //         {/* <SView width={24} height={18} style={{ borderRadius: 100 }} backgroundColor={STheme.color.warning}></SView> */}
                                    //         {this.renderStaffUsuario(obj)}
                                    //     </SView>,
                                    //     renderExcel: (a) => {
                                    //         return "";
                                    //     }
                                    // },

                                    {
                                        key: "staff_usuario/fecha_ingreso", label: SLanguage.select({
                                            en: "Clock In",
                                            es: "Ingreso"
                                        }), width: 80,
                                        render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("HH"),
                                    },
                                    {
                                        key: "staff_usuario/fecha_salida", label: SLanguage.select({
                                            en: "Clock Out",
                                            es: "Salida"
                                        }), width: 80,
                                        render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("HH"),
                                    },
                                    {
                                        key: "staff_usuario", label: SLanguage.select({
                                            en: "Times",
                                            es: "Horas"
                                        }), width: 80,
                                        // render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ss.sssTZD").toString("HH"),
                                        render: (staff_usuario) => {
                                            if (!staff_usuario.fecha_ingreso || !staff_usuario.fecha_salida) return "";
                                            let hora44 = this.calculador_hora(staff_usuario.fecha_ingreso, staff_usuario.fecha_salida);
                                            return (hora44).toFixed(2);
                                        }
                                    },
                                    {
                                        key: "-edit", label: SLanguage.select({
                                            en: "Clock Out",
                                            es: "Salida"
                                        }), width: 80,
                                        component: (o) => {
                                            return <SText onPress={(e) => {
                                                SPopup.open({
                                                    key: "editclock",
                                                    content: <EditClock data={o} onChange={e => {
                                                        this.componentDidMount()
                                                        SPopup.close("editclock")
                                                    }} />
                                                })
                                            }}>Edit Clock</SText>
                                        }
                                    },
                                    {
                                        key: "staff_usuario-2", label: SLanguage.select({
                                            en: "Boss",
                                            es: "Jefe"
                                        }), width: 140, component: (obj) => {
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
                                        },
                                        renderExcel: (obj) => {
                                            const user = this.usuarios[obj.key_usuario_atiende]?.usuario
                                            return user ? `${user.Nombres} ${user.Apellidos}` : "Sin jefe"
                                            // return a.map(b => b.descripcion)
                                        }
                                    },

                                    {
                                        key: "usuario/Telefono", label: SLanguage.select({
                                            en: "Phone",
                                            es: "Teléfono"
                                        }), width: 100, component: (number) => <BtnWhatsapp telefono={number} texto={"Hola, Staff Pro USA te saluda!"}>
                                            <SText fontSize={11} color={STheme.color.text} underLine>
                                                {number}
                                            </SText>
                                        </BtnWhatsapp>
                                    },
                                    {
                                        key: "staff_usuario-3", label: SLanguage.select({
                                            en: "Move",
                                            es: "Mover"
                                        }), width: 60, component: (obj) => {
                                            const user = this.usuarios[obj.key_usuario_atiende]?.usuario
                                            return <SView col={"xs-12"} flex onPress={() => {
                                                this.handleMoverStaff(obj)
                                            }} center>
                                                <SIcon name="move" fill={STheme.color.success} width={30} height={30} />
                                            </SView>
                                        },
                                        renderExcel: (obj) => {
                                            const user = this.usuarios[obj.key_usuario_atiende]?.usuario
                                            return user ? `${user.Nombres} ${user.Apellidos}` : "Sin jefe"
                                            // return a.map(b => b.descripcion)
                                        }
                                    },
                                    {
                                        key: "staff_usuario/salario_hora", label: SLanguage.select({
                                            en: "Salary",
                                            es: "Salario"
                                        }), width: 60,
                                        //  component: (obj) => {
                                        //     const user = this.usuarios
                                        //     console.log(user)
                                        //     return <SView col={"xs-12"} row center>
                                        //         {/* <SIcon name="Edit" fill={STheme.color.success} width={20} height={20} /> */}
                                        //         <SView width={3} />
                                        //         <SText fontSize={11} color={STheme.color.text} >{obj}</SText>
                                        //     </SView>
                                        // },

                                    },
                                    {
                                        key: "-delete", label: SLanguage.select({
                                            en: "Delete",
                                            es: "Eliminar"
                                        }), width: 100, component: (e) => {
                                            return <SText color={STheme.color.text} onPress={() => {
                                                // console.log(e);
                                                SPopup.confirm({
                                                    title: SLanguage.select({
                                                        en: "Are you sure to delete?",
                                                        es: "¿Seguro de eliminar?"
                                                    }),
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
                                            }} language={{
                                                en: "Delete",
                                                es: "Eliminar"
                                            }} />
                                        },
                                        renderExcel: (a) => {
                                            return "";
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
                    }
                />
            </SView >
        </SPage >
    }
}