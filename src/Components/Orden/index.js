import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  SNavigation
} from 'servisofts-component';
import Orden from '../../Services/Casagrandeadmin/Components/orden_pago';

class VerificarOrden extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //FALTA PULIR ORDEN NO ME ACTUALIZA AL CAMBIO DE ESTADO 1 O 2
  render() {
    const data_orden = Orden.Actions.getAll(this.props.key_venta, this.props);
    if (!data_orden) return null;
    let arr_ordenes = Object.values(data_orden);

    // let datasTarjetas = Object.values(data_orden).filter((itm) => itm?.type == "CYBERSOURCE");
    let datasTarjetas = Object.values(data_orden);
    // console.log(arr_ordenes)
    if (datasTarjetas.length > 0) {
      let pagoExito = Object.values(datasTarjetas).filter((itm) => itm?.estado == 2,);
      // console.log(pagoExito + " pagos ok");
      let pagoFallido = Object.values(datasTarjetas).filter((itm) => itm?.estado == 1);
      if (pagoExito.length > 0) SNavigation.replace('billetera/viewbox');
      if (pagoFallido.length > 0) SNavigation.replace('billetera/mensajePedidoError');

    }


    return null;
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(VerificarOrden);
