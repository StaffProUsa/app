import carrito from '.';
import evento from '../evento';
import sector from '../sector';
import tipo_entrada from '../tipo_entrada';

export default class Actions {
  //muestra los items del carrito

  static getAllSimple(props) {
    var data = props.state.carritoReducer.data;

    if (!data) return null;

    var arr = Object.values(data);
    if (!arr) return null;

    return arr.map((itm) => {
      return {
        key_item: itm.key,
        ...itm
      };
    });
  }

  static getAll(props) {
    var data = props.state.carritoReducer.data;
    var tipo_entradas = tipo_entrada.Actions.getAll(props);
    var tipo_sectores = sector.Actions.getAll(props);
    var eventos = evento.Actions.getAll(props);

    if (!data) return null;
    if (!tipo_entradas) return null;
    if (!tipo_sectores) return null;
    if (!eventos) return null;

    var arr = Object.values(data);
    if (!arr) return null;

    return arr.map((itm) => {
      return {
        ...itm,
        tipo_entrada: tipo_entradas[itm.key],
        tipo_sector: tipo_sectores[itm.key],
        evento: eventos[itm.key_evento]
      };
    });
  }

  //muestra los items por eventos
  static getEventosActivos = (props) => {
    var data = carrito.Actions.getAll(props);
    var eventos = evento.Actions.getAll(props);

    if (!data) return null;
    if (!eventos) return null;

    //borrar eventos duplicados
    var arr = Object.values(data);
    if (!arr) return null;

    var eventos_activos = {};
    arr.map((itm) => {
      // eventos_activos[itm?.tipo_entrada?.key_evento] =  eventos[itm?.tipo_entrada?.key_evento];

      // comparar los eventos de los items tipo_entrada y tipo_sector para ver si estan activos
      if (itm.tipo_entrada) {
        if (eventos[itm.tipo_entrada.key_evento]) {
          eventos_activos[itm.tipo_entrada.key_evento] =
            eventos[itm.tipo_entrada.key_evento];
        }
      }
      if (itm.tipo_sector) {
        if (eventos[itm.tipo_sector.key_evento]) {
          eventos_activos[itm.tipo_sector.key_evento] =
            eventos[itm.tipo_sector.key_evento];
        }
      }
      // } );
      return eventos_activos;
    });

    // console.log('que es ', eventos_activos);

    //mostrar entradas y reservas activas por evento
    var eventos_activos_arr = Object.values(eventos_activos);
    if (!eventos_activos_arr) return null;

    return eventos_activos_arr.map((itm) => {
      return {
        ...itm,
        entradas: arr.filter((itm2) => {
          return (
            itm2?.tipo_entrada?.key_evento === itm?.key &&
            itm2.tipo === 'entrada'
          );
        }),
        sectores: arr.filter((itm2) => {
          return (
            itm2?.tipo_sector?.key_evento === itm?.key && itm2.tipo === 'sector'
          );
        }),

        // cantidad total de entradas y reservas
        cantidad_entradas: arr.filter((itm2) => {
          return (
            itm2?.tipo_entrada?.key_evento === itm?.key &&
            itm2?.tipo === 'entrada'
          );
        }).length,

        cantidad_reservas: arr.filter((itm2) => {
          return (
            itm2?.tipo_sector?.key_evento === itm?.key &&
            itm2?.tipo === 'sector'
          );
        }).length,

        //monto total de entradas del evento
        monto_entradas: arr
          .filter((itm2) => {
            return (
              itm2?.tipo_entrada?.key_evento === itm?.key &&
              itm2?.tipo === 'entrada'
            );
          })
          .reduce((total, itm2) => {
            return (total += itm2?.precio * itm2?.cantidad);
          }, 0),

        //monto total de reservas del evento
        monto_reservas: arr
          .filter((itm2) => {
            return (
              itm2?.tipo_sector?.key_evento === itm?.key &&
              itm2?.tipo === 'sector'
            );
          })
          .reduce((total, itm2) => {
            return (total += itm2?.precio * itm2?.cantidad);
          }, 0),

        //sumar los montos de monto_entradas y monto_reservas
        monto_total:
          arr
            .filter((itm2) => {
              return (
                itm2?.tipo_entrada?.key_evento === itm?.key &&
                itm2?.tipo === 'entrada'
              );
            })
            .reduce((total, itm2) => {
              return (total += itm2?.precio * itm2?.cantidad);
            }, 0) +
          arr
            .filter((itm2) => {
              return (
                itm2?.tipo_sector?.key_evento === itm?.key &&
                itm2?.tipo === 'sector'
              );
            })
            .reduce((total, itm2) => {
              return (total += itm2?.precio * itm2?.cantidad);
            }, 0)
      };
    });
  };

  static getByKey(key, props) {
    var data = props.state.carritoReducer.data;
    if (Object.keys(data).length <= 0) return null;
    var item;
    Object.values(data).map((obj) => {
      if (obj.key == key) {
        item = obj;
      }
    });
    return item;
  }
  static getInfo(props) {
    var data = props.state.carritoReducer.data;
    var total = 0;
    var cantidad = 0;
    Object.keys(data).map((key, index) => {
      total += data[key].precio * data[key].cantidad;
      cantidad += data[key].cantidad;
    });
    return {
      total: total,
      cantidad: cantidad
    };
  }

  static addToCard({ key, precio, tipo, cantidad, key_evento, mesas }, props) {
    var data = props.state.carritoReducer.data;
    var item = data[key];
    if (cantidad <= 0) {
      if (item) {
        delete props.state.carritoReducer.data[item.key];
        props.dispatch({
          component: 'carrito',
          type: 'setState'
        });
        return;
      }
    }
    item = {
      key,
      precio,
      tipo,
      cantidad: cantidad,
      key_evento,
      mesas
    };

    props.state.carritoReducer.data[item.key] = item;
    props.dispatch({
      component: 'carrito',
      type: 'setState'
    });
  }
  static increment({ key, precio, tipo, limit = 1, key_evento }, props) {
    var data = props.state.carritoReducer.data;
    var item = data[key];
    if (item) {
      item.cantidad += 1;
    } else {
      item = {
        key,
        precio,
        tipo,
        cantidad: 1,
        key_evento
      };
    }

    if (!limit) {
      item.cantidad = 0;
      return;
    }
    if (item.cantidad > limit) {
      item.cantidad = limit;
      return;
    }
    props.state.carritoReducer.data[item.key] = item;
    props.dispatch({
      component: 'carrito',
      type: 'setState'
    });
  }
  static decrement({ key }, props) {
    var data = props.state.carritoReducer.data;
    var cantidad = 0;
    var item = data[key];
    if (!item) {
      return;
    }
    if (item) {
      item.cantidad -= 1;
    }

    if (item.cantidad <= 0) {
      delete props.state.carritoReducer.data[item.key];
    }
    props.dispatch({
      component: 'carrito',
      type: 'setState'
    });
  }

  //quitar todos los items del carrito
  static removeAll(props) {
    props.state.carritoReducer.data = {};
    props.dispatch({
      component: 'carrito',
      type: 'setState'
    });
  }
  //quitar un evento de los items del carrito
  static removeEvento(key_evento, props) {
    var data = props.state.carritoReducer.data;
    Object.keys(data).map((key, index) => {
      if (data[key].key_evento == key_evento) {
        delete data[key];
      }
    });
    props.dispatch({
      component: 'carrito',
      type: 'setState'
    });
  }
  //quitar un item de un evento del carrito
  static removeItem(key_item, props) {
    // var data = props.state.carritoReducer.data;
    delete props.state.carritoReducer.data[key_item];
    // delete data[key];

    props.dispatch({
      component: 'carrito',
      type: 'setState'
    });
  }
}
