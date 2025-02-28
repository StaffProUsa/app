import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from "."
import { SNavigation, SPopup } from 'servisofts-component';
import Model from '../../Model';
import PBarraFooter from '../../Components/PBarraFooter';

class index extends DPA.delete {
    static FOOTER = <>
        <PBarraFooter style={{
            position: "absolute",
            bottom: 0,
        }} url={'/company'} />
    </>
    constructor(props) {
        super(props, { Parent: Parent, title: "Delete client" });
    }
    componentDidMount() {
        this.data = this.$getData();
    }
    $allowAccess() {
        this.data = this.$getData();
        if (!this.data) return "cargando";
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "delete", user_data: { key_company: this.data.key_company } })
    }
    $onDelete() {
        this.data.estado = 0;
        Parent.model.Action.editar({ data: this.data }).then((resp) => {
            SNavigation.goBack();
            SNavigation.goBack();
        }).catch(e => {
            console.error(e);

        })
    }

    $getData() {
        return Parent.model.Action.getByKey(this.pk);
    }
}
export default connect(index);