import React, {Component} from 'react';
import {
  SHr,
  SIcon,
  SNavigation,
  SPage,
  SStorage,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import PButtomFooter from '../../Components/PButtomFooter';
// import Carrito from '../Components/Carrito';
// import PButtomFooter from '../../../../../Components/PButtomFooter';

export default class MensajePedidoExitoso extends Component {
  render() {
    return (
      <>
        <SPage center disableScroll>
          <SView flex center col={'xs-11 sm-10 md-8 lg-6 xl-4'}>
            <SView col={'xs-12'} center row flex border={'transparent'}>
              <SHr height={20} />
              <SView col={'xs-12'} border={'transparent'} center>
                <SText fontSize={24} bold center>
                  Su pedido fue realizado exitosamente
                </SText>
                <SHr height={10} />
                <SIcon
                  name={'Bien'}
                  width={80}
                  fill={STheme.color.text}
                />
                <SHr height={10} />
                <SText fontSize={14} center>
                  ¡Muchas gracias por su compra!
                </SText>
                <SText fontSize={14} center>
                  Disfrute del evento...
                </SText>
              </SView>
              <SHr height={30} />
              <SView col={'xs-12'} height={220} border={'transparent'} center>
                <SIcon
                  name={'PedidoExito'}
                  width={200}
                  fill={STheme.color.text}
                />
              </SView>
              <SHr height={40} />
            </SView>
          </SView>
          <SHr height={40} />
        </SPage>
        <PButtomFooter
          primary
          fontSize={24}
          onPress={() => {
            SStorage.removeItem('carritoReducer'); //datos carrito
            // this.props.dispatch({ type: "CARRITO_FINALIZAR" });
            SNavigation.navigate('/');
          }}>
          ACEPTAR
        </PButtomFooter>
      </>
    );
  }
}
