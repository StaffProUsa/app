import React, { Component } from 'react';
import {
  SHr,
  SIcon,
  SNavigation,
  SPage,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import PButtomFooter from '../../../Components/PButtomFooter';
// import Carrito from '../Components/Carrito';
// import PButtomFooter from '../../../../../Components/PButtomFooter';

export default class MensajePedidoFueraTiempo extends Component {
  render() {
    return (
      <>
        <SView flex center col={'xs-11 sm-10 md-8 lg-6 xl-4'}>
          <SView col={'xs-12'} center row flex border={'transparent'}>
            <SHr height={20} />
            <SView col={'xs-12'} border={'transparent'}>
              <SText fontSize={24} bold center>
                Pago fuera de tiempo
              </SText>
              <SHr height={20} />
              <SText fontSize={14} center>
                No se pudo completar la compra, pero puedes volver a
                intentarlo
              </SText>
            </SView>
            <SHr height={40} />
            <SView col={'xs-12'} height={220} border={'transparent'} center>
              <SIcon name={'TimeOff'} width={220} fill={STheme.color.text} />
            </SView>
            <SHr height={40} />
          </SView>
        </SView>
        <SHr height={40} />
        <PButtomFooter
          primary
          fontSize={24}
          onPress={() => {
            SNavigation.goBack();
          }}>
          ACEPTAR
        </PButtomFooter>
      </>
    );
  }
}
