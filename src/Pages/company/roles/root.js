import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
// import TopBar from '../../../Components/TopBar';
import { SHr, SImage, SList, SLoad, SNavigation, SNotification, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
// import PBarraFooter from '../../../Components/PBarraFooter';
import Container from '../../../Components/Container';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';
import PageTitle from '../../../Components/PageTitle';

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
            type: "getAll",
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

    renderItem(obj) {
        const rol = this.state.roles.find(a => a.key == obj.key_rol);
        return <SView col={"xs-12"} row center>
            <SView flex padding={8} style={{
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#CCC"
            }} row>
                <SView flex>
                    <SText fontSize={12} font='Montserrat-Bold'>{obj?.usuario?.Nombres} {obj?.usuario?.Apellidos}</SText>
                    <SText fontSize={12}>{rol?.descripcion ?? "Sin rol"}</SText>
                    <SText fontSize={12} color={STheme.color.gray}>{obj?.usuario?.Telefono}</SText>
                    <SText fontSize={12} color={STheme.color.gray}>{obj?.usuario?.Correo}</SText>
                </SView>
                {!this.state.edit ? null :
                    <SView center height={60}>
                        <SView width={30} height={30} onPress={() => {
                            SNavigation.navigate("/company/roles/add", { key_company: this.key_company, key_usuario: obj.key_usuario, key: obj.key })
                        }} >
                            <SImage src={require("../../../Assets/img/EDITAR2.png")} />
                        </SView>
                    </SView>
                }
            </SView>
            {!this.state.delete ? null :
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
        return <SPage  >
            <Container>
                <SHr />
                <PageTitle title='ADMINISTRADOR DE USUARIOS' />
                <SHr />
                <SView col={"xs-12"} row>
                    <SView flex >
                        <SText font={"Montserrat-Medium"}>{"Usuarios"}</SText>
                        <SText fontSize={10} color={STheme.color.gray}>{"Personal que tiene acceso / control de tu comercio"}</SText>
                    </SView>
                    {this.state.add ? <SView width={130} height={26} backgroundColor={STheme.color.card} borderRadius={8} center onPress={() => {
                        SNavigation.navigate("/company/roles/add", { key_company: this.key_company })
                    }}>
                        <SText color={STheme.color.text} fontSize={12} >{"+ Agregar usuario"}</SText>
                    </SView> : null}

                </SView>
                <SHr h={32} />
                {this.renderList()}
            </Container>
        </SPage>
    }
}