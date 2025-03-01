import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import { SForm, SMath, SNavigation, SPopup, STheme, SView } from 'servisofts-component';
import Model from '../../Model';
// import DatosDocumentosEditar from './Components/DatosDocumentosEditar';
import CryptoJS from 'crypto-js';
import InputSelect from '../../Components/NuevoInputs/InputSelect';
import InputFloat from '../../Components/NuevoInputs/InputFloat';
import SSocket from 'servisofts-socket';
class index extends DPA.edit {
    constructor(props) {
        super(props, {
            Parent: Parent,
            excludes: []
        });
        this.key_company = SNavigation.getParam("key_company")
    }

    componentDidMount() {
        if (this.key_company) {
            SSocket.sendPromise({
                component: "usuario_company",
                type: "get",
                key_company: this.key_company,
                key_usuario: this.pk
            }).then(e => {
                const form: SForm = this.form
                // this.
                // form.setValues({
                //     employee_number: e.data.employee_number ?? ""
                // })
                // this.state.usuario_company = e.data;
                this.setState({ usuario_company: e.data })
                console.log(e);
            }).catch(e => {
                console.log(e);
            })
        }

    }
    $allowAccess() {
        return Model.usuarioPage.Action.getPermiso({ url: Parent.path, permiso: "edit", user_data: { key_company: this.key_company } })
    }
    $getData() {
        const data = Parent.model.Action.getByKey(this.pk);
        if(!data) return null;
        if (this.key_company) {
            if (!this.state.usuario_company) return null;
            data.employee_number = this.state?.usuario_company?.employee_number ?? ""
            data.salario_hora =this.state?.usuario_company?.salario_hora ?? ""
        }
        return data;
    }
    $inputs() {
        var inputs = super.$inputs();
        inputs["Password"].type = "password"
        inputs["Correo"].type = "email"
        inputs["Telefono"].type = "phone"
        inputs["papeles"].type = "checkBox"
        // inputs["salario_hora"].type = "money"

        // inputs["salario_hora"].setValues = SMath.formatMoney(this.state?.usuario_company?.salario_hora) ?? ""

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

        if (this.key_company) {
            // const employee_number = data.employee_number;
            this.state.usuario_company.employee_number = data.employee_number;
            delete data.employee_number;

            this.state.usuario_company.salario_hora = data.salario_hora;
            delete data.salario_hora;

        }
        Parent.model.Action.editar({
            data: {
                ...this.data,
                ...data
            },
            key_usuario: ""
        }).then((resp) => {

            SSocket.sendPromise({
                component: "usuario_company",
                type: "editar",
                data: this.state.usuario_company
            }).then(e => {
                console.log(e);
            }).catch(e => {
                console.error(e);
            })

            SNavigation.goBack();

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