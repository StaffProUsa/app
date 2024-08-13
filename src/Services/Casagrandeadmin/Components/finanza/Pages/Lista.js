import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { connect } from 'react-redux';
import {
  SBuscador, SDate,
  SHr, SLoad,
  SMath,
  SNavigation, SOrdenador, SPage,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import SSocket from 'servisofts-socket';
// import Carrito from '../Components/Carrito';
import ImageBlur from '../../../../../Components/ImageBlur';
import PBuscador from '../../../../../Components/PBuscardor';
import actividad from '../../actividad';
import Eventos from '../../evento';
import orden_pago from '../../orden_pago';
import tipo_entrada from '../../tipo_entrada';
import venta from '../../venta';


class Lista extends Component {
  constructor(props) {
    super(props);
    this.state = { foto_id: 0 };
  }

  getTotalVentaEvento(key_evento) {
    let data = venta.Actions.getVentaDetalle(this.props);
    if (!data) return null;
    var total = 0;
    data.map((venta) => {
      venta.map((detalle) => {
        if (!detalle.tipo_evento) return;
        if (detalle.tipo_evento.key == key_evento) {
          total += detalle.cantidad * detalle.precio;
        }
      });
    });
    return total;
  }

  getTotalVentaEventoQR(key_evento) {

    let data = venta.Actions.getVentaDetalle(this.props);
    if (!data) return null;

    var total = "";
    data.map((venta) => {
      venta.map((detalle) => {
        if (!detalle.tipo_evento) return;
        if (detalle.tipo_evento.key == key_evento) {

          let data_pago = orden_pago.Actions.getAll(detalle.key_venta, this.props);
          if (!data_pago) return null;

          // Object.keys(data_pago).map((key) => {
          //   let obj = data_pago[key];
          //   if (obj.estado != 2) return;
          //   // if (obj.estado != 2 && obj.type != "QR"  ) return;
          //   // console.log("alavro ", obj.type);
          //   // total = +1;
          //   console.log("paso")
          // })    
          console.log("entro ", data_pago)

        }
      });

    });

    return total;
  }
  getTotalVenta(eventos) {

    if (!eventos) return;
    Object.keys(eventos).map((key) => {
      eventos[key]["total"] = this.getTotalVentaEvento(key);
      // eventos[key]["totalqr"] = this.getTotalVentaEventoQR(key);
      eventos[key]["totalqr"] = 1;
      eventos[key]["totaltarjeta"] = 1;
      // this.getTotalVentaEventoQR(key);
    })
    // return eventos;
  }
  getEventos() {
    var DATA = Eventos.Actions.getAll(this.props);
    var ventas = venta.Actions.getVenta(this.props);
    if (!DATA) return <SLoad />;
    if (!ventas) return <SLoad />;
    this.getTotalVenta(DATA);
    return new SOrdenador([
      { key: "fecha", "order": "desc", "peso": 1 }
    ]).ordernarObject(DATA).map((key) => {
      if (!SBuscador.validate(DATA[key], this.state.find)) {
        return null;
      }
      var precioMenor = tipo_entrada.Actions.getMenorEntrada(DATA[key].key, this.props);
      console.log(ventas)
      return (
        <>
          {this.getContenido({
            key: DATA[key].key,
            titulo: DATA[key].descripcion,
            descripcion: DATA[key].observacion,
            dia: new SDate(DATA[key].fecha).toString('dd'),
            mes: new SDate(DATA[key].fecha).toString('MONTH'),
            precio: precioMenor,
            fecha: new SDate(DATA[key].fecha),
            total: DATA[key].total,
            totalqr: DATA[key].totalqr,
            totaltarjeta: DATA[key].totaltarjeta
          })}
        </>
      );
    });
  }

  getContenido({ key, titulo, descripcion, dia, mes, precio, fecha, total, totalqr, totaltarjeta }) {
    const heig = Dimensions.get('window').height;
    const win = Dimensions.get('window').width;
    var precio_ok = "";
    var data_actividad = actividad.Actions.getByKeyEvento(key, this.props);
    if (!data_actividad) return null;

    if (precio != Infinity) {
      precio_ok = "Desde " + precio + " Bs.";
    }


    var imgPath = SSocket.api.root + 'actividad/' + new SOrdenador([{ key: "fecha_on", order: "asc", peso: 1 }]).ordenarArray(data_actividad)[0]?.key;
    return (
      <>
        <SView col={'xs-12'} center row >
          <SView
            col={'xs-12'}
            // flex
            height={100}
            style={{
              backgroundColor: STheme.color.card,
              borderRadius: 8,
              overflow: "hidden"
            }}
            centery
            activeOpacity={.9}
            onPress={() => {
              SNavigation.navigate('admin/finanza/detalle', { key: key });
            }}>
            {/* <SView width={10} /> */}

            <SView col={'xs-12'} row center backgroundColor={"transparent"} flex>
              <SView width={10} />
              <SView width={50} style={{ overflow: 'hidden' }} center>
                <ImageBlur src={imgPath} height={50} center style={{ borderRadius: 15 }} />
              </SView>
              <SView width={10} />
              <SView flex height>
                <SHr height={15} />
                <SText fontSize={12} style={{ textTransform: 'uppercase' }}>
                  {titulo}
                </SText>
                <SHr height={10} />
                <SText fontSize={10} style={{ textTransform: 'uppercase' }} color={STheme.color.gray}>
                  {dia} {mes}
                </SText>
                <SHr height={10} />
                <SText fontSize={10} style={{ textTransform: 'uppercase' }} color={STheme.color.primary}>
                  Total  Bs. {SMath.formatMoney(total)}
                </SText>
                <SHr height={10} />
                <SText fontSize={10} style={{ textTransform: 'uppercase' }} color={STheme.color.primary}>
                  Total Ventas. 
                </SText>

              </SView>

            </SView>

          </SView>
        </SView>
        <SHr height={30}></SHr>
      </>
    );
  }

  render() {
    return <SPage>
      <SView col={'xs-12'} center>
        <SView
          col={'xs-12 sm-11 md-10 lg-8 xl-6'}
          row
          center
          backgroundColor={'transparent'}>

          <SHr height={12} />
          <SView col={'xs-12'} row center style={{ borderRadius: 8 }}>
          <PBuscador onChangeText={(text) => {
            this.setState({
              find: text
            })
          }}
          />
          </SView>
          
          <SView col={'xs-12'} row center onPress={() => { }}>
            <SHr height={10}></SHr>
            {this.getEventos()}
          </SView>
          <SHr height={30} />

        </SView>
      </SView>
    </SPage>
  }

}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Lista);
