import React, { Component } from 'react';
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

export default class MensajeIniciarSesion extends Component {
  render() {
    return (
      <>
        <SPage center disableScroll>
          <SView flex center col={'xs-11 sm-10 md-8 lg-6 xl-4'}>
            <SView col={'xs-12'} center row flex border={'transparent'}>
              <SHr height={20} />
              <SView col={'xs-12'} border={'transparent'}>
                <SText fontSize={24} bold center>
                  No hay información para mostrar
                </SText>
                <SHr height={20} />
                <SText fontSize={14} center>
                  Necesitas iniciar sesión para ver un historial de tus entradas adquiridas.
                </SText>
              </SView>
              <SHr height={40} />
              <SView col={'xs-12'} height={220} border={'transparent'} center>
                <SIcon
                  name={'Sesion'}
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
            SNavigation.navigate('/login');
          }}>
          INICIAR SESIÓN
        </PButtomFooter>
      </>
    );
  }
}
