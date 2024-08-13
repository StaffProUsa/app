import SSocket from 'servisofts-socket';
import Service from '../../index';
import Parent from './index';

export default class Actions {
  static _getReducer = (props) => {
    return props.state[Parent.component + 'Reducer'];
  };
  static getAll = (key_usuario, key_rol, props) => {
    var reducer = Actions._getReducer(props);
    var data = reducer.data[key_usuario ? key_usuario : key_rol];
    if (!data) {
      if (reducer.estado == 'cargando') return null;
      SSocket.send({
        service: Service.ServiceName,
        component: Parent.component,
        version: Parent.version,
        type: 'getAll',
        key_usuario: key_usuario,
        key_rol: key_rol,
        estado: 'cargando'
      });
      return null;
    }
    return data;
  };

  static getByKey = (key, props) => {
    var data = Actions.getAll(props);
    if (!data) return null;
    return data[key];
  };

  static registro = ({key_rol, key_usuario}, props) => {
    SSocket.send({
      service: Service.ServiceName,
      component: Parent.component,
      version: Parent.version,
      type: 'registro',
      estado: 'cargando',
      key_usuario: props.state.usuarioReducer.usuarioLog.key,
      data: {
        key_rol: key_rol,
        key_usuario: key_usuario
      }
    });
  };
  static editar = (data, props) => {
    SSocket.send({
      service: Service.ServiceName,
      component: Parent.component,
      version: Parent.version,
      type: 'editar',
      estado: 'cargando',
      key_usuario: props.state.usuarioReducer.usuarioLog.key,
      data: data
    });
  };
  static eliminar = (data, props) => {
    SSocket.send({
      service: Service.ServiceName,
      component: Parent.component,
      version: Parent.version,
      type: 'editar',
      estado: 'cargando',
      key_usuario: props.state.usuarioReducer.usuarioLog.key,
      data: {
        ...data,
        estado: 0
      }
    });
  };
}
