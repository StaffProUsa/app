import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from ".."
import { SHr, SIcon, SImage, SLanguage, SList, SNavigation, SNotification, SPopup, SText, STheme, SView } from 'servisofts-component';
import Model from '../../../Model';
import SSocket from 'servisofts-socket';
import Eventos from '../eventos';
import PBarraFooter from '../../../Components/PBarraFooter';
import { MenuButtom, MenuPages } from 'servisofts-rn-roles_permisos';

class index extends DPA.profile {
    static FOOTER = <>
        <PBarraFooter style={{
            position: "absolute",
            bottom: 0,
        }} url={'/company'} />
    </>
    constructor(props) {
        super(props, {
            title: "Client",
            Parent: Parent,
            itemType:"2",
            excludes: ["key", "key_servicio", "key_usuario", "fecha_on", "key_company", "estado", "latitude", "longitude"]
        });
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
            <MenuPages path='/cliente/profile' permiso='ver'>
                <MenuButtom
                    icon={<SIcon name='Excel' />}
                    label={SLanguage.select({
                        en: "Attendace Report",
                        es: "Reporte de horas trabajadas"
                    })} url='/cliente/profile/hours' params={{ pk: this.pk }} />
            </MenuPages>
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