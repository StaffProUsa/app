import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SText, SView } from 'servisofts-component';
import MensajePedidoFueraTiempo from '../Components/MensajePedidoFueraTiempo';
export default class timeout_reserva extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return <SView col={"xs-12"} flex center>
      {/* <SText>timeout_reserva</SText> */}
      <MensajePedidoFueraTiempo />
    </SView>
  }
}
