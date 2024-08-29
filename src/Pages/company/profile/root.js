import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from ".."
import { SHr, SIcon, SImage, SList, SNavigation, SNotification, SPopup, SText, STheme, SView } from 'servisofts-component';
import Model from '../../../Model';
import SSocket from 'servisofts-socket';
import { MenuButtom, MenuPages } from 'servisofts-rn-roles_permisos';

class index extends DPA.profile {
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

    $footer() {
        return <MenuPages path='/company/' permiso='ver'>
            <MenuButtom label='Ubicaciones' url='/ubicacion' params={{ key_company: this.pk }} icon={<SIcon name='Ajustes' />} />
            <MenuButtom label='Staff Tipo' url='/staff_tipo' params={{ key_company: this.pk }} icon={<SIcon name='Ajustes' />} />
            <MenuButtom label='Usuarios' url='/company/roles' params={{ key_company: this.pk }} icon={<SIcon name='Ajustes' />} />
        </MenuPages>
    }

}
export default connect(index);