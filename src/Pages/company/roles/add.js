import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
// import TopBar from '../../../Components/TopBar';
import { SHr, SIcon, SImage, SList, SLoad, SNavigation, SNotification, SPage, SPopup, SText, STheme, SThread, SView } from 'servisofts-component';
// import PBarraFooter from '../../../Components/PBarraFooter';
import Container from '../../../Components/Container';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';
import Input from '../../../Components/Input';
import SelectRol from './Components/SelectRol';
import root from './root';

export default class add extends Component {

    static TOPBAR = <>
        {/* <TopBar type={"usuario_back"} /> */}
        {/* <SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView> */}
    </>

    static FOOTER = <>
        {/* <SView flex /> */}
        {/* <PBarraFooter url={"pedido"} /> */}
    </>

    _inputs = {}
    constructor(props) {
        super(props);
        this.state = {
            roles: []
        };
        this.key_company = SNavigation.getParam("key_company");
        this.key_usuario = SNavigation.getParam("key_usuario");
        this.key = SNavigation.getParam("key");
        // this.key_rol = SNavigation.getParam("key");

    }


    componentDidMount() {
        // ESTO ES PARA PROBAR EL POPUP SIN RECARGAR NO BORRAR
        // const exampleUsers = {
        //     "798994df-71c1-4850-b45d-6fc2642e6fb3": {
        //         "Correo": "rickypazd@icloud.com",
        //         "Apellidos": "Paz Demiquel",
        //         "Nombres": "Ricardo",
        //         "Telefono": "+591 75395848",
        //         "Password": "202cb962ac59075b964b07152d234b70"
        //     }
        // }
        // this.openPopup("telefono", exampleUsers)



        if (!this.key) {
            // SNavigation.navigate("/usuario", {
            //     onSelect: (e) => {
            //         this.key_usuario = e.key;
            //         this.buscar_usuario(e.Correo, 0)
            //     }
            // })
        }
        this.getRoles();
    }

    openPopup(key_input, users) {
        SPopup.open({
            key: "popup_error",
            content: <SView style={{
                maxWidth: 350,
            }} col={"xs-12"} withoutFeedback backgroundColor={STheme.color.background} borderRadius={8} center padding={20}>
                <SIcon width={20} name='AlertOutline' fill={STheme.color.warning} />
                <SHr />
                <SText color={STheme.color.warning} center fontSize={18}>{"¡El " + key_input + " ya existe!"}</SText>
                <SHr />
                <SHr h={1} color={STheme.color.card} />
                <SHr />
                <SText fontSize={10} col={"xs-12"} color={STheme.color.gray}>{"Puedes invitar al usuario que tiene éste teléfono presionando sobre el botón invitar al lado del usuario."}</SText>
                <SHr h={16} />
                {Object.keys(users).map(user_key => {
                    const user = users[user_key];
                    user.key = user_key;

                    return <SView row center col={"xs-12"}>
                        <SView width={40} height={40} card style={{ overflow: "hidden" }}>
                            <SImage src={SSocket.api.root + "usuario/" + user_key} style={{ resizeMode: "cover" }} />
                        </SView>
                        <SView width={8} />
                        <SView flex>
                            <SText bold>{"Nombre Apellido"}</SText>
                            <SText fontSize={10} color={STheme.color.gray}>{user.Correo}</SText>
                            <SText fontSize={10} color={STheme.color.gray}>{user.Telefono}</SText>
                        </SView>
                        <SView width={8} />
                        <SView width={50} height={40} card center>
                            <SText bold fontSize={9} onPress={() => {
                                if (this._inputs["correo"]) {
                                    this._inputs["nombre"].setValue(user.Nombres)
                                    this._inputs["nombre"].setData(user)
                                    this._inputs["apellido"].setValue(user.Apellidos)
                                    this._inputs["correo"].setValue(user.Correo)
                                    this._inputs["telefono"].setValue(user.Telefono)
                                    SPopup.close("popup_error");
                                }
                            }}>{"INVITAR"}</SText>
                        </SView>
                    </SView>
                })}

                <SHr h={32} />
                <SHr h={1} color={STheme.color.card} />
                <SHr />
                <SText fontSize={10} col={"xs-12"} color={STheme.color.gray}>{"o puedes modificar el " + key_input + " para que no exista en el sistema."}</SText>
                <SHr h={8} />
                <SView padding={8} card height={40} center onPress={() => {
                    SPopup.close("popup_error");
                }}>
                    <SText center bold fontSize={10}>{("MODIFICAR EL " + key_input).toUpperCase()}</SText>
                </SView>
                <SHr h={16} />
            </SView>
        })
    }
    getRoles() {
        SSocket.sendPromise({
            service: "roles_permisos",
            component: "rol",
            type: "getAll",
        }).then(e => {
            let roles_partner = Object.values(e.data).filter(e => e.estado > 0 && e.tipo == "company").sort((a, b) => a.index > b.index ? 1 : -1);
            // let roles_partner = Object.values(e.data).filter(e => e.tipo == "partner");
            // const mirolkey = Model.restaurante.Action.getSelectKeyRol();
            // const miRol = roles_partner.find(a => a.key == mirolkey);
            // roles_partner = roles_partner.filter(a => (a.index ?? 0) >= (miRol.index ?? 0))
            // this.state.miRol = miRol;
            this.state.roles = roles_partner;

            if (roles_partner && this._inputs.rol) {
                if (roles_partner[0]) {
                    const rp = roles_partner[0];
                    this._inputs.rol.setValue(rp.descripcion)
                    this._inputs.rol.setData(rp)
                }
            }
            this.setState({ ...this.state })
            this.getUsuarioRestaurante();

        }).catch(e => {

        })
    }

    getUsuarioRestaurante() {
        if (!this.key) return;
        SSocket.sendPromise({
            component: "usuario_company",
            type: "getAll",
            key_company: this.key_company
        }).then(e => {
            let keys = [this.key_usuario];
            SSocket.sendPromise({
                version: "2.0",
                service: "usuario",
                component: "usuario",
                type: "getAllKeys",
                keys: keys,
            }).then(resp => {
                console.log(resp)
                this.setState({ data: e.data })
                const usuario_company = e.data[this.key]

                const usuario = resp.data[this.key_usuario]?.usuario;

                console.log("llego aca", this._inputs)
                this._inputs["nombre"].setValue((usuario.Nombres ?? "") + " " + (usuario.Apellidos ?? ""))
                this._inputs["nombre"].setData(usuario)
                this._inputs["correo"].setValue(usuario.Correo)
                this._inputs["telefono"].setValue(usuario.Telefono)

                const rol = this.state.roles.find(a => a.key == usuario_company.key_rol)
                this.state.rol_usuario = rol;
                this._inputs["rol"].setValue(rol?.descripcion)
                this._inputs["rol"].setData(rol)
                // this.setState({ ...this.state })
                // Object.values(e.data).find()
                // })

            }).catch(e2 => {
                console.error(e);
            })
        }).catch(e => {
            console.error(e);
        })
    }

    renderItem(obj) {
        return <SView col={"xs-12"} padding={8} style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#CCC"
        }}>
            <SText fontSize={12} font='Montserrat-Bold'>{obj?.usuario?.Nombres} {obj?.usuario?.Apellidos}</SText>
            <SText fontSize={12}>{"ADMINISTRADOR/A"}</SText>
            <SText fontSize={12} color={STheme.color.gray}>{obj?.usuario?.Telefono}</SText>
            <SText fontSize={12} color={STheme.color.gray}>{obj?.usuario?.Correo}</SText>
        </SView>
    }
    renderList() {
        if (!this.state.data) return <SLoad />
        return <SList
            data={this.state.data}
            render={this.renderItem}
        />
    }

    hanlePress = (e) => {
        // console.log(this.state)
        // if (this.state.rol_usuario) {
        //     if (this.state.miRol.index > this.state.rol_usuario.index) {
        //         SPopup.alert("No puedes cambiar el rol de un usuario con una jerarquía superior.")
        //         return;
        //     }
        // }

        // Vibration.vibrate(100)
        e.currentTarget.measure((x, y, width, height, pageX, pageY) => {
            const key_popup = "popupkey";
            const windowheight = Dimensions.get("window").height
            const itemWidth = 200;
            const itemHeight = 176;
            let top = pageY + 35;
            if (itemHeight + top > windowheight) {
                top = windowheight - itemHeight;
            }
            SPopup.open({
                key: key_popup,
                type: "2",
                content: <SelectRol
                    roles={this.state.roles}
                    style={{
                        left: pageX,
                        top: top,
                        itemWidth: width,
                        itemHeight: itemHeight,
                    }}
                    onSelect={(e) => {


                        const inp = this._inputs.rol
                        if (inp) {
                            inp.setValue(e.descripcion)
                            inp.setData(e)
                        }
                        SPopup.close(key_popup)
                    }}
                />
            })
        })
    }
    buscar_usuario(val, key_input, timeDelay = 1000) {
        new SThread(timeDelay, "buscar_usuario", true).start(() => {
            const key_notification = "buscar_usuario";
            // SNotification.send({
            //     key: key_notification,
            //     title: "Buscando usuario",
            //     body: "Esperando encontrar al usuario",
            //     type: "loading"
            // })
            SSocket.sendPromise({
                service: "usuario",
                component: "usuario",
                type: "buscar",
                data: val
            }).then(e => {
                SNotification.remove(key_notification)
                if (e.data) {
                    const arrResultados = Object.keys(e.data);
                    if (arrResultados.length >= 1) {
                        if (this._inputs[key_input]) {
                            const input = this._inputs[key_input];
                        }
                        this.openPopup(key_input, e.data)
                        SNotification.send({
                            title: "Buscando usuario",
                            body: "Se encontraron más de un usuario con " + val,
                            time: 5000,
                            color: STheme.color.warning,
                        })
                    }
                }
            }).catch(e => {
                SNotification.remove(key_notification)
                SNotification.send({
                    title: "Buscando usuario",
                    body: "Ocurrió un error al buscar el usuario.",
                    time: 5000,
                    color: STheme.color.danger,
                })
                console.error(e)
            })


        })
    }

    hanldeGuardar() {
        const rol = this._inputs["rol"].getData() ?? {};
        if (!rol.key) {
            SNotification.send({
                title: "Datos incompletos.",
                body: "Debe seleccionar un rol",
                time: 5000,
                color: STheme.color.warning,
            })
            return;
        }
        const usuario = this._inputs["nombre"].getData() ?? {};
        if (!usuario.key) {
            const usuarioNuevo = {
                Nombres: this._inputs["nombre"].getValue(),
                Apellidos: this._inputs["apellido"].getValue(),
                Telefono: this._inputs["telefono"].getValue(),
                Correo: this._inputs["correo"].getValue(),
            }
            if (!usuarioNuevo.Nombres) {
                SNotification.send({
                    title: "Datos incompletos.",
                    body: "Debe ingresar mínimamente el nombre",
                    time: 5000,
                    color: STheme.color.warning,
                })
                return;
            }

            SNotification.send({
                key: "registroUsuario",
                title: "Registrando usuario",
                body: "Por favor espere...",
                type: "loading"
                // time: 5000,
                // color: STheme.color.warning,
            })
            SSocket.sendPromise({
                service: "usuario",
                version: "2.0",
                component: "usuario",
                type: "registro",
                cabecera: "usuario_app",
                estado: "cargando",
                data: {
                    ...usuarioNuevo
                },
            }).then(e => {
                SNotification.remove("registroUsuario")
                Model.usuario.Action._dispatch(e);


                const user = e.data;
                if (this._inputs["correo"]) {
                    this._inputs["nombre"].setValue(user.Nombres)
                    this._inputs["nombre"].setData(user)
                    this._inputs["apellido"].setValue(user.Apellidos)
                    this._inputs["correo"].setValue(user.Correo)
                    this._inputs["telefono"].setValue(user.Telefono)
                }
                this.handleGuardarStep2(user, rol)
                // SNavigation.goBack();
                // SNavigation.replace("/usuario/profile", { pk: e?.data?.key })
                console.log(e);
            }).catch(e => {
                SNotification.remove("registroUsuario")
                console.log(e);
            })
            return;
        } else {
            this.handleGuardarStep2(usuario, rol)
        }


    }

    handleGuardarStep2(usuario, rol) {
        if (!this.key) {
            SSocket.sendPromise({
                component: "usuario_company",
                type: "registro",
                key_usuario: Model.usuario.Action.getKey(),
                data: {
                    key_usuario: usuario.key,
                    key_company: this.key_company,
                    key_rol: rol.key
                }
            }).then(e => {
                SNotification.send({
                    title: "Nuevo usuario",
                    body: "Usuario agregado con éxito",
                    time: 5000,
                    color: STheme.color.success,
                })
                if (root.INSTANCE) {
                    root.INSTANCE.reload()
                }
                SNavigation.goBack();
            }).catch(e => {
                if (e.error == "existe") {
                    SNotification.send({
                        title: "El usuario ya se encuentra registrado.",
                        body: "No puede registrar 2 veces a un mismo usuario.",
                        time: 5000,
                        color: STheme.color.danger,
                    })
                    return;
                }
                SNotification.send({
                    title: "No pudimos agregar al usuario.",
                    body: "Ocurrio un error al agregar al usuario, intente nuevamente.",
                    time: 5000,
                    color: STheme.color.danger,
                })
            })
        } else {
            SSocket.sendPromise({
                component: "usuario_company",
                type: "editar",
                key_usuario: Model.usuario.Action.getKey(),
                data: {
                    key: this.key,
                    key_rol: rol.key
                }
            }).then(e => {
                SNotification.send({
                    title: "Editar usuario",
                    body: "Usuario editado con éxito",
                    time: 5000,
                    color: STheme.color.success,
                })
                if (root.INSTANCE) {
                    root.INSTANCE.reload()
                }
                SNavigation.goBack();
            }).catch(e => {
                SNotification.send({
                    title: "No pudimos editar al usuario.",
                    body: "Ocurrio un error al editar al usuario, intente nuevamente.",
                    time: 5000,
                    color: STheme.color.danger,
                })
            })
        }
    }
    render() {
        // const restaurante = Model.restaurante.Action.getSelect();
        if (this.key) {
            // if (!this.state.data) return <SLoad />
        }
        return <SPage  >
            <Container>
                <SHr />
                <SView col={"xs-12"}>
                    <SText font='Montserrat-ExtraBold'>{this.key_usuario ? "EDITAR USUARIO" : "AGREGAR USUARIO"}</SText>
                    <SText font={"Montserrat-Medium"} color={STheme.color.primary}>{""}</SText>
                </SView>
                <SHr h={16} />
                <SView col={"xs-12"} style={{ justifyContent: "space-between" }} row>
                    <Input
                        ref={ref => {
                            this._inputs["nombre"] = ref
                            new SThread(100, "asdasd").start(() => {
                                if (ref) ref.focus()
                            })
                        }}
                        col={"xs-5.8"}
                        inputStyle={{
                            color: !!this.key ? "#999" : "#fff"
                        }}
                        label={"Nombre *"}
                        placeholder={"Nombre"}
                        onSubmitEditing={() => {
                            if (this._inputs.apellido.focus) this._inputs.apellido.focus()
                        }}

                    />
                    {/* <SHr h={16} /> */}
                    <Input
                        ref={ref => this._inputs["apellido"] = ref}
                        col={"xs-5.8"}
                        inputStyle={{
                            color: !!this.key ? "#999" : "#fff"
                        }}
                        label={"Apellido"}
                        placeholder={"Apellido"}
                        onSubmitEditing={() => {
                            if (this._inputs.telefono.focus) this._inputs.telefono.focus()
                        }}

                    />
                </SView>
                <SHr h={16} />
                {/* <SHr h={16} /> */}
                <SView col={"xs-12"}>
                    <Input
                        ref={ref => this._inputs["telefono"] = ref}
                        col={"xs-9"}
                        inputStyle={{
                            color: !!this.key ? "#999" : "#fff"
                        }}
                        disabled={!!this.key}
                        // defaultValue={data.nombre}
                        label={"Número de teléfono"}
                        // info={"El número que ingreses debe estar registrado en la App"}
                        placeholder={"+591 0000000"}
                        onChangeText={(e) => {
                            if (e.length > 6) {
                                this.buscar_usuario(e, "telefono")
                            }
                        }}
                        onSubmitEditing={() => {
                            if (this._inputs.correo.focus) this._inputs.correo.focus()
                        }}
                    // onSubmitEditing={() => this._inputs["index"].focus()}
                    />
                    <SHr h={16} />
                    <Input
                        ref={ref => this._inputs["correo"] = ref}
                        col={"xs-12"}
                        inputStyle={{
                            color: !!this.key ? "#999" : "#fff"
                        }}
                        disabled={!!this.key}
                        // defaultValue={data.nombre}
                        label={"Dirección de correo electrónico"}
                        // info={"El correo que ingreses debe estar registrado en la App"}
                        placeholder={"email@gmail.com"}
                        onChangeText={(e) => {
                            if (e.length > 6) {
                                this.buscar_usuario(e, "correo")
                            }
                        }}
                        onSubmitEditing={() => {
                            this.hanldeGuardar();
                        }}
                    // onSubmitEditing={() => this._inputs["index"].focus()}
                    />
                    <SHr h={16} />
                    <Input
                        ref={ref => this._inputs["rol"] = ref}
                        col={"xs-12"}
                        // defaultValue={data.nombre}
                        label={"Rol"}
                        // info={""}
                        placeholder={"Selecciona un rol"}
                        onPress={this.hanlePress.bind(this)}
                    // onSubmitEditing={() => this._inputs["index"].focus()}
                    />
                </SView>
                <SHr h={64} />
                <SText padding={8} backgroundColor={STheme.color.secondary} color={STheme.color.text} borderRadius={4} onPress={() => {
                    this.hanldeGuardar()

                }}>{"Guardar"}</SText>

            </Container>
        </SPage >
    }
}
