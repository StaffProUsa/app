import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import { SNavigation, SPopup } from 'servisofts-component';
import Model from '../../Model';
import PBarraFooter from '../../Components/PBarraFooter';

class index extends DPA.new {
      static FOOTER = <>
            <PBarraFooter style={{
                position: "absolute",
                bottom: 0,
            }} url={'/company'} />
        </>
    constructor(props) {
        super(props, {
            Parent: Parent,
            params: ["onSelect?"],
            excludes: ["key", "fecha_on", "key_usuario", "estado", "key_servicio", "key_company"]
        });
    }
    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "new",user_data: { key_company: this.$params.key_company }  })
    }
    $onSubmit(data) {
        data.key_company = this.$params?.key_company
        //data.key_empresa = Model.empresa.Action.getSelect()?.key;
        Parent.model.Action.registro({ data, key_usuario: Model.usuario.Action.getKey() }).then((resp) => {
            this.$submitFile(resp.data.key);
            SNavigation.goBack();
        }).catch(e => {
            console.error(e);

        })
    }
}

export default connect(index);