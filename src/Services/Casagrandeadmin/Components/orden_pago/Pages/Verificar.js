import React from 'react';
import { connect } from 'react-redux';

import {
  SGradient,
  SIcon,
  SNavigation,
  SText,
  STheme,
  SView,
  SLoad,
  SHr
} from 'servisofts-component';
import Orden from '../'
import Venta from '../../venta'


class VerificarOrden extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cantidad: 1
    };
    this.key_venta = SNavigation.getParam("key");
  }

  render() {
    const reducerVenta = this.props.state[Venta.component + 'Reducer'];
    console.log(reducerVenta)
    if (reducerVenta.type == 'pago_tarjeta' || reducerVenta.type == 'registro') {
      if (reducerVenta.estado == 'exito') {
        reducerVenta.estado = '';
        alert("OKKKKK venta")
      }

    }

    const reducer = this.props.state[Orden.component + 'Reducer'];
    console.log(reducer)
    if (reducer.type == 'getAll' || reducer.type == 'registro') {
      if (reducer.estado == 'exito') {
        reducer.estado = '';
        alert("OKKKKK orden")
      }

    }

    const data_orden = Orden.Actions.getAll(this.key_venta, this.props);
    if (!data_orden) return <SLoad />;
    let arr_ordenes = Object.values(data_orden);
    console.log(arr_ordenes)


    return (
      <>
        <SHr height={30} />
        <SText fontSize={20} center>Cargando...</SText>
        <SHr height={10} />
        <SLoad />
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(VerificarOrden);
