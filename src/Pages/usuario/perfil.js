import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  SHr,
  SIcon,
  SImage,
  SNavigation,
  SPage,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Carrito from '../../Components/Carrito';
import PBarraFooter from '../../Components/PBarraFooter';
import SwitchTheme from '../../Components/SwitchTheme';
import carrito from '../../Services/Casagrandeadmin/Components/carrito';
// import Roles_permisos from '../Roles_permisos';
import Model from '../../Model';

class Perfil extends Component {
  static navigationOptions = {
    headerShown: false
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    // this.props.dispatch({
    //     component: "image",
    //     type: "cambio",
    //     url: AppParams.urlImages + "usuario_" + usuario.key,
    // })
  }
  getPerfil() {
    var usuario = Model.usuario.Action.getUsuarioLog();
    // if (!usuario) {
    //   SNavigation.navigate('login');
    //   return <SView />;
    // }
    return (
      <SView
        center
        onPress={() => {
          SNavigation.navigate('editar');
        }}>
        <SView
          style={{
            width: 140,
            height: 140,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <SView
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: STheme.color.card,
              borderRadius: 100,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: STheme.color.card
            }}>
            <SImage
              src={`${SSocket.api.root}usuario/${usuario.key
                }?time=${new Date().getTime()}`}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: "cover"
              }}
            />
          </SView>
        </SView>
        <SHr />
        <SView>
          <SView center>
            <SText
              style={{
                // flex: 5,
                fontSize: 18,
                // fontWeight: "bold",
                color: STheme.color.text
              }}>
              {usuario['Nombres'] + ' ' + usuario['Apellidos']}{' '}
            </SText>
          </SView>
          <SView center>
            <SText
              style={{
                fontSize: 14
                // color: "#bbb"
              }}
              color={STheme.color.gray}>
              {usuario['Correo'] ?? '--'}{' '}
            </SText>
          </SView>
        </SView>
      </SView>
    );
  }
  getDato(key, icon) {
    var text = this.usuario[key] ?? '--';
    if (key == 'Password') {
      text = '************';
    }
    return (
      <SView row col={'xs-12'} center>
        <SHr />
        <SHr />
        <SIcon name={icon} width={40} height={30} />
        <SView width={16} />
        <SText>{text}</SText>
        <SView flex />
      </SView>
    );
  }
  getDatos() {
    return (
      <SView col={'xs-12'} center>
        {/* {this.getDato("Nombres", "InputUser")} */}
        {/* {this.getDato("Apellidos", "InputUser")} */}
        {/* {this.getDato("CI", "InputUser")} */}
        {this.getDato('Fecha de nacimiento', 'Calendar')}
        {this.getDato('Telefono', 'InputPhone')}
        {this.getDato('Correo', 'InputEmail')}
        {this.getDato('Password', 'InputPassword')}
        {this.getDato('Direccion', 'InputLocation')}
      </SView>
    );
  }

  opcion({ url, titulo, icon }) {
    // if (url == 'admin') {
    //   var roles = Roles_permisos.components.rol.Actions.getAll(this.props);
    //   var ru = Roles_permisos.components.usuarioRol.Actions.getAll(
    //     Model.usuario.Action.getKey(),
    //     null,
    //     this.props
    //   );
    //   if (!roles) return;
    //   if (!ru) return;
    //   if (Object.keys(ru).length === 0) return;
    // }
    return (
      <>
        <SView
          row
          col={'xs-11'}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: STheme.color.card
            // borderBottomColor: STheme.color.darkGray
          }}
          onPress={() => {
            if (url == 'salir') {
              Model.usuario.Action.unlogin();
              this.props.dispatch({ type: 'USUARIO_LOGOUT' });
              carrito.Actions.removeAll(this.props); //Elimina todos los eventos del carrito
              SNavigation.replace('login');
            } else {
              SNavigation.navigate(url);
            }
          }}>
          <SView row col={'xs-1'}>
            <SIcon
              name={icon}
              width={20}
              height={20}
              fill={url == 'salir' ? '#ff4132' : STheme.color.primary}></SIcon>
          </SView>
          <SView row col={'xs-9'}>
            <SText color={url == 'salir' ? '#ff4132' : STheme.color.primary} font={"Roboto"}>
              {titulo}
            </SText>
          </SView>
          <SView flex col={'xs-2'} style={{ alignItems: 'flex-end' }}>
            <SIcon
              name={'MenuPerfil'}
              width={9}
              fill={url == 'salir' ? '#ff4132' : STheme.color.primary}></SIcon>
          </SView>
          <SHr height={20} />
        </SView>
        <SHr height={20} />
      </>
    );
  }
  getOpciones() {
    return (
      <SView col={'xs-12'} center>
        <SView
          backgroundColor={STheme.color.card}
          col={'xs-12'}
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
            borderTopWidth: 1,
            borderTopColor: STheme.color.card
          }}>
          <SHr />
          <SView row col={'xs-12'} center>
            <SHr height={10} />
            <SView row col={'xs-10'} center>
              <SText color={STheme.color.text} font={"Roboto"} fontSize={16}>OPCIONES</SText>
            </SView>
            <SHr height={10} />
            <SView
              row
              col={'xs-8'}
              center
              style={{
                borderBottomWidth: 1,
                borderBottomColor: STheme.color.card
              }}></SView>
          </SView>
          <SView row col={'xs-12'} center>
            <SHr height={50} />
            <SView
              row
              col={'xs-11'}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: STheme.color.card
              }}
              onPress={() => {
                // SNavigation.navigate(url);
              }}>
              <SView row col={'xs-1'}>
                <SIcon
                  name={STheme.getTheme() == 'dark' ? "Dark" : "Sun"}
                  width={20}
                  height={20}
                  fill={STheme.color.primary}></SIcon>
              </SView>
              <SView row col={'xs-9'}>
                <SText font={"Roboto"}>Modo {STheme.getTheme() == 'dark' ? "oscuro" : "claro"}</SText>
              </SView>
              <SView flex col={'xs-2'} style={{ alignItems: 'flex-end' }}>
                {/* <SIcon
                  name={'Modo'}
                  width={35}
                  fill={STheme.color.primary}></SIcon> */}

                <SwitchTheme
                  width={35}
                  height={20}
                  callback={(resp) => {
                    console.log('viendo que', resp);
                  }}
                />
              </SView>
              <SHr height={20} />
            </SView>
            <SHr height={20} />
            {this.opcion({
              url: '/usuario/edit',
              titulo: 'Editar perfil',
              icon: 'Editar'
            })}
            {this.opcion({
              url: '/notification',
              titulo: 'Notificaciones',
              icon: 'Notificacion'
            })}
            {this.opcion({
              url: 'admin',
              titulo: 'Administración',
              icon: 'Admin'
            })}
            {this.opcion({
              url: 'terminos',
              titulo: 'Términos y Condiciones',
              icon: 'IconCheckedOk'
            })}
            {this.opcion({
              url: 'salir',
              titulo: 'Salir',
              icon: 'SalirPerfil'
            })}
          </SView>
          <SHr height={30} />
        </SView>
      </SView>
    );
  }

  render() {
    var usuario = Model.usuario.Action.getUsuarioLog()
    this.usuario = usuario;
    if (!usuario) {
      SNavigation.navigate('login');
      return <SView />;
    }
    return (
      <>
        <SPage title='Perfil'>
          <SView col={"xs-12"} center>
            <SView col={'xs-12 sm-10 md-8 lg-6 xl-4'} center>
              <SView height={30}></SView>
              {this.getPerfil()}
              <SView height={20}></SView>
              {this.getOpciones()}
              <SView height={40} />
            </SView>
          </SView>
        </SPage>
        <PBarraFooter url={'login'} />
        <Carrito style={{
          top: "10%"
        }} />
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Perfil);
