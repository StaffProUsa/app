import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from ".."
import { SHr, SIcon, SImage, SList, SNavigation, SNotification, SPopup, SText, STheme, SView } from 'servisofts-component';
import Model from '../../../Model';
import SSocket from 'servisofts-socket';

class index extends DPA.profile {
    usuarios = {}
    constructor(props) {
        super(props, { Parent: Parent, excludes: ["key", "key_servicio", "estado"] });
    }
    $allowEdit() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit" })
    }
    $allowDelete() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "delete" })
    }
    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver" })
    }
    $getData() {
        this.usuarios = Model.usuario.Action.getAll();
        return Parent.model.Action.getByKey(this.pk);
    }


    componentDidMount() {
        SSocket.sendPromise({
            component: "staff_usuario",
            type: "getAll",
            key_staff: this.pk,
            key_usuario: Model.usuario.Action.getKey(),
        }).then(e => {
            this.setState({ staf_usuario: e.data })
            console.log(e);
        }).catch(e => {
            console.error(e);
        })
    }
    handlePostular() {
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
            key_staff: this.pk,
        }).then(e => {
            SNotification.send({
                key: "staff_usuario-registro",
                title: "Successfully applied.",
                body: "Your application has been successfully registered.",
                color: STheme.color.success,
                time: 5000,
            })
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
    handleInvitar() {
        SNavigation.navigate("/usuario", {
            onSelect: (e) => {
                const key_usuario_invitado = e.key
                SNotification.send({
                    key: "staff_usuario-invitar",
                    title: "Applying...",
                    body: "Please wait while the application is being processed.",
                    type: "loading"
                })
                SSocket.sendPromise({
                    component: "staff_usuario",
                    type: "invitar",
                    key_usuario: Model.usuario.Action.getKey(),
                    key_usuario_invitado: key_usuario_invitado,
                    key_staff: this.pk,
                }).then(e => {
                    SNotification.send({
                        key: "staff_usuario-invitar",
                        title: "Successfully applied.",
                        body: "Your application has been successfully registered.",
                        color: STheme.color.success,
                        time: 5000,
                    })
                    console.log(e);
                }).catch(e => {
                    SNotification.send({
                        key: "staff_usuario-invitar",
                        title: "Application error.",
                        body: e.error ?? "Unknown error.",
                        color: STheme.color.danger,
                        time: 5000,
                    })
                    console.error(e);
                })
            }
        })
        return;

    }
    handleAprobar = (post) => {
        SPopup.confirm({
            title: "Aprobar postulacion",
            message: "Aprobar a " + post.key,
            onPress: () => {
                SNotification.send({
                    key: "staff_usuario-aprobar",
                    title: "Applying...",
                    body: "Please wait.",
                    type: "loading"
                })
                SSocket.sendPromise({
                    component: "staff_usuario",
                    type: "aprobar",
                    key_usuario: Model.usuario.Action.getKey(),
                    key_staff_usuario: post.key
                }).then(e => {
                    SNotification.send({
                        key: "staff_usuario-aprobar",
                        title: "Successfully applied.",
                        body: "Successfully registered.",
                        color: STheme.color.success,
                        time: 5000,
                    })
                    if (this.state?.staf_usuario[e.data.key]) {
                        this.state.staf_usuario[e.data.key] = {
                            ...this.state.staf_usuario[e.data.key],
                            ...e.data
                        }
                        this.setState({ ...this.state })
                    }
                    console.log(e);
                }).catch(e => {
                    SNotification.send({
                        key: "staff_usuario-aprobar",
                        title: "Error.",
                        body: e.error ?? "Unknown error.",
                        color: STheme.color.danger,
                        time: 5000,
                    })
                })
            },
            onClose: () => {

            }
        })
    }
    handleDesAprobar = (post) => {
        SPopup.confirm({
            title: "Desaprobar postulacion",
            message: "Desaprobar a " + post.key,
            onPress: () => {
                SNotification.send({
                    key: "staff_usuario-desaprobar",
                    title: "Applying...",
                    body: "Please wait.",
                    type: "loading"
                })
                SSocket.sendPromise({
                    component: "staff_usuario",
                    type: "desaprobar",
                    key_usuario: Model.usuario.Action.getKey(),
                    key_staff_usuario: post.key
                }).then(e => {
                    SNotification.send({
                        key: "staff_usuario-desaprobar",
                        title: "Successfully applied.",
                        body: "Successfully registered.",
                        color: STheme.color.success,
                        time: 5000,
                    })
                    if (this.state?.staf_usuario[e.data.key]) {
                        this.state.staf_usuario[e.data.key] = {
                            ...this.state.staf_usuario[e.data.key],
                            ...e.data
                        }
                        this.setState({ ...this.state })
                    }
                    console.log(e);
                }).catch(e => {
                    SNotification.send({
                        key: "staff_usuario-desaprobar",
                        title: "Error.",
                        body: e.error ?? "Unknown error.",
                        color: STheme.color.danger,
                        time: 5000,
                    })
                })
            },
            onClose: () => {

            }
        })
    }
    handleAsignarJefe = (post) => {
        SNavigation.navigate("/usuario", {
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
                    key_usuario_atiende: usuario.key,
                }).then(e => {
                    SNotification.send({
                        key: "staff_usuario-asingJefe",
                        title: "Successfully applied.",
                        body: "Successfully registered.",
                        color: STheme.color.success,
                        time: 5000,
                    })
                    if (this.state?.staf_usuario[e.data.key]) {
                        this.state.staf_usuario[e.data.key] = {
                            ...this.state.staf_usuario[e.data.key],
                            ...e.data
                        }
                        this.setState({ ...this.state })
                    }
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
    $footer() {

        return <SView col={"xs-12"}>
            <SHr h={16} />
            <SText card padding={8} onPress={this.handleInvitar.bind(this)}>{"INVITAR"}</SText>
            <SHr h={16} />
            <SText card padding={8} onPress={this.handlePostular.bind(this)}>{"POSTULAR"}</SText>
            <SHr h={16} />
            <SText fontSize={18} bold>{"Postulaciones (staff_usuario)"}</SText>
            <SHr h={16} />
            <SList
                data={this.state.staf_usuario ?? {}}
                space={16}
                render={(post) => {
                    const usuario = this?.usuarios[post.key_usuario]
                    const usuario_atiende = this?.usuarios[post?.key_usuario_atiende]
                    return <SView card col={"xs-12"} padding={8} row
                        onPress={post.key_usuario_aprueba ? null : this.handleAprobar.bind(this, post)}>
                        <SView width={40} height={40} card style={{
                            overflow: "hidden"
                        }}>
                            <SImage src={SSocket.api.root + "usuario/" + post.key_usuario} />
                        </SView>
                        <SView width={8} />
                        <SView flex >
                            <SText>{usuario?.Nombres} {usuario?.Apellidos}</SText>
                            {post.key_usuario_aprueba ? <>
                                <SText fontSize={12} color={STheme.color.success}>{post.fecha_aprobacion}</SText>
                                <SHr />
                                <SText bold card padding={4} onPress={this.handleAsignarJefe.bind(this, post)}>{"Asignar jefe"}</SText>
                                <SHr />
                                <SText bold card padding={4} onPress={this.handleDesAprobar.bind(this, post)}>{"DES APROBAR"}</SText>
                            </>
                                : null}
                            <SHr />
                            {post.key_usuario_atiende ? <>
                                <SText>{"JEFE"}</SText>
                                <SText >{usuario_atiende?.Nombres} {usuario_atiende?.Apellidos}</SText>
                                <SText fontSize={12}>{post.fecha_atiende}</SText>
                            </>
                                : null}

                        </SView>
                    </SView>
                }
                }
            />
        </SView >
    }


}
export default connect(index);