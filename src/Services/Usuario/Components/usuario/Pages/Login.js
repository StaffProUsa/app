import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  SButtom,
  SForm,
  SHr,
  SIcon,
  SLoad,
  SNavigation,
  SPage,
  SPopup,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import Parent from '../index';
// import CryptoJS from 'crypto-js';
import PBarraFooter from '../../../../../Components/PBarraFooter';
import PButtom from '../../../../../Components/PButtom';
import carrito from '../../../../../Services/Casagrandeadmin/Components/carrito';
import LoginApple from '../../../../../LoginApis/LoginApple';
import LoginGoogle from '../../../../../LoginApis/LoginGoogle';
import LoginFacebook from '../../../../../LoginApis/LoginFacebook';
import Model from '../../../../../Model';
import CryptoJS from 'crypto-js';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'Pendiente' // Pendiente, Historial
    };
  }

  componentDidMount() {
    if (Model.usuario.Action.getKey()) {
      SNavigation.goBack();
      return;
    }

  }
  getForm() {
    return (
      <SForm
        ref={(ref) => {
          this.form = ref;
        }}
        props={{
          col: 'xs-12'
        }}
        inputProps={{
          separation: 16,
          color: STheme.color.text,
          height: 64,
          fontSize: 16,
          font: 'Roboto',
          placeholderTextColor: STheme.color.lightGray
        }}
        inputs={{
          usuario: {
            placeholder: 'Correo',
            isRequired: true,
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            type: 'email',
            // autoFocus: true,
            onKeyPress: (evt) => {
              if (evt.key === 'Enter') {
                this.form.focus('password');
              }
            },
            icon: (
              <SIcon
                name={'InputEmail'}
                fill={STheme.color.primary}
                width={17}
                height={20}
              />
            )
          },
          password: {
            placeholder: 'Contraseña',
            type: 'password',
            isRequired: true,
            onKeyPress: (evt) => {
              if (evt.key === 'Enter') {
                this.form.submit();
              }
            },
            icon: (
              <SIcon
                name={'InputPassword'}
                fill={STheme.color.primary}
                width={17}
                height={20}
              />
            )
          }
        }}
        onSubmit={(data) => {
          if (data) {
            // data["password"] = CryptoJS.MD5(data["password"]).toString();

            // Model.usuario.Action.loginByKey({
            //   usuario: data["usuario"],
            //   password: data["password"]
            // }).then((resp) => {
            //   SNavigation.replace("/");
            // }).catch(e => {

            // });

            Model.usuario.Action.login(data).then((resp) => {
              // SNavigation.goBack();
              SNavigation.replace("/");
            }).catch((e) => {
              SPopup.alert("Error en los datos");
            })
          }
        }}
      />
    );
  }

  getCargando() {
    if (this.props.state.usuarioReducer.estado != 'cargando') return null;
    return (
      <SView
        col={'xs-12'}
        height
        style={{
          position: 'absolute'
        }}
        backgroundColor='#00000066'
        center>
        <SLoad />
      </SView>
    );
  }

  getFilter() {
    return (
      <SView col={'xs-11 sm-10 md-8 lg-6 xl-6'} height={50} row>
        <SView
          col={'xs-6'}
          height
          backgroundColor={STheme.color.primary}
          center>
          <SButtom
            outline={this.state.filter != 'Pendiente'}
            onPress={() => {
              this.setState({ filter: 'Pendiente' });
            }}>
            Inicio Sesión
          </SButtom>
        </SView>
        <SView
          col={'xs-6'}
          height
          center
          backgroundColor={STheme.color.lightGray}>
          <SButtom
            outline={this.state.filter != 'Historial'}
            onPress={() => {
              SNavigation.navigate('usuario/registro');
            }}>
            Registro
          </SButtom>
        </SView>
      </SView>
    );
  }
  render() {
    // var error = Parent.Actions.getError('login', this.props);
    // if (error) {
    //   SPopup.alert('Usuario no encontrado, Verifique sus datos.');
    // }
    // var reducer = this.props.state.usuarioReducer;
    // if (reducer.type == 'loginGmail') {
    //   if (reducer.estado == 'error') {
    //     reducer.estado = '';
    //     SNavigation.navigate('usuario/registro', {type: 'gmail'});
    //   }
    // }
    // if (reducer.type == 'loginFacebook') {
    //   if (reducer.estado == 'error') {
    //     reducer.estado = '';
    //     SNavigation.navigate('usuario/registro', {type: 'facebook'});
    //   }
    // }

    // if (reducer.type == 'login') {
    //   this.props.state.usuarioReducer.type = '';
    // }
    // if (Parent.Actions.validateSession(this.props, true)) {
    //     alert("Session");
    //     SNavigation.replace('/');
    //     return null;
    // }

    return (
      <>
        <SPage title={'Login ' + Parent.component} center hidden>
          <SView center col={'xs-12'}>
            <SHr height={50} />
            <SView col={'xs-11 md-6 xl-4'} center>
              <SView col={'xs-11'} height={120}>
                <SIcon name={'Logo'} fill={STheme.color.primary} />
              </SView>
              <SView height={30} />
              {this.getFilter()}
              <SHr height={20} />
              {this.getForm()}
              <SView height={20} />
              <SView col={'xs-11'} height={40} row center>
                <SView col={'xs-3'} height center>
                  <SHr color={STheme.color.lightGray} height={1.5}></SHr>
                </SView>
                <SView col={'xs-6'} height center>
                  <SText
                    fontSize={14}
                    color={STheme.color.text}
                    font={'LondonMM'}>
                    {' '}
                    o Iniciar sesión con{' '}
                  </SText>
                </SView>
                <SView col={'xs-3'} height center>
                  <SHr color={STheme.color.lightGray} height={1.5}></SHr>
                </SView>
              </SView>

              <SView col={'xs-11'} height={100} row center>
                <SView col={'xs-2'} height center></SView>
                <SView flex center height={60}>
                  {/* <LoginGoogle onLogin={(usr) => {
                                        console.log(usr);
                                        Usuario.Actions.loginGoogle({
                                            ...usr
                                        }, this.props);
                                    }}>
                                        <SView height={50} colSquare center style={{
                                            backgroundColor: 'white', borderRadius: 8, borderColor: STheme.color.lightGray, borderWidth: 2, padding: 8
                                        }}>
                                            <SIcon name={"IconGoogle"} />
                                        </SView>
                                    </LoginGoogle> */}
                  <LoginApple onLogin={(usuario) => {
                    Parent.Actions.loginByKey({
                      user: usuario.id,
                    }).then((resp) => {
                      this.props.dispatch(resp);
                      SNavigation.reset("/")
                    }).catch((e) => {
                      SNavigation.navigate('usuario/registro', {
                        type: "api",
                        default_values: {
                          Nombres: usuario.name,
                          Apellidos: usuario.last_name,
                          Correo: usuario.email,
                          apple_key: usuario.id
                        }
                      }); //Si existe type muestra los password
                    })
                  }}>
                    <SView height={50} colSquare center style={{ backgroundColor: 'white', borderRadius: 8, borderColor: STheme.color.lightGray, borderWidth: 2, padding: 8 }}>
                      <SIcon name={'IconApple'} />
                    </SView>
                  </LoginApple>
                </SView>

                <SView flex center height={60}>
                  <LoginGoogle onLogin={(usuario) => {
                    Parent.Actions.loginByKey({
                      user: usuario.id,
                    }).then((resp) => {
                      this.props.dispatch(resp);
                      SNavigation.reset("/")
                    }).catch((e) => {
                      SNavigation.navigate('usuario/registro', {
                        type: "api",
                        default_values: {
                          Nombres: usuario.name,
                          Apellidos: usuario.last_name,
                          Correo: usuario.email,
                          gmail_key: usuario.id
                        }
                      }); //Si existe type muestra los password
                    })
                  }}>
                    <SView height={50} colSquare center style={{ backgroundColor: 'white', borderRadius: 8, borderColor: STheme.color.lightGray, borderWidth: 2, padding: 8 }}>
                      <SIcon name={'IconGoogle'} />
                    </SView>
                  </LoginGoogle>
                </SView>
                <SView flex center height={60}>
                  <LoginFacebook onLogin={(usuario) => {
                    Parent.Actions.loginByKey({
                      user: usuario.id,
                    }).then((resp) => {
                      this.props.dispatch(resp);
                      SNavigation.reset("/")
                    }).catch((e) => {
                      SNavigation.navigate('usuario/registro', {
                        type: "api",
                        default_values: {
                          Nombres: usuario.name,
                          Apellidos: usuario.last_name,
                          Correo: usuario.email,
                          facebook_key: usuario.id
                        }
                      }); //Si existe type muestra los password
                    })
                  }}>
                    <SView
                      height={50}
                      colSquare
                      center
                      style={{
                        backgroundColor: 'white',
                        borderRadius: 8,
                        borderColor: STheme.color.lightGray,
                        borderWidth: 2,
                        padding: 8
                      }}>
                      <SIcon name={'IconFaceb'} />
                    </SView>
                  </LoginFacebook>
                </SView>
                <SView col={'xs-2'} height center></SView>
              </SView>

              <SView height={10} />
              <SView col={'xs-11'} row center>
                <PButtom
                  fontSize={20}
                  onPress={() => {
                    this.form.submit();
                  }}>
                  Login
                </PButtom>
              </SView>
              <SView col={'xs-11'} height={50} row center>
                <SView col={'xs-12'} flex height center>
                  <SText
                    fontSize={14}
                    color={STheme.color.text}
                    style={{ textDecorationLine: 'underline' }}
                    font={'LondonMM'}
                    onPress={() => {
                      SNavigation.navigate(
                        Parent.component + '/recuperarContrasena'
                      );
                    }}>
                    ¿Olvidaste tu correo o contraseña?
                  </SText>
                </SView>
              </SView>
              <SView height={40} />
            </SView>
          </SView>
        </SPage >
        <SHr height={20} />
        <PBarraFooter url={'login'} />
        {this.getCargando()}
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Login);
