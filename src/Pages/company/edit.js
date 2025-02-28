import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import { SNavigation, SPopup, SLanguage } from 'servisofts-component';
import Model from '../../Model';
import PBarraFooter from '../../Components/PBarraFooter';

class index extends DPA.edit {

    static FOOTER = <>
        <PBarraFooter style={{
            position: "absolute",
            bottom: 0,
        }} url={'/company'} />
    </>

    constructor(props) {
        super(props, {
            Parent: Parent,
            excludes: []
        });
    }

    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }

    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit", user_data: { key_company: this.pk } })
    }

    $inputs() {
        const inp = super.$inputs();

        inp["descripcion"].required = true;
        inp["descripcion"].required = true;
        inp["descripcion"].label = SLanguage.select({
            es: "Nombre",
            en: "Name"
        });
        inp["observacion"].label = SLanguage.select({
            es: "Detalles",
            en: "Details"
        });

        inp["email"].label = SLanguage.select({
            es: "Correo",
            en: "Email"
        });
        inp["contacto"].label = SLanguage.select({
            es: "Contacto",
            en: "Contact"
        });
        inp["telefono"].label = SLanguage.select({
            es: "Teléfono",
            en: "Phone"
        });
        inp["direccion"].label = SLanguage.select({
            es: "Dirección",
            en: "Address"
        });

        inp["email"].type = "email";
        inp["telefono"].type = "phone";
        inp["contacto"].col = "xs-7"
        inp["telefono"].col = "xs-4.5"
        return inp;
    }

    $getData() {
        return Parent.model.Action.getByKey(this.pk);
    }

    $onSubmit(data) {
        Parent.model.Action.editar({
            data: {
                ...this.data,
                ...data
            },
            key_usuario: Model.usuario.Action.getKey()
        }).then((resp) => {
            SNavigation.goBack();
        }).catch(e => {
            console.error(e);

        })
    }
}

export default connect(index);