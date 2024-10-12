import React from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import Model from '../../Model';
import { SImage, SNavigation, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import PBarraFooter from '../../Components/PBarraFooter';
import Roles from '../../Roles';

class index extends DPA.list {
    static FOOTER = <>
        <PBarraFooter style={{
            position: "absolute",
            bottom: 0,
        }} url={'/company'} />
    </>
    constructor(props) {
        super(props, {
            Parent: Parent,
            excludes: ["key", "fecha_on", "key_usuario", "estado"],
            // params: ["key_evento"],
            onRefresh: (resolve) => {
                Parent.model.Action.CLEAR();
                if (resolve) resolve();

            }
        });
    }
    $allowNew() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "new", });
    }
    $allowTable() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "table" });
    }
    $allowAccess() {
        // return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver_todas" });
        return true;
    }
    $filter(data) {
        // const todas = Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver_todas", loading: "cargando" });
        // if (todas == "cargando") return false;
        // if (todas) return data.estado != 0
        return data.estado != 0
    }


    // $onSelect(data) {
    //     SNavigation.navigate("/company/profile", { pk: data.pk })
    // }
    $item(obj) {
        return <SView col={"xs-12"} padding={8} row onPress={this.$onSelect.bind(this, obj)} style={{
            borderBottomWidth: 1,
            borderColor: STheme.color.card
        }}>
            <SView width={40} height={40} style={{
                borderRadius: 4,
                overflow: 'hidden',
            }}>
                <SImage src={SSocket.api.root + "company/" + obj.key} />
            </SView>
            <SView width={8} />
            <SView flex>
                <SText bold fontSize={16}>{obj.descripcion}</SText>
                <SText fontSize={15} color={STheme.color.gray}>{obj.observacion}</SText>
            </SView>
        </SView>
    }
    $order() {
        return [{ key: "descripcion", order: "asc", peso: 1 }]
    }
    $getData() {
        const todas = Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "ver_todas", loading: "cargando" });
        if (todas == "cargando") return null;
        return Parent.model.Action.getAll({ ver_mias: !todas });
    }

    // $footer() {
    //     return <PBarraFooter style={{
    //         position: "absolute",
    //         bottom: 0,
    //     }} url={'/company'} />
    // }
}
export default connect(index);