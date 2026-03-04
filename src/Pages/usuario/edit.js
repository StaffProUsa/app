import React, { Component } from 'react';
import DPA, { connect } from 'servisofts-page';
import { Parent } from '.';
import { SForm, SLanguage, SMath, SNavigation, SNotification, SPopup, STheme, SView } from 'servisofts-component';
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
      excludes: (!SNavigation.getParam("key_company")) ? ["salario_hora", "employee_number", "papeles"] : ["papeles"]
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
    if (!data) return null;
    if (this.key_company) {
      if (!this.state.usuario_company) return null;
      data.employee_number = this.state?.usuario_company?.employee_number ?? ""
      data.salario_hora = this.state?.usuario_company?.salario_hora ?? ""
    }
    return data;
  }
  $inputs() {
    var inputs = super.$inputs();
    inputs["Password"].type = "password"
    inputs["Correo"].type = "email"
    inputs["Telefono"].type = "phone"
    // inputs["papeles"].type = "checkBox"
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
    inputs["otros_idiomas"].onPress = (e) => {
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
              data={["US CITIZEN", "GREEN CARD", "WOK PERMIT", "TAX ID OR ITIN", "NONE"]}
              onChange={val => {
                this.form.setValues({ "otros_idiomas": val })
              }}
              ITEM_HEIGHT={30} />
          </SView>
        }
      })
    }
    return inputs;
  }
  $onSubmit(data) {
    let lenguaje = SLanguage.language;
    if (this.state.loading) {
      return;
    }
    this.setState({ loading: true })

    if (data["Password"] != this.data["Password"]) data["Password"] = CryptoJS.MD5(data["Password"]).toString();

    if (this.key_company) {
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
      this.setState({ loading: false })
      // SNotification.send({
      //   title: "Exito",
      //   body: lenguaje == "es" ? "Usuario editado correctamente" : "User edited successfully",
      //   color: STheme.color.success,
      //   time: 5000
      // });
      console.log("sdasdasd", this.state.usuario_company);
      SSocket.sendPromise({
        component: "usuario_company",
        type: "editar",
        data: this.state.usuario_company
      }).then(e => {
        console.log(e);

      }).catch(e => {
        console.log(e);
       
        let allUsersObj = Parent.model.Action.getAll();
        let allUsers = Object.values(allUsersObj || {});
        const email = data.Correo?.trim().toLowerCase();

        const existe = allUsers.some(u =>
          u.Correo &&
          u.Correo.trim().toLowerCase() === email &&
          u.key !== this.data.key   // 🔥 evita compararse con el mismo usuario
        );

        if (existe) {
          SNotification.send({
            title: "Error",
            body: lenguaje == "es"
              ? "El correo ya existe en la lista de usuarios de la empresa"
              : "The email already exists in the company's user list",
            color: STheme.color.danger,
            time: 5000
          });
          return;
        }
      })
      SNavigation.goBack();
    }).catch(e => {
      this.setState({ loading: false })
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