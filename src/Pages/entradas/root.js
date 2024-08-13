import React from 'react';
import { connect } from 'react-redux';
import {
  SDate,
  SHr,
  SIcon,
  SImage,
  SList,
  SLoad,
  SMath,
  SNavigation,
  SPage,
  SScrollView2,
  SText,
  STheme,
  SView,
  SButtom,
  SThread
} from 'servisofts-component';

import PBarraFooter from '../../Components/PBarraFooter';

import venta from '../../Services/Casagrandeadmin/Components/venta';

import Carrito from '../../Components/Carrito';
import Usuario from '../../Services/Usuario/Components/usuario';
import PButtom from '../../Components/PButtom';
import { Container } from '../../Components';
import ListaDeEntradas from './Components/ListaDeEntradas';
import Model from '../../Model';
import { FlatList, RefreshControl, ScrollView, View } from 'react-native';
import ListaMesas from './Components/ListaMesas';

const generateQr = 'aG9sYSBtdW5kbw';
const RenderItem = (obj) => {
  var eventos = {};
  obj.detalle.map((det) => {
    eventos[det?.tipo_evento?.key] = det.tipo_evento;
  });

  let colorState = STheme.color.warning;
  if (obj.state == "pagado") colorState = STheme.color.success
  return (
    <SView
      col={'xs-12'}
      row
      card
      style={{
        padding: 8,
        overflow: "hidden"
      }}
      onPress={() => {
        SNavigation.navigate('/venta', { key: obj.key });
        // switch (obj.state) {
        //   case "pagado":
        //     // SNavigation.navigate('evento/qr', { key: obj.key });
        //     return;
        //   default:
        //     SNavigation.navigate('evento/qr', { key: obj.key });
        //     return;
        // }

      }}>
      <SHr />
      <SView row col={'xs-12'}>

        <SView row center col={"xs-12"} style={{
          justifyContent: "flex-start"
        }}>
          <SText fontSize={10} color={STheme.color.gray}>
            R. Social:{' '}
          </SText>
          <SText fontSize={12}>{obj.razon_social ?? 'S/N'}</SText>
        </SView>
      </SView>

      <SHr />
      <SView col={'xs-12'}>
        <SHr />
        {Object.values(eventos).map((evt => {
          var entradas = obj.detalle.filter(
            (a) => a.tipo_evento?.key == evt?.key
          );
          return (
            <SView col={'xs-12'} key={evt?.key}>
              <SView col={"xs-12"} row>
                <SText fontSize={14} bold>
                  {evt?.descripcion}
                </SText>
              </SView>
              <SHr />
              <SList
                data={entradas}
                render={(entr) => {
                  var descripcion = '';
                  var icon = 'Ticket';
                  var tipo = '';
                  if (entr.tipo == 'entrada') {
                    icon = 'Ticket';
                    tipo = 'Entrada';
                    descripcion = entr.tipo_entrada?.descripcion;
                  } else if (entr.tipo == 'sector') {
                    descripcion = entr.tipo_sector?.descripcion;
                    tipo = 'Reserva';
                    icon = 'Group';
                  }
                  return (
                    <SView row center>
                      <SIcon
                        name={icon}
                        fill={STheme.color.gray}
                        width={14}
                      />
                      <SView width={16} />
                      <SText bold>{entr.cantidad} x </SText>
                      <SText color={STheme.color.gray} fontSize={12}>
                        {' '}
                        Bs.{SMath.formatMoney(entr.precio)}
                      </SText>
                      <SView width={16} />
                      <SView flex row center>
                        <SText col={'xs-12'} center>
                          {tipo} {descripcion}
                        </SText>
                      </SView>
                      <SView width={16} />
                      <SText color={STheme.color.gray}>
                        Bs.
                        {SMath.formatMoney(
                          entr.precio * entr.cantidad
                        )}
                      </SText>
                      <SHr height={4} />
                      <SHr height={1} color={STheme.color.card} />
                    </SView>
                  );
                }}
              />
              <SHr />
            </SView>
          );
        }))}
        <SHr />
        <SView row col={'xs-12'} style={{ justifyContent: 'flex-end' }}>
          <SText fontSize={10} color={STheme.color.gray}>
            {new SDate(obj.fecha_on).toString('DAY dd de MONTH del yyyy a las HH')}
          </SText>
          <SView flex />
          <SText>
            Total:{'\t'}

          </SText>
          <SText bold fontSize={14}>
            Bs.{SMath.formatMoney(obj.total)}
          </SText>
        </SView>
      </SView>
      <SHr />
      {obj.state == "pendiente" ? <SLoad color={colorState} type='bar' /> : null}

      <SView
        width={60}
        height={60}
        style={{
          position: 'absolute',
          right: -5,
          top: -5,
          borderRadius: 100,
          borderTopRightRadius: 0,
          backgroundColor: STheme.color.secondary,
          borderBottomWidth: 1,
          borderLeftWidth: 1,
          borderColor: colorState
        }}
        center>
        <SText col={'xs-11'} bold fontSize={10} color={colorState} center style={{
          transform: []
        }}>
          {obj.state ?? "Pendiente de pago"}
        </SText>
      </SView>
    </SView >
  );
}


class Entradas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foto_id: 0,
      page: "entradas"
    };

  }
  componentDidMount() {
    this.close = false;
    if (!Model.usuario.Action.getKey()) {
      SNavigation.replace("mensajeIniciarSesion")
    }
    new SThread(100, "asdasd", true).start(() => {

      this.setState({ ready: true })
    })
  }
  handleRefresh(){
    venta.Actions._getReducer(this.props).data = null;
    this.setState({...this.state})
  }
  getCompras() {
    var data = venta.Actions.getByKeyUsuario(
      this.props.state.usuarioReducer.usuarioLog.key,
      this.props
    );
    if (!data) return <SLoad />;
    if (data.length == 0) {
      return (
        <SView col={'xs-12 '} center >
          <SHr height={100} />
          <SText fontSize={18} font={'Roboto'}>
            No hay información de compra para mostrar
          </SText>
          <SHr height={30} />
          {/* <SView col={"xs-8 "}> */}
          <SIcon name={'SinEntrada'} fill={STheme.color.text} width={200} height={200} />
          {/* </SView> */}
          <SHr height={30} />
          <PButtom
            primary
            small
            fontSize={13}
            onPress={() => {
              SNavigation.navigate('/');
            }}>
            COMPRAR
          </PButtom>
        </SView>
      );
    }

    const dataSort = Object.values(data)
      .sort((a, b) => new SDate(a.fecha_on, "yyyy-MM-ddThh:mm:ss").getTime() > new SDate(b.fecha_on, "yyyy-MM-ddThh:mm:ss").getTime() ? -1 : 1)

    return <FlatList
      data={dataSort}
      refreshing
      refreshControl={
        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleRefresh.bind(this)} />
      }
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      ListFooterComponent={() => <View style={{ height: 150 }} />}
      renderItem={props => RenderItem(props.item)}
    />
    // return (
    //   <ScrollView contentContainerStyle={{
    //     width:
    //   }}>
    //     <SList
    //       data={data}
    //       space={16}
    //       limit={5}
    //       order={[{ key: 'fecha_on', order: 'desc' }]}
    //       filter={a => a.state == "pendiente" || a.state == "pagado"}
    //       render={RenderItem.bind(this)}
    //     />
    //     <SHr height={150} />
    //   </ScrollView>
    // );
  }

  renderFiltro() {

  }

  renderOption({ backgroundColor, textColor, border, label, page }) {
    return <SView col={"xs-6"} flex backgroundColor={backgroundColor} border={border} center onPress={() => this.setState({ page: page })}
      style={(page == "compras") ? { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 } : (page == "mesas") ? { borderTopRightRadius: 4, borderBottomRightRadius: 4 } : null}
    >
      <SText color={textColor}>{label}</SText>
    </SView>
  }
  renderSelect() {
    const colorNoSelect = {
      backgroundColor: "",
      textColor: STheme.color.text,
      border: STheme.color.text,
    }
    const colorSelect = {
      backgroundColor: STheme.color.text,
      textColor: STheme.color.secondary,
      border: "",
    }

    return <SView col={"xs-12"} row height={40}>
      {this.renderOption({
        ...(this.state.page == "compras" ? colorSelect : colorNoSelect),
        label: "Compras",
        page: "compras"
      })}
      {this.renderOption({
        ...(this.state.page == "entradas" ? colorSelect : colorNoSelect),
        label: "Entradas",
        page: "entradas"
      })}
      {this.renderOption({
        ...(this.state.page == "mesas" ? colorSelect : colorNoSelect),
        label: "Mesas",
        page: "mesas"
      })}
    </SView>
  }

  render() {
    var reducer = this.props.state.usuarioReducer;
    // if (!Usuario.Actions.validateSession(this.props, true)) {
    //   if (this.close) return;
    //   SNavigation.replace('mensajeIniciarSesion');
    //   this.close = true;
    //   return null;
    // }
    if (reducer.type == 'login') {
      this.props.state.usuarioReducer.type = '';
    }
    return <SPage title={''} hidden preventBack
      header={<Container>{this.renderSelect()}</Container>}
      disableScroll
      onRefresh={() => {
        venta.Actions._getReducer(this.props).data = null;
        venta.Actions.getAll(this.props);

      }} footer={<>
        <PBarraFooter url={'/entradas'} />
        <Carrito style={{ bottom: '25%' }} />
      </>
      }>
      <Container loading={!this.state.ready} flex>
        {/* <SHr /> */}
        <SView col={'xs-12'} flex>
          {this.state.page == "compras" ? this.getCompras() : null}
          {this.state.page == "entradas" ? <ListaDeEntradas /> : null}
          {this.state.page == "mesas" ? <ListaMesas /> : null}
        </SView>
      </Container>
    </SPage >
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Entradas);
