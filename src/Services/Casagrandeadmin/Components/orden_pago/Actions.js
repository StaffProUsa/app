import SSocket from 'servisofts-socket';
import Parent from './index';
export default class Actions {
  static _getReducer = (props) => {
    return props.state[Parent.component + 'Reducer'];
  };


  static getAll = (key_venta, props) => {
    var reducer = Actions._getReducer(props);
    if (reducer.key_venta != key_venta) {
      reducer.data = "";
      reducer.key_venta = key_venta;
    }
    var data = reducer.data;
    if (!data) {
      if (reducer.estado == 'cargando') return null;
      SSocket.send({
        component: Parent.component,
        version: Parent.version,
        type: 'getAll',
        estado: 'cargando',
        key_venta: key_venta,
        key_usuario: props.state.usuarioReducer?.usuarioLog?.key
      });
      return null;
    }
    return data;
  };

  static getAllSimple = (props) => {
    var reducer = Actions._getReducer(props);
    var data = reducer.data;
    if (!data) {
      if (reducer.estado == 'cargando') return null;
      SSocket.send({
        component: Parent.component,
        version: Parent.version,
        type: 'getAll',
        estado: 'cargando',
        key_usuario: props.state.usuarioReducer?.usuarioLog?.key
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
      component: Parent.component,
      version: Parent.version,
      type: 'registro',
      estado: 'cargando',
      key_usuario: props.state.usuarioReducer?.usuarioLog?.key,
      data: data
    });
  };

  static editar = (data, props) => {
    SSocket.send({
      component: Parent.component,
      version: Parent.version,
      type: 'editar',
      estado: 'cargando',
      key_usuario: props.state.usuarioReducer?.usuarioLog?.key,
      data: data
    });
  };

  static eliminar = (data, props) => {
    SSocket.send({
      component: Parent.component,
      version: Parent.version,
      type: 'editar',
      estado: 'cargando',
      key_usuario: props.state.usuarioReducer?.usuarioLog?.key,
      data: {
        ...data,
        estado: 0
      }
    });
  };
}
