import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SNavigation, SPage, SText, SView, STheme, SIcon } from 'servisofts-component';
import Usuario from '..';
// import FotoPerfilComponent from '../../../Components/FotoPerfilComponent';
// import LogoAnimado from '../../CargaPage/LogoAnimado';
// import RolDeUsuario from './RolDeUsuario';
import PButtom from '../../../../../Components/PButtom';

class NuevoPass extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getForm() {
    return (
      <SForm
        ref={(ref) => {
          this.form = ref;
        }}
        row
        style={{
          justifyContent: 'space-between'
        }}
        inputProps={{
          col: 'xs-12',
          separation: 16,
          color: STheme.color.text,
          height: 64,
          fontSize: 16,
          font: 'Roboto',
          placeholderTextColor: STheme.color.lightGray
        }}
        inputs={{
          Password: {
            placeholder: 'Introduce tu nueva contraseña',
            isRequired: true,
            type: 'password',
            icon: (
              <SIcon
                name={'InputPassword'}
                fill={STheme.color.primary}
                width={24}
                height={16}
              />
            )
          },
          RepPassword: {
            placeholder: 'Confirma tu nueva contraseña',
            type: 'password',
            isRequired: true,
            icon: (
              <SIcon
                name={'InputPassword'}
                fill={STheme.color.primary}
                width={24}
                height={16}
              />
            )
          }
        }}
        onSubmit={(values) => {
          // if (this.key) {
          //     Usuario.Actions.recuperarPass({
          //         ...this.usr,
          //         ...values
          //     }, this.props);
          // } else {
          Usuario.Actions.cambiarPassByCodigo(values, this.props);
          // }
        }}
      />
    );
  }

  render() {
    //var bb = this.props.state.usuarioReducer.usuarioRecuperado;
    // var error = Usuario.Actions.getError("verificarCodigoPass", this.props);
    // if (error) {
    //     SPopup.alert("¡Código incorrecto!");
    // }
    if (!this.props.state.usuarioReducer.usuarioRecuperado) {
      SNavigation.goBack();
    }
    if (
      this.props.state.usuarioReducer.estado == 'exito' &&
      this.props.state.usuarioReducer.type == 'cambiarPassByCodigo'
    ) {
      this.props.state.usuarioReducer.estado = '';
      // var dataRecuperar = Usuar
      SNavigation.navigate('login');
    }
    return (
      <SPage title={'Registrar nueva contraseña'}>
        <SView center>
          <SView col={'xs-11 md-6 xl-4'} center>
            <SView height={40} />
            <SText fontSize={24} color={STheme.color.text} font='LondonTwo' center>
              ¡Restablece tu contraseña!
            </SText>
            <SView height={30} />

            {/* {this.key ? <SView col={"xs-6"} height={150}> <FotoPerfilComponent data={this.usr} component={"usuario"} /> </SView> : null} */}
            {this.getForm()}
            <SView height={30} />
            <SView col={'xs-11'} row center>
              <PButtom
                primary
                props={
                  {
                    // type: STheme.color.primary
                  }
                }
                onPress={() => {
                  this.form.submit();
                }}>
                RESTABLECER CONTRASEÑA
              </PButtom>
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
export default connect(initStates)(NuevoPass);
