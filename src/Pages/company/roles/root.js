import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
// import TopBar from '../../../Components/TopBar';
import { SHr, SImage, SList, SLoad, SNavigation, SNotification, SPage, SPopup, SText, STheme, SView, SLanguage, SIcon } from 'servisofts-component';
// import PBarraFooter from '../../../Components/PBarraFooter';
import Container from '../../../Components/Container';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';
import PageTitle from '../../../Components/PageTitle';
import PBarraFooter from '../../../Components/PBarraFooter';

export default class root extends Component {
    static INSTANCE;
    static TOPBAR = <>
        {/* <TopBar type={"usuario_back"} /> */}
        {/* <SView backgroundColor={"#96BE00"} height={20} col={"xs-12"}></SView> */}
    </>

    static FOOTER = <>
        {/* <PBarraFooter url={"pedido"} /> */}
    </>
    constructor(props) {
        super(props);
        root.INSTANCE = this;
        this.state = {
            roles: [],
            edit: true,
            delete: true,
            add: true
        };
        this.key_company = SNavigation.getParam("key_company");
        this.onSelect = SNavigation.getParam("onSelect", "");
    }

    reload() {
        this.componentDidMount();
    }
    componentDidMount() {

        root.INSTANCE = this;
        this.getUsuarioRestaurante();
        this.getRoles();

    }
    getRoles() {
        SSocket.sendPromise({
            service: "roles_permisos",
            component: "rol",
            type: "getAll",
        }).then(e => {
            const roles_partner = Object.values(e.data).filter(e => e.estado > 0);
            this.setState({ roles: roles_partner })
        }).catch(e => {

        })
    }


    getUsuarioRestaurante() {
        SSocket.sendPromise({
            component: "usuario_company",
            // type: "getAllStaff",
            type: "getAllStaff",
            key_company: this.key_company
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
                this.state.data = {}
                Object.values(e.data).map(o => {
                    o.usuario = resp.data[o.key_usuario]?.usuario;
                })

                // SSocket.sendPromise({
                //     service: "roles_permisos",
                //     component: "usuarioRol",
                //     type: "getAllByUsuarios",
                //     keys: keys,
                // }).then(resp => {
                //     console.log(resp)
                //     // this.state.data = {}
                //     Object.values(e.data).map(o => {
                //         const roles_del_usuario = resp.data[o.key_usuario];
                //         if (roles_del_usuario) {
                //             const roles_partner = roles_del_usuario.filter(a => a.rol.tipo == "partner");
                //             o.usuario_rol = roles_partner[0];
                //         }
                //         // o.usuario_rol = resp.data[o.key_usuario]?.usuario;
                //     })
                //     this.setState({ data: e.data })
                // }).catch(e2 => {
                //     console.error(e);
                // })

                this.setState({ data: e.data })
            }).catch(e2 => {
                console.error(e);
            })
        }).catch(e => {
            console.error(e);
        })
    }

    renderStaffTipo(staffTipo) {
        return <Text style={{
            padding: 0,
            paddingLeft: 4,
            paddingRight: 4,
            borderWidth: 1,
            height: 14,
            borderColor: staffTipo?.color ?? STheme.color.success,
            backgroundColor: (staffTipo?.color ?? STheme.color.success) + "44",
            borderRadius: 100,
            color: STheme.color.text,
            fontSize: 10,
            marginRight: 8,
        }} >{staffTipo?.descripcion}</Text>
    }
    renderItem(obj) {
        const rol = this.state.roles.find(a => a.key == obj.key_rol);
        return <SView col={"xs-12"} row center >
            <SView flex padding={8} style={{
                borderRadius: 4,
                borderBottomWidth: 1,
                // borderRightWidth:1,
                // borderLeftWidth:1,
                borderColor: STheme.color.card,
                backgroundColor: STheme.color.card,
                alignItems: "center"
            }} row>
                <SView width={40} height={40} card style={{ overflow: "hidden" }}>
                    <SImage enablePreview src={SSocket.api.root + "usuario/" + obj.key_usuario} style={{ resizeMode: "cover" }} />
                </SView>
                <SView width={8} />
                <SView flex onPress={!this.onSelect ? null : () => {
                    this.onSelect(obj);
                    SNavigation.goBack();
                }}>
                    <SHr h={2} />
                    <SView col={"xs-12"} row>
                        <SText fontSize={14} font='Montserrat-Bold'>{obj?.usuario?.Nombres} {obj?.usuario?.Apellidos}</SText>
                        <SView width={8} />
                        <Text style={{
                            padding: 0,
                            paddingLeft: 4,
                            paddingRight: 4,
                            borderWidth: 1,
                            height: 14,
                            borderColor: rol?.color ?? STheme.color.success,
                            backgroundColor: (rol?.color ?? STheme.color.success) + "44",
                            borderRadius: 100,
                            color: STheme.color.text,
                            fontSize: 10
                        }} >{rol?.descripcion ?? "Sin rol"}</Text>
                        {/* <SView width={8} /> */}
                    </SView>
                    <SHr h={2} />
                    <SText fontSize={12} color={STheme.color.text}>{obj?.usuario?.Telefono}</SText>
                    <SText fontSize={12} color={STheme.color.text}>{obj?.usuario?.Correo}</SText>
                    <SHr h={2} />
                    <SView row>
                        {/* <SView width={16} height={16} onPress={() => {
                            SNavigation.navigate("/perfil/staff_tipo", { key_usuario: obj.key_usuario });
                        }}>
                            <SIcon name='Ajustes' />
                        </SView>
                        <SView width={4} /> */}

                        {(obj?.staff_tipo ?? []).map(o => this.renderStaffTipo(o))}
                    </SView>

                </SView>
                {!this.state.edit ? null :
                    <SView center height={60}>
                        <SView width={35} height={35} center onPress={() => {
                            SNavigation.navigate("/company/roles/add", { key_company: this.key_company, key_usuario: obj.key_usuario, key: obj.key })
                        }} >
                            {/* <SImage src={require("../../../Assets/img/EDITAR2.png")} /> */}
                            <SIcon name='editar' height={20} width={20} fill={STheme.color.gray} />
                            <SText fontSize={9} color={STheme.color.gray} language={{
                                en: "Edit",
                                es: "Editar"
                            }} />
                        </SView>
                    </SView>
                }
                <SView width={4} />
                <SView center height={60}>
                    <SView width={35} height={35} center onPress={() => {
                        SNavigation.navigate("/perfil/staff_tipo", { key_usuario: obj.key_usuario });
                    }} >
                        <SIcon name='posicion' height={20} width={20} fill={STheme.color.gray} />
                        <SText fontSize={9} color={STheme.color.gray} language={{
                            en: "Position",
                            es: "Posición"
                        }} />
                    </SView>
                </SView>
            </SView>
            {
                !this.state.delete ? null :
                    <SView width={40} center height={30} onPress={() => {
                        SPopup.confirm({
                            title: "Seguro de eliminar?",
                            onPress: () => {
                                SSocket.sendPromise({
                                    component: "usuario_company",
                                    type: "editar",
                                    key_usuario: Model.usuario.Action.getKey(),
                                    data: {
                                        key: obj.key,
                                        estado: 0,
                                    }
                                }).then(e => {
                                    this.setState((prevState) => {
                                        let newState = { ...prevState }
                                        delete newState.data[obj.key]
                                        return newState;
                                    })
                                    SNotification.send({
                                        title: "Usuario eliminado",
                                        body: "El usuario fue eliminado con exito.",
                                        time: 5000,
                                        color: STheme.color.success,
                                    })
                                }).catch(e => {
                                    SNotification.send({
                                        title: "No pudimos eliminar el usuario.",
                                        body: "Ocurrio un error al eliminar el usuario, intente nuevamente.",
                                        time: 5000,
                                        color: STheme.color.danger,
                                    })
                                })
                            }
                        })
                        // SNavigation.navigate("/roles/add", {key_company: this.key_company, key_usuario: obj.key_usuario, })
                    }} padding={4}>
                        <SImage src={require("../../../Assets/img/borrar.png")} />
                    </SView>
            }
        </SView >
    }
    renderList() {
        if (!this.state.data) return <SLoad />
        return <FlatList
            style={{
                width: "100%"
            }}
            contentContainerStyle={{
                width: "100%"
            }}
            ItemSeparatorComponent={() => <SHr h={8} />}
            data={Object.values(this.state.data)}
            renderItem={({ item }) => this.renderItem(item)}
        />
    }
    render() {
        // const restaurante = Model.restaurante.Action.getSelect();
        return <SPage footer={<PBarraFooter url={'/company'} />} >
            <Container>
                <SHr />
                {/* <PageTitle title='ADMINISTRADOR DE USUARIOS' /> */}
                <SHr />
                <SView col={"xs-12"} row>
                    <SView flex >
                        <SText font={"Montserrat-Medium"} language={{ en: "Users", es: "Usuarios" }} />
                        {/* <SText fontSize={10} color={STheme.color.gray}>{"Personal que tiene acceso"}</SText> */}
                    </SView>
                    {this.state.add ? <SView width={130} height={26} backgroundColor={STheme.color.card} borderRadius={4} center onPress={() => {
                        SNavigation.navigate("/company/roles/add", { key_company: this.key_company })
                    }}>
                        <SText color={STheme.color.text} fontSize={12} language={{
                            en: "+ Add user",
                            es: "+ Agregar usuario"
                        }} />
                    </SView> : null}

                </SView>
                <SHr h={32} />
                {this.renderList()}
            </Container>
            <SHr height={90} />
        </SPage>
    }
}
