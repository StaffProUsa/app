import SSocket from 'servisofts-socket';
import evento from '../evento';
import sector from '../sector';
import tipo_entrada from '../tipo_entrada';
import venta from './index';
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

  static getByKeyUsuario = (key_usuario, props) => {
    var data = Actions.getVenta(props);
    if (!data) return null;
    var arr = Object.values(data).filter(dta => dta.key_usuario == key_usuario);
    return arr;
  }

  static getVenta(props) {
    var data = Actions.getAll(props);
    var tipo_eventos = evento.Actions.getAll(props);
    var tipo_entradas = tipo_entrada.Actions.getAll(props);
    var tipo_sectores = sector.Actions.getAll(props);

    if (!data) return null;
    if (!tipo_eventos) return null;
    if (!tipo_entradas) return null;
    if (!tipo_sectores) return null;

    var arr = Object.values(data);
    if (!arr) return null;

    return arr.map((itm) => {
      return {
        ...itm,
        detalle: itm.detalle.map((itm2) => {
          return {
            ...itm2,
            tipo_entrada: tipo_entradas[itm2.key_item],
            tipo_sector: tipo_sectores[itm2.key_item],
            tipo_evento:
              tipo_eventos[tipo_entradas[itm2?.key_item]?.key_evento] ||
              tipo_eventos[tipo_sectores[itm2?.key_item]?.key_evento]
          };
        })
      };
    });
  }

  static getVentaDetalle(props) {
    var data = Actions.getVenta(props);
    if (!data) return null;

    var arr = Object.values(data);
    if (!arr) return null;

    return arr.map((itm) => {
      return itm.detalle;
    });
  }



  static getVentaDetalleEventos(props) {
    var data = Actions.getVenta(props);
    if (!data) return null;

    var arr = Object.values(data);
    if (!arr) return null;

    return arr.map((itm) => {
      return itm.detalle.map((itm2) => {
        return (itm2.tipo_evento[itm2.key_venta] = itm2.tipo_evento.key);
      });
    });
  }

  static getEventosActivos = (props) => {
    var data = venta.Actions.getVenta(props);
    var eventos = evento.Actions.getAll(props);
    if (!data) return null;
    if (!eventos) return null;
    var eventoactivosOk = {};

    var arr = Object.values(data);
    if (!arr) return null;
    arr.map((itm) => {
      itm.detalle.map((itm2) => {
        eventoactivosOk[itm2.tipo_evento.key] = eventos[itm2.tipo_evento.key];
      });
    });

    //mostrar  entradas y sectores  por evento activo
    var eventoactivos = {};
    Object.keys(eventoactivosOk).map((key) => {
      eventoactivos[key] = {
        evento: eventoactivosOk[key],
        entradas: [],
        sectores: []
      };
    });
    Object.keys(eventoactivosOk).map((key) => {
      data.map((itm) => {
        itm.detalle.map((itm2) => {
          if (itm2.tipo_evento.key == key) {
            eventoactivos[key].entradas.push(itm2.tipo_entrada);
            eventoactivos[key].sectores.push(itm2.tipo_sector);
          }
        });
      });
    });
    return eventoactivos;
  };

  static getEventosPorVenta = (props) => {
    var data = Actions.getVenta(props);
    var tipo_eventos = evento.Actions.getAll(props);
    var tipo_entradas = tipo_entrada.Actions.getAll(props);
    var tipo_sectores = sector.Actions.getAll(props);

    if (!data) return null;
    if (!tipo_eventos) return null;
    if (!tipo_entradas) return null;
    if (!tipo_sectores) return null;
    // mostrar  venta ( entrada y sector) y eventos
    var eventos = {};
    var arr = Object.values(data);
    if (!arr) return null;
    arr.map((itm) => {
      itm.detalle.map((itm2) => {
        eventos[itm2.key_venta] = {
          venta: itm,
          evento: tipo_eventos[itm2.tipo_evento.key],
          entradas: [tipo_entradas[itm2.key_item]],
          sectores: [tipo_sectores[itm2.key_item]]
        };
      });
      // ,
      //   eventos[itm.key_venta].entradas = eventos[itm.key_venta].entradas.map(
      //     (itm2) => {
      //       return itm2;
      //     }
      //   )
      // ,
      // eventos[itm.key_venta].sectores = eventos[itm.key_venta].sectores.map(
      //   (itm2) => {
      //     return itm2;
      //   }
      // );
    });
    return eventos;
  };

  static getEntradasporEventosActivos = (props) => {
    var data = Actions.getEventosActivos(props);
    var entradas = tipo_entrada.Actions.getAll(props);
    if (!data) return null;
    if (!entradas) return null;
    var entradasporeventosOk = {};
    var arr = Object.values(data);
    if (!arr) return null;
    arr.map((itm) => {
      entradasporeventosOk[itm.key] = entradas[itm.key];
    });
    return entradasporeventosOk;
  };

  static getByKey = (key, props) => {
    var data = Actions.getAll(props);
    if (!data) return null;
    return data[key];
  };

  static getByKeyEvento = (keyEvento, props) => {
    var data = Actions.getAll(props);
    if (!data) return null;
    return Object.values(data).filter((itm) => itm.key_evento == keyEvento);
  };

  static pago_tarjeta = async (key_venta, data, props) => {
    return SSocket.sendPromise({
      component: Parent.component,
      version: Parent.version,
      type: 'pago_tarjeta',
      estado: 'cargando',
      key_venta: key_venta,
      data: data,
      key_usuario: props.state.usuarioReducer?.usuarioLog?.key,
      data: data
      // }, 30000);
    }, 7 * 60 * 1000);
  };
  static pago_qr = async (key_venta, _props) => {
    const props = _props;
    return new Promise((resolve, reject) => {
      SSocket.sendPromise({
        component: Parent.component,
        version: Parent.version,
        type: 'pago_qr',
        estado: 'cargando',
        key_venta: key_venta,
        key_usuario: props.state.usuarioReducer?.usuarioLog?.key,
        // }, 30000);
      }, 7 * 60 * 1000).then((resp) => {
        props.dispatch({
          component: "orden_pago",
          type: "registro",
          data: resp.data,
          estado: "exito"
        });
        resolve(resp);
      }).catch((e) => {
        reject(e);
      })

    })
  };
  static registro = async (data, _props) => {
    const props = _props;
    return new Promise((resolve, reject) => {
      return SSocket.sendPromise({
        component: Parent.component,
        version: Parent.version,
        type: 'registro',
        estado: 'cargando',
        key_usuario: data.key_usuario ?? props.state.usuarioReducer?.usuarioLog?.key,
        data: data
      }, (7 * 60 * 1000)).then(resp => {
        props.dispatch(resp);
        resolve(resp);
      }).catch((e) => {
        console.log(e);
        reject(e)
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
