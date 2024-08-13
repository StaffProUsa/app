import React from 'react';
import { connect } from 'react-redux';

import {
  SHr,
  SIcon,
  SInput,
  SLoad,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import carrito from '../../Services/Casagrandeadmin/Components/carrito';
import Model from '../../Model';

class BoxDetalle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cantidad: 1
    };
    // this.key = SNavigation.getParam("key");
  }

  getEventosActivos() {
    var data = carrito.Actions.getEventosActivos(this.props);
    if (!data) return <SLoad />;
    // console.log(JSON.stringify(data));
    var MontoTotal = 0;

    return Object.keys(data).map((key, index) => {
      var obj = data[key];

      MontoTotal += obj.entradas.precio * obj.entradas.cantidad;
      // console.log('papu ', MontoTotal);

      return (
        <>
          <SView col={'xs-12'} row>
            <SView
              flex
              border={this.bgborder}
              style={{ alignItems: 'flex-start' }}
              center>
              <SView row border={this.bgborder}>
                {/* <SIcon name={'Ticket'} fill={STheme.color.text} width={14} /> */}
                {/* <SView width={5} /> */}
                <SText
                  color={STheme.color.text}
                  font={'Roboto'}
                  fontSize={15}>
                  {obj.descripcion}
                </SText>
              </SView>
            </SView>
          </SView>
          <SView col={'xs-12'} center row>
            <SView col={'xs-0.5'}></SView>
            <SView col={'xs-12'}>
              <SHr height={12} color={this.bgSpace} />
              <SView col={'xs-12'} row center>
                {this.getEntradaBody(obj.entradas)}
                <SHr height={10} color={this.bgSpace} />
                {this.getReservaBody(obj.sectores)}
              </SView>
            </SView>
          </SView>
          {/* <SHr height={1} color={STheme.color.gray} /> */}

          <SHr height={10} color={this.bgSpace} />
        </>
      );
    });
  }



  getEntradaBody(data) {
    if (data.length == 0) return;
    var total = 0;
    Object.keys(data).map((key, index) => {
      var obj = data[key];
      total += obj.precio * obj.cantidad;
    });

    return (
      <>
        <SView col={'xs-12'} height={20} row>
          <SView width={20} height row border={this.bgborder}>
            <SIcon
              name={'Ticket'}
              fill={STheme.color.text}
              height={14}
              width={14}
            />
          </SView>
          <SView flex border={this.bgborder} row>
            <SText
              color={STheme.color.text}
              font={'Roboto'}
              fontSize={15}
              center>
              Entrada
            </SText>
          </SView>
        </SView>
        <SHr height={8} />

        {this.getItem(data)}

        {/* <SHr height={1} color={STheme.color.gray} /> */}
      </>

    );
  }

  getItem(data) {
    if (data.length == 0) return;

    return Object.keys(data).map((key, index) => {
      var obj = data[key];
      return (
        <>
          <SView col={'xs-12'} row>
            <SView flex>
              <SText
                color={STheme.color.text}
                font={'Roboto'}
                fontSize={15}>
                {obj.tipo_entrada.descripcion +
                  ' Bs. ' +
                  obj.precio +
                  ' x ' +
                  obj.cantidad}
              </SText>
            </SView>
            <SView flex style={{ alignItems: 'flex-end' }}>
              <SText
                color={STheme.color.text}
                font={'Roboto'}
                fontSize={15}>
                Bs. {(obj.precio * obj.cantidad).toFixed(2)}
              </SText>
            </SView>
          </SView>
          <SHr height={5} color={this.bgSpace} />
        </>
      );
    });
  }

  getReservaBody(data) {
    if (data.length == 0) return;
    var total = 0;
    Object.keys(data).map((key, index) => {
      var obj = data[key];
      total += obj.precio * obj.cantidad;
    });
    return (
      <>
        <SView col={'xs-12'} height={30} row>
          <SView width={32} height row border={this.bgborder}>
            <SIcon
              name={'Group'}
              fill={STheme.color.text}
              height={27}
              width={25}
            />
          </SView>
          <SView flex border={this.bgborder} row>
            <SText
              color={STheme.color.text}
              font={'Roboto'}
              fontSize={15}
              center>
              Reserva
            </SText>
          </SView>
        </SView>
        <SHr height={8} />
        {this.getItem2(data)}
        {/* <SHr height={1} color={STheme.color.gray} /> */}
      </>
    );
  }

  getItem2(data) {
    if (data.length == 0) return;
    return Object.keys(data).map((key, index) => {
      var obj = data[key];
      return (
        <>
          <SView col={'xs-12'} row>
            <SView flex>
              <SText
                color={STheme.color.text}
                font={'Roboto'}
                fontSize={15}>
                {obj.tipo_sector.descripcion +
                  ' Bs. ' +
                  obj.precio +
                  ' x ' +
                  obj.cantidad}
              </SText>
            </SView>
            <SView center>
              <SText
                color={STheme.color.text}
                font={'Roboto'}
                fontSize={15}>
                Bs. {(obj.precio * obj.cantidad).toFixed(2)}
              </SText>
            </SView>
          </SView>
          <SHr height={10} color={this.bgSpace} />
        </>
      );
    });
  }


  getMontoTotal() {
    var { total } = carrito.Actions.getInfo(this.props);
    return (
      <>
        <SView col={'xs-12'} row>
          <SView flex>
            <SText
              color={STheme.color.text}
              font={'Roboto'}
              fontSize={16}>
              SUB-TOTAL
            </SText>
          </SView>
          <SView flex style={{ alignItems: 'flex-end' }}>
            <SText
              color={STheme.color.text}
              font={'Roboto'}
              fontSize={15}>{`Bs. ${total.toFixed(2)}`}</SText>
          </SView>
        </SView>
      </>
    );
  }
  getMontoDescuento() {
    var { total } = carrito.Actions.getInfo(this.props);
    const permisoDescuento = Model.usuarioPage.Action.getPermiso({
      url: "admin/venta",
      permiso: "descuento",
      loading: ""
    })
    return (
      <>
        <SView col={'xs-12'} row>
          <SView flex>
            <SText
              color={STheme.color.text}
              font={'Roboto'}
              fontSize={16}>
              DESCUENTO
            </SText>
          </SView>
          <SView flex style={{ alignItems: 'flex-end' }}>
            {/* <SText
              color={STheme.color.text}
              font={'Roboto'}
              fontSize={15}>{`Bs. ${total.toFixed(2)}`}</SText> */}
            <SInput customStyle={"clean"} style={{
              color: STheme.color.danger,
              fontSize: 14,
              // backgroundColor:STheme.color.card
            }} editable={!!permisoDescuento} type='money' card={!!permisoDescuento} onChangeText={(e) => {
              if (e) {
                const val = parseFloat(e);
                if (total - e <= 0) {
                  this.setState({ descuento: parseFloat(total).toFixed(2) })
                  return parseFloat(total).toFixed(2);
                }
                this.setState({ descuento: val })
              }
            }} />
          </SView>
        </SView>
      </>
    );
  }

  getMontoTotalConDescuento() {
    var { total } = carrito.Actions.getInfo(this.props);
    return (
      <>
        <SView col={'xs-12'} row>
          <SView flex>
            <SText
              color={STheme.color.text}
              font={'Roboto'}
              fontSize={16}>
              TOTAL
            </SText>
          </SView>
          <SView flex style={{ alignItems: 'flex-end' }}>
            <SText
              color={STheme.color.text}
              font={'Roboto'}
              fontSize={15}>{`Bs. ${(total - (this.state.descuento ?? 0)).toFixed(2)}`}</SText>
          </SView>
        </SView>
      </>
    );
  }
  render() {

    return (
      <>
        <SView col={'xs-12'}>
          <SText color={STheme.color.text} font={'Roboto'} fontSize={20}>
            Detalle carrito
          </SText>
          <SHr height={20} color={this.bgSpace} />
        </SView>
        <SHr height={4} color={this.bgSpace} />
        <SView col={'xs-12'}>
          {this.getEventosActivos()}
        </SView>
        <SHr height={1} color={STheme.color.gray} />
        <SHr height={16} color={this.bgSpace} />
        {this.getMontoTotal()}
        <SHr height={16} color={this.bgSpace} />
        {this.getMontoDescuento()}
        <SHr height={16} color={this.bgSpace} />
        {this.getMontoTotalConDescuento()}
        <SHr height={30} color={this.bgSpace} />
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(BoxDetalle);
