import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from ".."
import { SHr, SIcon, SImage, SList, SNavigation, SNotification, SPopup, SText, STheme, SView } from 'servisofts-component';
import Model from '../../../Model';
import SSocket from 'servisofts-socket';
import Eventos from '../eventos';

class index extends DPA.profile {
    constructor(props) {
        super(props, { title: "Client", Parent: Parent, excludes: ["key", "key_servicio", "key_usuario", "fecha_on", "key_company", "estado", "latitude", "longitude"] });
    }
    $allowEdit() {
        this.data = this.$getData();
        if (!this.data) return "cargando"
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit", user_data: { key_company: this.data.key_company } })
    }
    $allowDelete() {
        this.data = this.$getData();
        if (!this.data) return "cargando"
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "delete", user_data: { key_company: this.data.key_company } })
    }
    $allowAccess() {
        this.data = this.$getData();
        if (!this.data) return "cargando"
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver", user_data: { key_company: this.data.key_company } })
    }
    $getData() {
        // this.usuarios = Model.usuario.Action.getAll();
        return Parent.model.Action.getByKey(this.pk);
    }
    onEdit() {
        SNavigation.navigate("/cliente/add", { pk: this.pk })
    }
    componentDidMount() {
        // this.data = this.$getData();


        SSocket.sendPromise({
            component: "evento",
            type: "getEstadoEventos",
            key_cliente: this.pk,
        }).then(e => {
            console.log(e);
        }).catch(e => {
            console.error(e);
        })
    }

    $footer() {
        return <SView col={"xs-12"}>
            <SHr />
            <SView row col={"xs-12"} center>
                <SText language={{ en: "Events", es: "Eventos" }} fontSize={16} bold flex />
                <SView width={30} height={30} onPress={() => {
                    SNavigation.navigate("/evento/registro", { key_cliente: this.data.key, key_company: this.data.key_company })
                }}>
                    <SIcon name='Add' />
                </SView>
            </SView>
            <SHr />
            <Eventos key_cliente={this.pk} />
        </SView>
    }
}
export default connect(index);