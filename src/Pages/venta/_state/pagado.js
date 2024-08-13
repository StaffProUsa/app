import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SText, SView, STheme, SHr, SList, SDate, SMath, SIcon, SImage, SLoad, SUtil, SNavigation } from 'servisofts-component';
import { Container } from '../../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';
export default class pagado extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.getDetalleVenta();
    SSocket.sendPromise({
      service: "sqr",
      component: "qr",
      type: "registro",
      estado: "cargando",
      data: {
        content: "https://casagrande.servisofts.com/venta?key=" + this.props.data.key,
        content_type: "text",
        errorCorrectionLevel: "L",
        type_color: "solid",
        colorBody: "#ffffff",
        body: "Dot",
        framework: "Rounded",
        header: "Circle",
        detail: "Default"
      }
    }).then(e => {
      this.setState({ dataQr: e.data })
    }).catch(e => {
      console.error(e);
    })
  }

  getDetalleVenta = () => {
    SSocket.sendPromise({
      component: "venta",
      type: "getDetalle",
      key_usuario: Model.usuario.Action.getKey(),
      key: this.props.data.key
    }).then(e => {
      this.setState({ data: e?.data })
    }).catch(e => {

    })
  }

  getQr() {
    if (!this.state?.dataQr) return null
    console.log(this.state.dataQr)
    return "data:image/png;base64," + this.state.dataQr?.b64
  }

  RenderItemV2(evento) {

    let sum = 0;

    evento.ventas.map(det => {
      sum += det.cantidad * det.precio;
    })

    return <SView
      col={'xs-12'} row
      style={{
        padding: 15,
        overflow: "hidden",
        backgroundColor: STheme.color.card,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
      }}
       onPress={() => {
        console.log(evento)
        SNavigation.navigate("/venta/entradas", { key_venta: this.props.data.key, key_evento: evento.key_evento })
      }}
      >
      {this.efect2()}

      <SHr height={25} />


      <SHr />
      <SView col={'xs-12'}>
        <SHr />
        <SList
          scrollEnabled={false}
          data={evento.ventas}
          render={(venta) => {
            console.log(venta)
            var descripcion = '';
            var icon = 'Ticket';
            var tipo = '';
            if (venta.tipo == 'entrada') {
              icon = 'Ticket';
              tipo = 'Entrada';
              descripcion = venta.descripcion;
            } else if (venta.tipo == 'mesa') {
              descripcion = venta.descripcion;
              tipo = 'Reserva';
              icon = 'Group';
            }


            return (
              <SView row center key={venta.descripcion}>
                <SIcon
                  name={icon}
                  fill={STheme.color.gray}
                  width={14}
                />
                <SView width={16} />
                <SText bold>{venta.cantidad} x </SText>
                <SText color={STheme.color.gray} fontSize={12}>
                  {' '}
                  Bs.{SMath.formatMoney(venta.precio)}
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
                    venta.precio * venta.cantidad
                  )}
                </SText>
                <SHr height={4} />
                <SHr height={1} color={STheme.color.card} />
              </SView>
            );
          }}
        />

        <SHr />
        <SView row col={'xs-12'} style={{ justifyContent: 'flex-end' }}>
          <SText fontSize={10} color={STheme.color.gray}>
            {new SDate(evento.fecha_on).toString('DAY dd de MONTH del yyyy a las HH')}
          </SText>
          <SView flex />
          <SText>
            Total:{'\t'}

          </SText>
          <SText bold fontSize={14}>
            Bs. {SMath.formatMoney(sum)}
          </SText>
        </SView>
      </SView>
      <SHr />

      <SHr height={40} />
      <SView col={'xs-12'} style={{ alignItems: "flex-end" }}   >
        <SView center>
          <SView width={100} height={100} center>
            <SHr />
            <SImage src={`${this.getQr()}`} width={"100%"} height={"100%"} enablePreview />
            <SHr />
          </SView>
          <SHr height={5} />
          <SText fontSize={10} bold>{evento.qrid}</SText>
        </SView>
      </SView>
      <SHr height={20} />

    </SView>

  }


  efect1() {
    return <>
      <SView width={20} height={20} style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: STheme.color.secondary,
        borderTopRightRadius: 50,
        borderWidth: 1,
        borderColor: STheme.color.secondary
      }} />
      <SView width={20} height={20} style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: STheme.color.secondary,
        borderTopLeftRadius: 50,
        borderWidth: 1,
        borderColor: STheme.color.secondary
      }} />
    </>
  }

  efect2() {
    return <>
      <SView width={20} height={20} style={{
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundColor: STheme.color.secondary,
        borderBottomRightRadius: 50,
        borderWidth: 1,
        borderColor: STheme.color.secondary
      }} />
      <SView width={20} height={20} style={{
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: STheme.color.secondary,
        borderBottomLeftRadius: 50,
        borderWidth: 1,
        borderColor: STheme.color.secondary

      }} />
    </>
  }

  getTickets() {
    return Object.values(this.state.data).map((evento) => {
      return <SView col={'xs-12'}><SHr height={20} />
        <SView col={'xs-12'}
          style={{
            padding: 15,
            overflow: "hidden",
            backgroundColor: STheme.color.primary,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            borderWidth: 0,
          }}>
          <SText color={STheme.color.secondary} fontSize={16} bold>Tu ticket para:</SText>
          <SText color={STheme.color.secondary} fontSize={20} bold>{evento.descripcion}</SText>
          <SHr height={10} />
          <SView col={'xs-12'} flex style={{ alignItems: "flex-end" }}>
            <SText color={STheme.color.gray} fontSize={12} bold>Fecha evento</SText>
            <SText color={STheme.color.gray} fontSize={15} bold>{new SDate(evento.fecha).toString('DAY dd de MONTH del yyyy')}</SText>
          </SView>
          <SHr height={20} />
          {this.efect1()}
        </SView>
        {this.RenderItemV2(evento)}
      </SView>
    })
  }

  render() {
    if (!this.state.data) return <SLoad />

    return <Container >
      <SView col={'xs-12'} row style={{ backgroundColor: STheme.color.success, borderRadius: 4, padding: 10 }}>
        <SText fontSize={22} color={STheme.color.white} >¡Compra exitosa!</SText>
        <SView width={10} />
        <SIcon name='party' width={28} height={28} fill={STheme.color.white} />
        <SIcon name='party' width={28} height={28} fill={STheme.color.white} />
        <SIcon name='party' width={28} height={28} fill={STheme.color.white} />
      </SView>
      {this.getTickets()}
      <SHr height={100} />
    </Container>
  }
}
