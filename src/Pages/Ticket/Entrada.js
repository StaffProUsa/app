import React from 'react';
import { connect } from 'react-redux';

import {
  SDate,
  SHr,
  SIcon,
  SImage,
  SLoad,
  SNavigation,
  SOrdenador,
  SPage,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Carrito from '../../Components/Carrito';
import carrito from '../../Services/Casagrandeadmin/Components/carrito';
import evento from '../../Services/Casagrandeadmin/Components/evento';
import tipo_entrada from '../../Services/Casagrandeadmin/Components/tipo_entrada';
import actividad from '../../Services/Casagrandeadmin/Components/actividad';
import ContadorMasMenos from '../../Components/ContadorMasMenos';
import ImageBlur from '../../Components/ImageBlur';
import { Container } from '../../Components';

class Entrada extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cantidad: 0
    };
    this.key = SNavigation.getParam('key');
  }

  getTipoentrada() {
    const data = tipo_entrada.Actions.getByKeyEvento(this.key, this.props);
    if (!data) return <SLoad />;
    const dataOrdenada = data.sort((a, b) => {
      return b.precio - a.precio;
    });
    return Object.keys(dataOrdenada).map((key, index) => {
      var obj = data[key];

      return (
        <>
          <SView col={'xs-12'} center border={'transparent'} height={40}>
            <SView col={'xs-12'} row border={'transparent'} center>
              <SView col={'xs-1.5'} row>
                {/* <SView
                  width={22}
                  height={22}
                  backgroundColor={STheme.color.gray}
                  style={{ borderRadius: 5 }}></SView> */}
                <SView width={10} />
                <SIcon
                  name={'List'}
                  width={12}
                  fill={STheme.color.accent}
                />
              </SView>
              <SView col={'xs-3'} border={'transparent'}>
                <SText fontSize={15}>{obj.descripcion}</SText>
              </SView>
              <SView col={'xs-3.5'} border={'transparent'}>
                <SText>{obj.precio} Bs.</SText>
              </SView>
              <ContadorMasMenos max={obj["cantidad"] ?? 0} defaultValue={carrito.Actions.getByKey(obj.key, this.props)
                ?.cantidad ?? 0} onChange={(val) => {
                  carrito.Actions.addToCard(
                    {
                      key: obj.key,
                      precio: obj.precio,
                      tipo: 'entrada',
                      cantidad: val,
                      key_evento: this.key
                    },
                    this.props
                  );
                }} />

            </SView>
            {/* <SText>Disponibles {obj.cantidad}</SText> */}
            <SHr height={15} />
          </SView>
        </>
      );
    });
  }

  body() {
    var data = evento.Actions.getByKey(this.key, this.props);
    var data_actividad = actividad.Actions.getByKeyEvento(this.key, this.props);

    if (!data) return <SLoad />;
    if (!data_actividad) return <SLoad />;
    if (!this.state.foto_id) {

      this.state.foto_id = new SOrdenador([{ key: "fecha_on", order: "asc", peso: 1 }]).ordenarArray(data_actividad)[0]?.key;
    }
    return (
      <>
        <SView
          col={'xs-11'}
          backgroundColor={STheme.color.card}
          center
          style={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderTopWidth: 1,
            borderTopColor: '#eeeeee'
          }}>
          <SHr height={20} />
          <SText fontSize={17}>ENTRADAS</SText>
          <SHr height={10} />
          <SView
            col={'xs-9'}
            height={2}
            backgroundColor={STheme.color.accent}></SView>
          <SHr height={10} />
          <SText center fontSize={26}>{data.descripcion}</SText>
          <SHr height={5} />
          <SText fontSize={13}>
            {new SDate(data.fecha, 'yyyy-MM-dd').toString('DAY, dd de MONTH')}
          </SText>
          <SHr height={10} />
        </SView>
        <SView col={'xs-12 md-11'}>
          <ImageBlur src={SSocket.api.root + 'actividad/' + this.state.foto_id} height={380} />
        </SView>
      </>
    );
  }

  getBtnFooter() {
    var { total, cantidad } = carrito.Actions.getInfo(this.props);
    if (!cantidad) return null;
    return (
      <>
        <SView
          col={'xs-12 '}
          center
          height={70}
          style={{ bottom: 0 }}
          backgroundColor={STheme.color.primary}
          onPress={() => {
            cantidad == 0
              ? SNavigation.navigate('carrito/mensajeCarritoVacio')
              : SNavigation.navigate('/carrito');
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
                  COMPRAR
                </SText>
              </SView>
            </SView>
          </Container>
        </SView>
      </>
    );
  }

  render() {
    // var data = tipo_entrada.Actions.getAll(this.props);
    // if (!data) return <SLoad />;

    return (
      <>
        <SPage  >
          <SView col={'xs-12'} center>
            <SView
              col={'xs-12 sm-12 md-10 lg-8 xl-6'}
              center
              backgroundColor={'transparent'}>
              <SHr height={20}></SHr>
              {this.body()}
              <SView
                col={'xs-11'}
                backgroundColor={STheme.color.card}
                style={{
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eeeeee'
                }} center>
                <SView col={'xs-11'} flex>
                  <SHr height={20} />
                  <SText fontSize={18}>Precios</SText>
                  <SHr height={10} />
                  {this.getTipoentrada()}
                  <SHr height={20} />
                </SView>
                <SView col={'xs-11'}></SView>
              </SView>
            </SView>
          </SView>
          <SHr height={40} />
        </SPage>
        {this.getBtnFooter()}
        {/* <Carrito
          bottom={300}
        /> */}
      </>
    );
  }
}

const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Entrada);
