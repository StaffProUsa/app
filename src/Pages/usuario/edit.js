import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import { SNavigation, SPopup, STheme, SView } from 'servisofts-component';
import Model from '../../Model';
// import DatosDocumentosEditar from './Components/DatosDocumentosEditar';
import CryptoJS from 'crypto-js';
import InputSelect from '../../Components/NuevoInputs/InputSelect';
import InputFloat from '../../Components/NuevoInputs/InputFloat';
class index extends DPA.edit {
    constructor(props) {
        super(props, {
            Parent: Parent,
            excludes: []
        });
        this.key_company = SNavigation.getParam("key_company")
    }
    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit", user_data: { key_company: this.key_company } })
    }
    $getData() {
        return Parent.model.Action.getByKey(this.pk);
    }
    $inputs() {
        var inputs = super.$inputs();
        inputs["Password"].type = "password"
        inputs["Correo"].type = "email"
        inputs["Telefono"].type = "phone"
        inputs["papeles"].type = "checkBox"

        inputs["estado_civil"].onPress = (e) => {
            InputFloat.open({
                e: e,
                height: 180,
                width: 150,
                style: {
                    backgroundColor: STheme.color.background
                },
                render: () => {
                    return <SView col={"xs-12"} flex card>
                        <InputSelect
                            data={["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED", "OTHER"]}
                            onChange={val => {
                                this.form.setValues({ "estado_civil": val })
                            }}
                            ITEM_HEIGHT={30} />
                    </SView>
                }
            })
        }
        inputs["nivel_ingles"].onPress = (e) => {
            InputFloat.open({
                e: e,
                height: 180,
                width: 150,
                style: {
                    backgroundColor: STheme.color.background
                },
                render: () => {
                    return <SView col={"xs-12"} flex card>
                        <InputSelect
                            data={["NONE", "BASIC", "MEDIUM", "ADVANCED"]}
                            onChange={val => {
                                this.form.setValues({ "nivel_ingles": val })
                            }}
                            ITEM_HEIGHT={30} />
                    </SView>
                }
            })
        }
        return inputs;
    }
    $onSubmit(data) {

        if (data["Password"] != this.data["Password"]) data["Password"] = CryptoJS.MD5(data["Password"]).toString();


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
        return "SAVE"
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