import React from 'react';
import { connect } from 'react-redux';
import {
  SDate,
  SHr,
  SIcon,
  SLoad,
  SNavigation,
  SPage,
  SText,
  STheme,
  SView,
  SPopup,
  SUtil
} from 'servisofts-component';
import PFecha from '../../Components/PFecha';
import carrito from '../../Services/Casagrandeadmin/Components/carrito';
import usuario from '../../Services/Usuario/Components/usuario';
import { Container } from '../../Components';

class Detalle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.bgSpace = 'transparent';
    this.bgborder = 'transparent';
  }

  getHeader() {
    return (
      <>
        <SView col={'xs-11'} row center height={30}>
          <SView
            flex
            height
            row
            center
            style={{ justifyContent: 'flex-end' }}
            border={this.bgborder}>
            <SText
              color={STheme.color.text}
              font={'Roboto'}
              fontSize={24}>
              CARRITO
            </SText>
          </SView>
        </SView>
      </>
    );
  }

  getEventosActivos() {
    var data = carrito.Actions.getEventosActivos(this.props);
    if (!data) return <SLoad />;

    var MontoTotal = 0;
    // console.log('alvaroski ', data);

    return Object.keys(data).map((key, index) => {
      var obj = data[key];

      MontoTotal += obj.entradas.precio * obj.entradas.cantidad;
      MontoTotal += obj.sectores.precio * obj.sectores.cantidad;

      return (
        <>
          <SView
            col={'xs-11'}
            backgroundColor={STheme.color.card}
            style={{ borderRadius: 16 }}
            center>
            <PFecha
              dia={new SDate(obj.fecha).toString('dd')}
              mes={new SDate(obj.fecha).toString('MONTH')}
              backgroundColor={STheme.color.secondary}
              position='top'
              spacing={25}
              onPress={() => {
                this.botonEliminar(obj.key);
              }}
            />

            <SView col={'xs-11.5'}>
              <SView width={30} height={30}
                style={{ top: -15, left: -15 }}
                onPress={() => {
                  carrito.Actions.removeEvento(obj.key, this.props);
                }}
              >
                <SIcon name={'DeleteCars'} fill={STheme.color.primary} width={30} height={30} />
              </SView>
              {/* <SHr height={5} color={this.bgSpace} /> */}
              <SView col={'xs-12'} style={{ top: -5 }}>
                <SText
                  color={STheme.color.text}
                  font={'Roboto'}
                  fontSize={16}>
                  {obj.descripcion}
                </SText>
                <SText
                  col={'xs-9'}
                  color={STheme.color.gray}
                  font={'Roboto'}
                  fontSize={11}>
                  {SUtil.limitString(obj.observacion, 80)}
                </SText>
              </SView>

              <SHr height={4} color={this.bgSpace} />
              {/* <SHr height={15} /> */}
              <SView col={'xs-12'} row center>
                {this.getEntrada(obj.entradas)}
                <SHr height={16} color={this.bgSpace} />
                {this.getReserva(obj.sectores)}
                <SView col={'xs-12'} row>
                  <SView flex border={this.bgborder} style={{ alignItems: 'flex-end' }}>
                    <SView col={'xs-1'} backgroundColor={this.bgSpace} />
                    <SText
                      color={STheme.color.text}
                      font={'Roboto-Bold'}
                      fontSize={15}>
                      TOTAL Bs. {obj.monto_total.toFixed(2)}
                    </SText>
                  </SView>
                  {/* <SView
                    flex
                    border={'transparent'}
                    style={{justifyContent: 'flex-end', top: 10}}
                    row
                    center>
                    <SView
                    center
                      width={90}
                      height={30}
                      style={{
                        borderRadius: 6,
                        backgroundColor: STheme.color.primary
                      }}
                      onPress={() => {
                        carrito.Actions.removeEvento(obj.key, this.props);
                      }}>
                      <SText color={STheme.color.secondary} center>
                        Eliminar
                      </SText>
                    </SView>
                  </SView> */}
                </SView>
                <SHr height={20} color={this.bgSpace} />
              </SView>
            </SView>
          </SView>
          <SHr height={34} color={this.bgSpace} />
        </>
      );
    });
  }

  getItem(data) {
    if (data.length == 0) return;

    return Object.keys(data).map((key, index) => {
      var obj = data[key];
      return (
        <>
          <SView col={'xs-12'} border={'transparent'} row center>
            <SView col={'xs-1'} border={'transparent'} row height>
              <SView
                width={20}
                height
                style={{ justifyContent: 'flex-start' }}
                row
                center
                border={'transparent'}
                onPress={() => {
                  carrito.Actions.removeItem(obj.key, this.props);
                }}>
                <SIcon
                  name={'IconBtnMinus'}
                  fill={STheme.color.primary}
                  stroke={STheme.color.secondary}
                  height={15}
                  width={15}
                />
              </SView>
            </SView>
            <SView col={'xs-7'} border={'transparent'}  >
              <SText
                color={STheme.color.text}
                font={'Roboto'}
                fontSize={14}
              >
                {obj.tipo_entrada.descripcion +
                  ' Bs. ' +
                  obj.precio +
                  ' x ' +
                  obj.cantidad}
              </SText>
            </SView>
            {/* <SView col={'xs-0.5'} border={'transparent'} row height /> */}
            <SView col={'xs-4'} border={'transparent'} flex height style={{ alignItems: "flex-end" }}>
              <SText
                color={STheme.color.text}
                font={'Roboto'}
                center
                fontSize={14}>
                Bs. {(obj.precio * obj.cantidad).toFixed(2)}
              </SText>
            </SView>
          </SView>

          {/* </SView > */}
          <SHr height={10} color={this.bgSpace} />
        </>
      );
    });
  }
  getItem2(data) {
    if (data.length == 0) return;
    return Object.keys(data).map((key, index) => {
      var obj = data[key];
      return (
        <>
          <SView col={'xs-12'} row center>
            <SView col={'xs-1'} row height>
              <SView
                width={20}
                height
                style={{ justifyContent: 'flex-start' }}
                row
                center
                border={'transparent'}
                onPress={() => {
                  carrito.Actions.removeItem(obj.key, this.props);
                }}>
                <SIcon
                  name={'IconBtnMinus'}
                  fill={STheme.color.primary}
                  stroke={STheme.color.secondary}
                  height={15}
                  width={15}
                />
              </SView>
            </SView>
            <SView col={'xs-7'} >
              <SText
                color={STheme.color.text}
                font={'Roboto'}
                fontSize={14}
              >
                {obj.tipo_sector.descripcion +
                  ' Bs. ' +
                  obj.precio +
                  ' x ' +
                  obj.cantidad}
              </SText>
            </SView>

            <SView col={'xs-4'} flex height style={{ alignItems: "flex-end" }}>
              <SText
                color={STheme.color.text}
                font={'Roboto'}
                fontSize={14}>
                Bs. {(obj.precio * obj.cantidad).toFixed(2)}
              </SText>
            </SView>
          </SView>
          <SHr height={10} color={this.bgSpace} />
        </>
      );
    });
  }

  getEntrada(data) {
    if (data.length == 0) return;
    var total = 0;
    Object.keys(data).map((key, index) => {
      var obj = data[key];
      total += obj.precio * obj.cantidad;
    });
    return (
      <>
        <SHr height={15} />
        <SView col={'xs-12'} height={30} row>
          <SView width={30} height row border={this.bgborder}>
            <SIcon
              name={'Ticket'}
              fill={STheme.color.text}
              height={25}
              width={25}
            />
          </SView>
          <SView flex border={this.bgborder} row>
            <SText
              color={STheme.color.text}
              font={'Roboto'}
              fontSize={14}
              center>
              Entradas
            </SText>
          </SView>
        </SView>
        <SHr height={12} />

        {this.getItem(data)}

        <SHr height={1} color={STheme.color.gray} />
        <SHr height={3} />
        <SView col={'xs-12'} row>
          <SView flex />
          <SView flex style={{ alignItems: "flex-end" }}>
            <SHr height={10} />
            <SText
              color={STheme.color.text}
              font={'Roboto'}
              fontSize={14}>
              Bs. {total.toFixed(2)}
            </SText>
          </SView>
        </SView>
      </>
    );
  }

  getReserva(data) {
    if (data.length == 0) return;
    var total = 0;
    Object.keys(data).map((key, index) => {
      var obj = data[key];
      total += obj.precio * obj.cantidad;
    });
    return (
      <>
        <SView col={'xs-12'} height={30} row>
          <SView width={30} height row border={this.bgborder}>
            <SIcon
              name={'Group'}
              fill={STheme.color.text}
              height={25}
              width={25}
            />
          </SView>
          <SView flex border={this.bgborder} row>
            <SText
              color={STheme.color.text}
              font={'Roboto'}
              fontSize={14}
              center>
              Reserva
            </SText>
          </SView>
        </SView>
        <SHr height={8} />
        {this.getItem2(data)}
        <SHr height={1} color={STheme.color.gray} />
        <SHr height={3} />
        <SView col={'xs-12'} row>
          <SView flex />
          <SView flex style={{ alignItems: "flex-end" }}>
            <SText
              color={STheme.color.text}
              font={'Roboto'}
              fontSize={14}>{`Bs. ${total.toFixed(2)}`}</SText>
          </SView>
        </SView>
        <SHr height={16} color={this.bgSpace} />
      </>
    );
  }

  getBtnFooter() {
    var total = 0;
    var { total, cantidad } = carrito.Actions.getInfo(this.props);
    return (
      <>
        <SView
          SView
          col={'xs-12 '}
          center
          height={70}
          style={{ bottom: 0 }}
          backgroundColor={STheme.color.primary}
          onPress={() => {
            var url = SNavigation.lastRoute;
            console.log('url', url);

            if (!usuario.Actions.validateSession(this.props, true)) {
              // SPopup.alert(
              //   'Debe iniciar sesión para poder realizar la compra.'
              // );
              SNavigation.navigate('/login', { ruta: url });
            } else {
              SNavigation.navigate('carrito/confirmar');
            }
          }}>
          <Container>
            <SView col={'xs-12'} row center>
              <SView flex height={40} border={this.bgborder}>
                <SText
                  color={STheme.color.secondary}
                  font={'Roboto'}
                  fontSize={15}>{`${cantidad} items`}</SText>
                <SText
                  color={STheme.color.secondary}
                  font={'Roboto'}
                  fontSize={22}>{`Bs. ${total.toFixed(2)}`}</SText>
              </SView>
              <SView flex padding={5} style={{
                backgroundColor: STheme.color.secondary,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#eeeeee',
              }}>
                <SText
                  center
                  color={STheme.color.text}
                  font={'Roboto'}
                  fontSize={24}>
                  PAGAR
                </SText>
              </SView>
            </SView>
          </Container>
        </SView>
      </>
    );
  }

  render() {
    //ricky hay que ver otra opcion mejor
    // var {total, cantidad} = carrito.Actions.getInfo(this.props);
    // cantidad == 0 ? SNavigation.replace('carrito/mensajeCarritoVacio')
    //   : SNavigation.navigate('carrito/detalle');

    return (
      <>
        <SPage title={''}>
          <SView col={'xs-12'} center>
            <SView
              col={'xs-12 sm-12 md-12 lg-8 xl-6'}
              row
              center
              backgroundColor={'transparent'}>
              {/* {this.getHeader()} */}
              <SHr height={27} color={this.bgSpace} />
              {this.getEventosActivos()}
              <SHr height={27} color={this.bgSpace} />
            </SView>
          </SView>
        </SPage>
        {this.getBtnFooter()}
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Detalle);
