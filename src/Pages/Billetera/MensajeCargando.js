import React from 'react';
import { connect } from 'react-redux';
import {
  SHr,
  SIcon,
  SNavigation,
  SPage,
  SStorage,
  SText,
  STheme,
  SView,
  SLoad
} from 'servisofts-component';
import Tarjeta from '../../Services/Casagrandeadmin/Components/tarjeta';
import Venta from '../../Services/Casagrandeadmin/Components/venta';



class MensajeCargando extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var reducer = this.props.state[Venta.component + 'Reducer'];
    console.log(reducer)
    if (reducer.type == 'pago_tarjeta' || reducer.type == 'registro') {
      if (reducer.estado == 'exito') {
        reducer.estado = '';
        SNavigation.navigate('billetera/mensajePedidoExitoso');
      }
    }
    return (
      <>
        <SPage center disableScroll>
          <SView flex center col={'xs-11 sm-10 md-8 lg-6 xl-4'}>
            <SView col={'xs-12'} center row flex border={'transparent'}>
              <SHr height={20} />
              <SView col={'xs-12'} border={'transparent'}>
                <SText fontSize={24} bold center>
                  Cargando...
                </SText>
                <SHr height={20} />
                <SText fontSize={14} center>
                  Por favor espere, estamos procesando la infomación
                </SText>
              </SView>
              <SHr height={40} />
              <SView col={'xs-12'} height={220} border={'transparent'} center>
                {/* <SIcon
                  name={'PedidoExito'}
                  width={200}
                  fill={STheme.color.text}
                /> */}
                <SLoad />
              </SView>
              <SHr height={40} />
            </SView>
          </SView>
          <SHr height={40} />
        </SPage>
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(MensajeCargando);
