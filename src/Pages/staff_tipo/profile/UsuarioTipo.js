import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SIcon, SImage, SList, SNavigation, SNotification, SPopup, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import usuario from '../../usuario';
import Model from '../../../Model';

export default class UsuarioTipo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuarios: {}
        };
    }

    componentDidMount() {
        SSocket.sendPromise({
            component: "staff_tipo_favorito",
            type: "getAll",
            key_staff_tipo: this.props.key_staff_tipo
        }).then(e => {
            let keys = [...new Set(Object.values(e.data).map(a => a.key_usuario).filter(key => key !== null))];
            keys = keys.filter(e => !this.state?.usuarios[e]);
            if (keys.length <= 0) return;
            SSocket.sendPromise({
                version: "2.0",
                service: "usuario",
                component: "usuario",
                type: "getAllKeys",
                keys: keys,
            }).then(resp => {
                if (!this.state?.usuarios) this.state.usuarios = {};
                this.state.usuarios = {
                    ...this.state.usuarios,
                    ...resp.data
                }
                this.setState({ usuarios: this.state.usuarios, data: e.data })
            }).catch(e2 => {
                SPopup.alert(e2.error)
            })
        }).catch(e => {
            console.error(e);
        })
    }

    $item(obj) {
        const usuario = this.state?.usuarios[obj.key_usuario]?.usuario;
        return <SView col={"xs-12"}
            padding={8}
            row
            // onPress={super.$onSelect.bind(this, obj)}
            style={{
                borderBottomWidth: 1,
                borderColor: STheme.color.card
            }}>
            <SView width={40} height={40} style={{
                borderRadius: 4,
                overflow: 'hidden',
                backgroundColor: STheme.color.card
            }}>
                <SImage src={SSocket.api.root + "usuario/" + obj.key_usuario} />
            </SView>
            <SView width={8} />
            <SView flex style={{ justifyContent: "center" }}>
                <SText bold fontSize={16}>{usuario?.Nombres} {usuario?.Apellidos}</SText>
                <SText color={STheme.color.lightGray}>{usuario?.Telefono}</SText>
            </SView>
            <SView width={30} height={30} style={{
                borderRadius: 4,
                overflow: 'hidden',
                backgroundColor: STheme.color.card
            }} onPress={() => {
                SPopup.confirm({
                    title: "Seguro de eliminar",
                    message: "Confimar que descea eliminar",
                    onPress: () => {
                        SSocket.sendPromise({
                            component: "staff_tipo_favorito",
                            type: "editar",
                            data: {
                                ...obj,
                                estado: 0,
                            },
                            key_usuario: Model.usuario.Action.getKey(),
                        }).then(e => {
                            if (this.state.data[e.data.key]) {
                                delete this.state.data[e.data.key];
                                this.setState({ ...this.state })
                            }
                        }).catch(e => {
                            // delete newSelectedItems[key];
                            SNotification.send({
                                title: "Error",
                                body: e.error ?? "Ocurrio error",
                                time:5000,
                            })
                        })
                    }
                })

            }}>
                <SIcon name={"Delete"} />
            </SView>
        </SView>
    }
    render() {
        const { key_staff_tipo } = this.props;
        return (
            <SView col={"xs-12"}>
                <SText width={200} center padding={16} card
                    language={{
                        en: "Add user to type",
                        es: "Agregar usuario al tipo"
                    }}
                    onPress={() => {
                        SNavigation.navigate("/company/roles", {
                            key_company: this.props.key_company,
                            onSelect: (usuario_company) => {
                                SSocket.sendPromise({
                                    component: "staff_tipo_favorito",
                                    type: "registro",
                                    data: {
                                        key_staff_tipo: key_staff_tipo,
                                        key_usuario: usuario_company.key_usuario,
                                    },
                                    key_usuario: Model.usuario.Action.getKey(),

                                }).then(e => {
                                    this.state.data[e.data.key] = e.data;
                                    this.setState({ ...this.state })
                                    this.componentDidMount();
                                    console.log(e);
                                }).catch(e => {
                                    SNotification.send({
                                        title: "Error",
                                        body: e?.error ?? "Error desconocido",
                                        color:STheme.color.danger,
                                        time:5000,
                                    })
                                    console.error(e);
                                })
                                console.log(usuario)
                            }
                        })
                    }} />
                <SHr />
                <SText
                    fontSize={16}
                    bold
                    language={{
                        en: "User list",
                        es: "Lista de usuarios"
                    }} />
                <SHr />
                <SList
                    buscador
                    data={this.state.data}
                    render={this.$item.bind(this)} />
            </SView>
        );
    }
}
