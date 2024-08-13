import SSocket from 'servisofts-socket';
import Service from '../../index';
import Parent from './index';

export default class Actions {
  static _getReducer = (props) => {
    return props.state[Parent.component + 'Reducer'];
  };
  static getAll = (key_usuario, props) => {
    var reducer = Actions._getReducer(props);
    var data = reducer.data;
    if (!data) {
      if (reducer.estado == 'cargando') return null;
      SSocket.send({
        service: Service.ServiceName,
        component: Parent.component,
        version: Parent.version,
        type: 'getAll',
        key_usuario: key_usuario,
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

  static registro = (data, props) => {
    SSocket.send({
      service: Service.ServiceName,
      component: Parent.component,
      version: Parent.version,
      type: 'registro',
      estado: 'cargando',
      key_usuario: '',
      data: data
    });
  };
  static editar = (data, props) => {
    SSocket.send({
      service: Service.ServiceName,
      component: Parent.component,
      version: Parent.version,
      type: 'editar',
      estado: 'cargando',
      key_usuario: '',
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
      key_usuario: '',
      data: {
        ...data,
        estado: 0
      }
    });
  };
}
