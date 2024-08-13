import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import {
  SForm,
  SIcon,
  SNavigation,
  SPage,
  SText,
  STheme,
  SView,
  SPopup,
  SHr,
} from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Usuario from '..';
import PButtom from '../../../../../Components/PButtom';
class EditarUsuario extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getForm() {
    var isApi = this.usr.gmail_key || this.usr.facebook_key;
    return (
      <SForm
        ref={(ref) => {
          this.form = ref;
        }}
        // row
        style={{
          alignItems: 'center'
        }}
        inputProps={{
          separation: 16,
          color: STheme.color.text,
          //  height: 54,
          fontSize: 16,
          font: 'Roboto'
        }}
        inputs={{
          foto_p: {
            placeholder: 'FOTO',
            type: 'image',
            isRequired: false,
            defaultValue: `${SSocket.api.root}usuario/${this.key
              }?time=${new Date().getTime()}`,
            col: 'xs-4 sm-3.5 md-3 lg-2.5 xl-2.5',
            style: {
              borderRadius: 100,
              overflow: 'hidden',
              width: 135,
              height: 135,
              borderWidth: 0,
              paddingStart: 0,
            },
            // SIcon: {"name": "AddFoto", "size": 30, "color": STheme.color.text},

          },
          Nombres: {
            placeholder: 'Nombres',
            isRequired: true,
            defaultValue: this.usr.Nombres,
            icon: <SIcon name={'InputUser'} width={20} height={20} />,
            height: 54
          },
          Apellidos: {
            placeholder: 'Apellidos',
            isRequired: true,
            defaultValue: this.usr.Apellidos,
            icon: <SIcon name={'InputUser'} width={20} height={20} />,
            height: 54
          },
          // CI: { label: "Documento de identidad", defaultValue: this.usr.CI, icon: <SIcon name={"InputUser"} width={40} height={30} /> },
          // "Fecha de nacimiento": { label: "Fecha de nacimiento", type: "date", defaultValue: this.usr["Fecha de nacimiento"], icon: <SIcon name={"Calendar"} width={40} height={30} /> },
          Telefono: {
            placeholder: 'Teléfono',
            defaultValue: this.usr['Telefono'],
            type: 'phone',
            height: 54
          },
          Correo: {
            placeholder: 'Correo',
            type: 'email',
            isRequired: true,
            defaultValue: this.usr.Correo,
            icon: <SIcon name={'InputEmail'} width={20} height={30} />,
            height: 54
          },
          ...(isApi
            ? {}
            : {
              Password: {
                type: 'password',
                isRequired: true,
                defaultValue: this.usr.Password,
                icon: <SIcon name={'InputPassword'} width={20} height={20} />,
                height: 54
              },
              RepPassword: {
                type: 'password',
                isRequired: true,
                defaultValue: this.usr.Password,
                icon: <SIcon name={'Repassword'} width={20} height={20} />,
                height: 54
              }
            })
          // "Direccion": { label: "Dirección", defaultValue: this.usr["Direccion"], type: "direccion", icon: <SIcon name={"map"} width={40} height={30} /> },
        }}
        onSubmit={(values) => {
          if (values["Password"] != values["RepPassword"]) {
            SPopup.open({ content: this.alertErrorPassword() });
            return null;
          }
          var finalObj = {
            ...this.usr,
            ...values
          };
          // if (JSON.stringify(this.usr) != JSON.stringify(finalObj)) {
          Usuario.Actions.editar(finalObj, this.props);
          // }
        }}
      />
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
    var usuario = Usuario.Actions.validateSession(this.props);

    if (!usuario) {
      SNavigation.replace('/');
    }
    this.usr = usuario;
    this.key = usuario.key;
    var reducer = Usuario.Actions._getReducer(this.props);
    if (reducer.estado == 'exito' && reducer.type == 'editar') {
      reducer.estado = '';
      if (this.form) {
        console.log('ENTRO EDITAR FOTOOOOO');
        this.form.uploadFiles(SSocket.api.root + 'upload/usuario/' + this.key);
      }
      SNavigation.goBack();
    }
    return (
      <SPage title={'Editar usuario'}>
        <SView center>
          <SView col={'xs-11 md-6 xl-4'} center>
            <SView height={8} />
            {/* <SText fontSize={20} bold>{"Editar usuario!"}</SText> */}
            <SView height={8} />
            {/* <SView width={160} height={160}>
                            <KFotoPerfil data={usuario} component={"usuario"} />
                        </SView> */}
            <SView col={'xs-12'}>
              <SText color={STheme.color.text} fontSize={18}>
                MIS DATOS
              </SText>
            </SView>
            <SView col={'xs-12'} center>
              {this.getForm()}
            </SView>
            <SView height={16} />
            <SView col={'xs-11'} row center>
              <PButtom
                primary
                props={
                  {
                    // type: "outline"
                  }
                }
                onPress={() => {
                  this.form.submit();
                }}>
                {'CONFIRMAR'}
              </PButtom>

            </SView>
            <SView height={36} />
            <SView col={"xs-12"} center onPress={() => {
              SPopup.confirm({
                title: "Eliminar la cuenta?",
                message: "Esta seguro de elimar la cuenta?",
                onPress: () => {
                  Usuario.Actions.editar({
                    ...usuario,
                    estado: 0,
                  }, this.props)
                  this.props.dispatch({ type: 'USUARIO_LOGOUT' });
                  SNavigation.replace('login');
                }
              })
            }}>
              <SHr />
              <SText style={{
                color: STheme.color.danger,
                textDecoration: "underline"
              }}>Elimina tu cuenta</SText>
              <SHr />
            </SView>
            <SView height={36} />
          </SView>
          {/* <RolDeUsuario data={this.usr} /> */}
        </SView>
      </SPage>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(EditarUsuario);
