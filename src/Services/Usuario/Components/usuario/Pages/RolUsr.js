import React, {Component} from 'react';
import {connect} from 'react-redux';
import {SImage, SNavigation, SPage, SText, SView} from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Roles_permisos from '../../../../Roles_permisos';//
class RolUsr extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.key = SNavigation.getParam('key');
  }
  getUselect(obj, ru) {
    if (ru?.estado) return;
    return (
      <SView
        col={'xs-12'}
        height
        style={{
          position: 'absolute',
          backgroundColor: '#00000088'
        }}
        onPress={() => {
          Roles_permisos.components.usuarioRol.Actions.registro(
            {
              key_usuario: this.key,
              key_rol: obj.key
            },
            this.props
          );
        }}
        center>
        <SText secondary bold>
          Click to active
        </SText>
      </SView>
    );
  }

  getButtom(obj, ru) {
    return (
      <SView
        col={'xs-4'}
        height={130}
        style={{
          padding: 5
        }}>
        <SView
          col={'xs-12'}
          height
          card
          center
          style={{
            overflow: 'hidden'
          }}
          onPress={() => {
            if (!ru?.estado) return;
            Roles_permisos.components.usuarioRol.Actions.eliminar(
              ru,
              this.props
            );
          }}>
          <SView
            center
            col={'xs-12'}
            flex
            style={{
              padding: 5
            }}
            card>
            <SImage
              src={SSocket.api.roles_permisos + 'rol/' + obj.key}
              width={80}
              height={80}
            />
          </SView>
          <SView col={'xs-12'} height={34} center>
            <SText center>{obj.descripcion}</SText>
            {/* <SText center >{obj.key}</SText> */}
          </SView>
          {this.getUselect(obj, ru)}
        </SView>
      </SView>
    );
  }

  getRoles() {
    var roles = Roles_permisos.components.rol.Actions.getAll(this.props);
    var ru = Roles_permisos.components.usuarioRol.Actions.getAll(
      this.key,
      null,
      this.props
    );
    if (!roles) return <SText>Cargando</SText>;
    if (!ru) return <SText>Cargando</SText>;
    return Object.keys(roles).map((key) => {
      var obj = roles[key];
      return this.getButtom(obj, ru[obj.key]);
    });
  }
  render() {
    return (
      <SPage title={'Rol'} center>
        <SView col={'xs-11 sm-10 md-8 lg-6 xl-4'} row>
          {this.getRoles()}
          {/* {this.getRolUsuario()} */}
        </SView>
      </SPage>
    );
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(RolUsr);
