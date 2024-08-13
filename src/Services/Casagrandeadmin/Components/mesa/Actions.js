import SSocket from 'servisofts-socket';
import Parent from './index';
export default class Actions {
  static _getReducer = (props) => {
    return props.state[Parent.component + 'Reducer'];
  };

  static getAll = (props) => {
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
  static getAllKeyEvento = (key_evento, props) => {
    var reducer = Actions._getReducer(props);
    if (reducer.key_evento != key_evento) {
      reducer.key_evento = key_evento;
      reducer.data = "";
    }
    var data = reducer.data;
    if (!data) {
      if (reducer.estado == 'cargando') return null;
      SSocket.send({
        component: Parent.component,
        version: Parent.version,
        type: 'getAllKeyEvento',
        estado: 'cargando',
        key_evento: key_evento,
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
  // static getByKeyEvento = (keyEvento, props) => {
  //   var data = Actions.getAll(props);
  //   if (!data) return null;
  //   return Object.values(data).filter((itm) => itm.key_evento == keyEvento);
  // };

  static registro = (data, key_sector, props) => {
    return new Promise((resolve, reject) => {
      SSocket.sendPromise({
        component: Parent.component,
        version: Parent.version,
        type: 'registro',
        estado: 'cargando',
        key_usuario: props.state.usuarioReducer?.usuarioLog?.key,
        data: data,
        key_sector: key_sector
      }).then((resp) => {
        props.dispatch(resp);
        resolve(resp);
      }).catch(e => {
        reject(resp);
      })
    })

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
