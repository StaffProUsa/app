import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import { SForm, SLanguage, SNavigation, SPopup, SThread } from 'servisofts-component';
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
            excludes: ["key", "fecha_on", "key_usuario", "estado", "key_servicio"]
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
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "new" })
    }

    $inputs() {
        const inp = super.$inputs();

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



        // inp["email"].required = true;
        // inp["contacto"].required = true;
        // inp["telefono"].required = true;


        inp["email"].type = "email";
        inp["telefono"].type = "phone";
        inp["contacto"].col = "xs-7"
        inp["telefono"].col = "xs-4.5"
        //inp["telefono"].value = "+1 ";
        inp["telefono"].defaultValue = "+1 ";
        return inp;
    }
    $onSubmit(data) {
        //data.key_empresa = Model.empresa.Action.getSelect()?.key;
        Parent.model.Action.registro({ data, key_usuario: Model.usuario.Action.getKey() }).then((resp) => {
            this.$submitFile(resp.data.key);
            SNavigation.replace("/company/profile", { pk: resp.data.key })
            new SThread(1000, "sadasd", false).start(() => {
                SNavigation.navigate("/company/profile/staff_tipo", { pk: resp.data.key })
            })
            // SNavigation.goBack();
        }).catch(e => {
            console.error(e);

        })
    }

}

export default connect(index);