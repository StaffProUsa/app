import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import { SNavigation, SPopup } from 'servisofts-component';
import Model from '../../Model';
// import DatosDocumentosEditar from './Components/DatosDocumentosEditar';
import CryptoJS from 'crypto-js';
class index extends DPA.edit {
    constructor(props) {
        super(props, {
            Parent: Parent,
            excludes: []
        });
    }
    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit" })
    }
    $getData() {
        return Parent.model.Action.getByKey(this.pk);
    }
    $inputs() {
        var inputs = super.$inputs();
        inputs["Password"].type = "password"
        inputs["Correo"].type = "email"

        // inputs["Telefono"].type = "phone"
        return inputs;
    }
    $onSubmit(data) {
        data["Password"] = CryptoJS.MD5(data["Password"]).toString();
        Parent.model.Action.editar({
            data: {
                ...this.data,
                ...data
            },
            key_usuario: ""
        }).then((resp) => {
            SNavigation.goBack();
            // this.presolve({
            //     key_usuario: this.pk, callback: () => {
            //         SNavigation.replace("/usuario/profile", { pk: this.pk })
            //     }
            // })


        }).catch(e => {
            console.error(e);
        })
    }

    $submitName() {
        return "Editar"
    }
    $footer() {
        // return <DatosDocumentosEditar key_usuario={this.pk} onSubmit={() => {
        //     return new Promise((resolve, reject) => {
        //         this.presolve = resolve;
        //         this.form.submit();
        //         // resolve("KEY_USUARIO");
        //     })
        // }} />
    }
}

export default connect(index);