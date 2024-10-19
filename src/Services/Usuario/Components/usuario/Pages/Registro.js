import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SHr, SIcon, SLoad, SNavigation, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import PButtom from '../../../../../Components/PButtom';
import Parent from '../index';
import Model from '../../../../../Model';
import CryptoJS from 'crypto-js';

class Registro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      envio: 1
    };
    this.key = SNavigation.getParam('key');
    this.type = SNavigation.getParam('type');
    this.default_values = SNavigation.getParam('default_values', {});
  }
  icon = (name) => {
    return <SIcon
      name={name}
      fill={STheme.color.primary}
      width={17}
      height={20}
    />
  }
  getContent() {
    this.usr = {
      ...this.default_values
    };
    if (this.key) {
      this.usr = Parent.Actions.getByKey(this.key, this.props);
      if (!this.usr) return <SLoad />;
    }
    return (
      <SForm
        ref={(form) => { this.form = form; }}
        col={'xs-11 sm-9 md-7 lg-5 xl-4'}
        inputProps={{ separation: 16, color: STheme.color.text, height: 64, fontSize: 16, font: 'Roboto', placeholderTextColor: STheme.color.lightGray }}
        style={{ alignItems: 'center' }}
        inputs={{
          Nombres: {
            placeholder: 'Nombres', isRequired: true, defaultValue: this.usr.Nombres, icon: this.icon("InputUser")
          },
          Apellidos: {
            placeholder: 'Apellidos', isRequired: true, defaultValue: this.usr.Apellidos, icon: this.icon("InputUser")
          },
          Telefono: {
            placeholder: 'Teléfono', isRequired: true, defaultValue: this.usr['Telefono'], type: 'phone', icon: this.icon("InputPhone")
          },
          Correo: {
            placeholder: 'Correo', type: 'email', isRequired: true, defaultValue: this.usr.Correo, icon: this.icon("InputEmail")
          },
          ...(!this.type
            ? {
              Password: {
                placeholder: 'Password', isRequired: true, type: 'password', defaultValue: this.usr.Password, icon: this.icon("LockOutline")
              },
              RepPassword: {
                placeholder: 'Repetir password', type: 'password', isRequired: true, defaultValue: this.usr.Password, icon: this.icon("LockOutline")
              }
            }
            : {})
        }}
        onSubmit={(values) => {
          if (values["Password"] != values["RepPassword"]) {
            SPopup.open({ content: this.alertErrorPassword() });
            return null;
          }
          if (this.state.envio == 0) {
            SPopup.alert('Debes aceptar los términos y condiciones');
            return;
          }
          if (this.key) {
            // Parent.Actions.editar({
            //   ...this.usr,
            //   ...values
            // }, this.props);
            // var password = CryptoJS.MD5(values["Password"]).toString();
            var password = values["Password"];
            console.log(password)
            console.log(this.usr.Password)
            delete values["RepPassword"]
            var newObj = { ...this.usr, ...values };
            if (password != this.usr.Password) {
              password = CryptoJS.MD5(values["Password"]).toString();
              newObj = { ...this.usr, ...values, Password: password }
            }

          
            Model.usuario.Action.editar({
              data: { ...newObj },
            })
              .then(resp => {
                SNavigation.goBack();
              })
              .catch(e => {
                SPopup.alert("Error al editar el usuario");
              })

          } else {
            var password = CryptoJS.MD5(values["Password"]).toString();
            Model.usuario.Action.registro({
              data: { ...values, Password: password },
            }).then(resp => {
              Model.usuario.Action.loginByKey({
                usuario: values["Correo"],
                password: password

              }).then(resp => {
                // SNavigation.reset("/");
              }).catch(e => {
                SPopup.alert("Error al iniciar con el nuevo usuario");
                // SNavigation.reset("/");
              })
              // SNavigation.replace('/');

            }).catch(e => {
              SPopup.alert("Ya existe un usuario con este correo.")
            })

            // Parent.Actions.registroAsync({
            //   ...this.usr,
            //   ...values
            // }).then((resp) => {
            //   this.props.dispatch({
            //     component: "usuario",
            //     version: "2.0",
            //     type: "login",
            //     estado: "exito",
            //     data: resp.data,
            //   })
            //   SNavigation.replace('/');
            // }).catch(e => {
            //   if (!e.error_dato) return;
            //   SPopup.alert(`Ya existe un usuario con este ${e.error_dato}`)
            // })

          }
        }}
      />
    );
  }

  //TODO LICETH: Falta que ricky me devuelva detalle de error de usuario para mostrar error en popup
  alertError(error) {
    return (
      <SView
        col={'xs-12 md-8 xl-6'}
        row
        style={{ height: 250, borderRadius: 8 }}
        backgroundColor={STheme.color.background}
        center>
        <SView col={'xs-11'}>
          <SView height={30}></SView>
          <SIcon name={'UserAlert'} height={100} />
        </SView>
        <SView col={'xs-11'} center>
          <SText
            color={STheme.color.darkGray}
            style={{ fontSize: 20, fontWeight: 'bold' }}>
            Número activo
          </SText>
          <SText color={STheme.color.darkGray} style={{ fontSize: 15 }}>
            El número que ingreso ya está asociado a una cuenta activa.
          </SText>
          <SView height={30}></SView>
          {/* <SText style={{ fontSize: 12, }}>{`Fecha nacimiento: ${error["Fecha nacimiento"]}`}</SText> */}
          {/* <SText secondary style={{ fontSize: 12, }}>{`CI: ${error["CI"]}`}</SText>
                <SText secondary style={{ fontSize: 12, }}>{`Telefono: ${error["Telefono"]}`}</SText> */}
        </SView>
      </SView >
    );
  }

  alertErrorPassword() {
    return <SView col={"xs-11 md-8 xl-6"} row center style={{ height: 250, borderRadius: 8, }} backgroundColor={STheme.color.background} >
      <SView col={"xs-11"} height={40} />
      <SView col={"xs-11"}  >
        <SIcon name={"InputPassword"} height={100} fill={STheme.color.primary} />
      </SView>
      <SView col={"xs-11"} height={15} />
      <SView col={"xs-12"} center  >
        <SText center color={STheme.color.primary} style={{ fontSize: 18, fontWeight: "bold" }}>Las contraseñas no coinciden</SText>
      </SView>
      <SView col={"xs-11"} height={30} />
    </SView>
  }

  render() {
    // var error = Parent.Actions.getError('registro', this.props);
    // if (error) {
    //   SPopup.open({ key: 'errorRegistro', content: this.alertError(error) });
    // }
    // if (
    //   (this.props.state.usuarioReducer.estado == 'exito' &&
    //     this.props.state.usuarioReducer.type == 'registro') ||
    //   this.props.state.usuarioReducer.type == 'editar'
    // ) {
    //   this.props.state.usuarioReducer.estado = '';
    //   if (this.props.state.usuarioReducer.lastRegister) {
    //     this.key = this.props.state.usuarioReducer.lastRegister.key;
    //     var lastRegister = this.props.state.usuarioReducer.lastRegister;
    //     if (lastRegister.key) {
    //       if (!Parent.Actions.validateSession(this.props, true)) {
    //         if (lastRegister.gmail_key) {
    //           Parent.Actions.loginGoogle(
    //             {
    //               id: lastRegister.gmail_key
    //             },
    //             this.props
    //           );
    //           SNavigation.replace('login');
    //           return null;
    //         } else if (lastRegister.facebook_key) {
    //           Parent.Actions.loginFacebook(
    //             {
    //               id: lastRegister.facebook_key
    //             },
    //             this.props
    //           );
    //           SNavigation.replace('login');
    //           return null;
    //         } else {
    //           Parent.Actions.login(
    //             {
    //               usuario: this.props.state.usuarioReducer.lastRegister.Correo,
    //               password:
    //                 this.props.state.usuarioReducer.lastRegister.Password
    //             },
    //             this.props
    //           );
    //           SNavigation.replace('login');
    //           return null;
    //         }
    //       }
    //     }
    //   }
    //   if (this.form) {
    //     this.form.uploadFiles(
    //       SSocket.api.root + 'upload/' + Parent.component + '/' + this.key
    //     );
    //   }
    //   if (this.props.state.usuarioReducer.type == 'editar') {
    //     SNavigation.navigate('admin/usuario');
    //   } else {
    //     SNavigation.navigate('/');
    //   }
    // }
    if (this.key) {
      this.usr = Parent.Actions.getByKey(this.key, this.props);
      if (!this.usr) return <SLoad />;
    }
    return (
      <SPage title={'Registro de ' + Parent.component} center>
        <SView height={30}></SView>
        <SView col={'xs-12'} center>
          {this.getContent()}
        </SView>
        <SHr height={25} />
        <SView col={'xs-11 sm-9 md-7 lg-5 xl-4'} height={30} center>
          <SView col={'xs-10'} row center backgroundColor={'transparent'}>
            <SView
              col={'xs-1'}
              onPress={() => {
                this.setState(this.state.envio == 0 ? { envio: 1 } : { envio: 0 });
              }}>
              <SIcon
                name={this.state.envio != 0 ? 'IconCheckedOk' : 'IconChecked'}
                fill={STheme.color.primary}
                width={30}
                height={30}></SIcon>
            </SView>
            <SView
              col={'xs-9'}
              center
              style={{ alignItems: 'center' }}
              onPress={() => {
                SNavigation.navigate('terminos');
              }}>
              <SText
                color={STheme.color.text}
                fontSize={14}
                font={'LondonBetween'}
                style={{ textDecorationLine: 'underline' }}>
                Aceptar términos y condiciones
              </SText>
            </SView>
          </SView>
        </SView>
        <SHr height={25} />
        <PButtom
          props={{
            type: 'outline'
          }}
          onPress={() => {
            this.form.submit();
          }}>
          {this.key ? 'Editar' : 'Registrar'}
        </PButtom>
        <SView height={40}></SView>
      </SPage>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Registro);
