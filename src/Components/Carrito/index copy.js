import React from 'react';
import { connect } from 'react-redux';

import {
  SGradient,
  SIcon,
  SNavigation,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import carrito from '../../Services/Casagrandeadmin/Components/carrito';

class Carrito extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cantidad: 1
    };
    // this.key = SNavigation.getParam("key");
  }

  getDetalle() {
    var data = carrito.Actions.getAll(this.props);
    return <SText col={'xs-12'}>{JSON.stringify(data, '\n', '\t')}</SText>;
  }

  render() {
    var total = 0;
    var cantidad = 0;
    var { total, cantidad } = carrito.Actions.getInfo(this.props);

    return (
      <>
        {/* <SView row border={STheme.color.warning}
          style={{
            width: 400, height: 500, position: "absolute", top: 90, right: 0,
            // borderTopLeftRadius: 230, borderBottomLeftRadius: 230,
            overflow: "hidden"
          }}
          onPress={() => { SNavigation.navigate('carrito/detalle'); }} >

          {this.getDetalle()}
        </SView> */}

        <SView
          center
          row
          style={{
            width: 117,
            height: 52,
            position: 'absolute',
            bottom: 90,
            right: 0,
            borderTopLeftRadius: 230,
            borderBottomLeftRadius: 230,
            overflow: 'hidden',
            ...(this.props.style ?? {})
          }}
          onPress={() => {
            // if (cantidad == 0) { //ddd
            //   SNavigation.navigate('carrito/detalle');
            // } else {
            //   SNavigation.navigate('carrito/detalle');
            // }
            cantidad == 0
              ? SNavigation.navigate('carrito/mensajeCarritoVacio')
              : SNavigation.navigate('/carrito');
          }}>
          {/* <SIcon name={'BgCart'} style={{ width: '100%', height: '100%', position: "absolute" }} /> */}
          <SGradient
            colors={['#A9A9A9', '#222222']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          />
          <SView
            flex
            center
            height
            border={'transparent'}
            style={{ alignItems: 'flex-end' }}>
            <SIcon
              name={'Cart'}
              height={29}
              width={29}
              fill={STheme.color.white}
            />
          </SView>
          <SView col={'xs-8'} center height border={'transparent'}>
            {/* <SText fontSize={12} color={'white'} font={"LondonMM"}   >{`Bs. ${total.toFixed(2)}`}</SText> */}
            <SText
              fontSize={11}
              color={STheme.color.white}
              font={'Roboto'}
              bold>{`Bs. ${total.toFixed(2)}`}</SText>
            {/* <SText fontSize={12} color={'#ffffffbb'} font={"LondonMM"} bold >{cantidad} items</SText> */}
            <SText
              fontSize={12}
              color={STheme.color.white}
              font={'Roboto'}
              bold>
              {cantidad} items
            </SText>
          </SView>
        </SView>
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Carrito);
