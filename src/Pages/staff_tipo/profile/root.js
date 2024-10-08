import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from ".."
import { SHr, SIcon, SNavigation, SText, SView } from 'servisofts-component';
import Model from '../../../Model';
import { MenuButtom, MenuPages } from 'servisofts-rn-roles_permisos';
import UsuarioTipo from './UsuarioTipo';
import SSocket from 'servisofts-socket';

class index extends DPA.profile {
    constructor(props) {
        super(props, { Parent: Parent, excludes: ["key", "key_servicio", "key_usuario", "key_company", "estado"] });
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
        return Parent.model.Action.getByKey(this.pk);
    }

    $footer() {
        return <SView col={"xs-12"}>
            <SHr />
            <UsuarioTipo key_staff_tipo={this.pk} key_company={this.data?.key_company} />
        </SView>
    }

}
export default connect(index);