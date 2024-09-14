import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
// import TopBar from '../../../Components/TopBar';
import { SHr, SList, SLoad, SNavigation, SNotification, SPage, SPopup, SText, STheme, SThread, SView } from 'servisofts-component';
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

    getRoles() {
        SSocket.sendPromise({
            service: "roles_permisos",
            component: "rol",
            type: "getAll",
        }).then(e => {
            let roles_partner = Object.values(e.data).filter(e => e.estado > 0).sort((a, b) => a.index > b.index ? 1 : -1);
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
                this._inputs["nombre"].setValue(usuario.Nombres + " " + usuario.Apellidos)
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
                        SNotification.send({
                            title: "Buscando usuario",
                            body: "Se encontraron mas de un usuario con " + val,
                            time: 5000,
                            color: STheme.color.warning,
                        })
                    }
                    // if (arrResultados.length > 1) {
                    //     SNotification.send({
                    //         title: "Buscando usuario",
                    //         body: "Se encontraron mas de un usuario con " + val,
                    //         time: 5000,
                    //         color: STheme.color.warning,
                    //     })
                    //     return;
                    // } else if (arrResultados.length == 1) {
                    //     const keyUsuarioEncontrado = arrResultados[0];
                    //     const usuarioEncontrado = e.data[keyUsuarioEncontrado];
                    //     usuarioEncontrado.key = keyUsuarioEncontrado;
                    //     if (this._inputs["correo"]) {
                    //         this._inputs["nombre"].setValue(usuarioEncontrado.Nombres + " " + usuarioEncontrado.Apellidos)
                    //         this._inputs["nombre"].setData(usuarioEncontrado)

                    //         this._inputs["correo"].setValue(usuarioEncontrado.Correo)
                    //         this._inputs["telefono"].setValue(usuarioEncontrado.Telefono)
                    //     }
                    //     return;
                    // }
                }
                // SNotification.send({
                //     title: "Buscando usuario",
                //     body: "No se encontro ningun usuario con " + val,
                //     time: 5000,
                //     color: STheme.color.danger,
                // })
            }).catch(e => {
                SNotification.remove(key_notification)
                SNotification.send({
                    title: "Buscando usuario",
                    body: "Ocurrio un error al buscar el usuario.",
                    time: 5000,
                    color: STheme.color.danger,
                })
                console.error(e)
            })


        })
    }

    hanldeGuardar() {
        const usuario = this._inputs["nombre"].getData() ?? {};
        if (!usuario.key) {
            SNotification.send({
                title: "Datos incompletos.",
                body: "Debe seleccionar un usuario",
                time: 5000,
                color: STheme.color.warning,
            })
            return;
        }
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
                    body: "Usuario agregado con exito",
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
                    body: "Usuario editado con exito",
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
                <Input
                    ref={ref => this._inputs["telefono"] = ref}
                    col={"xs-12"}
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
                <SHr h={64} />
                <SText padding={8} backgroundColor={STheme.color.secondary} color={STheme.color.text} borderRadius={4} onPress={() => {
                    this.hanldeGuardar()

                }}>{"Guardar"}</SText>

            </Container>
        </SPage >
    }
}
