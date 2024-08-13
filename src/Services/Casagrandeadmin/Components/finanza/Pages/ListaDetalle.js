import React from 'react';
import { connect } from 'react-redux';
import {
  SDate, SNavigation,
  SPage, STable2,
  STheme,
  SView
} from 'servisofts-component';
import usuario from '../../../../Usuario/Components/usuario';
import orden_pago from '../../orden_pago';
import venta from '../../venta';


class ListaDetalle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.key_evento = SNavigation.getParam('key');
  }

  getRecorroVentas() {

    let data = venta.Actions.getVentaDetalle(this.props);
    let data_usuario = usuario.Actions.getAll(this.props);
 
    if (!data) return null;
    if (!data_usuario) return null;
 
    const ventitas = [];
    data.map((venta) => {
      venta.map((detalle) => {
        if (!detalle.tipo_evento) return;
        if (detalle.tipo_evento.key == this.key_evento) {
          ventitas.push(detalle)
        }
      });
    });


    ventitas.map((venta) => {

      let data_pago = orden_pago.Actions.getAll(venta.key_venta, this.props);
      if (!data_pago) return null;

      Object.keys(data_pago).map((key) => {
        let obj = data_pago[key];
        if (obj.estado != 2) return;
        // ventitas[key]["pagado"] = obj.type;
        console.log("alavro ", obj.type);
      })
    });

 
    return (
      <STable2
        headerColor={STheme.color.info}
        header={[
          { key: 'index', label: '#', width: 50, fontSize: 16 },
          // { key: 'key_venta', label: 'venta id', width: 130 },
          {
            key: 'fecha_on', label: 'Fecha', width: 90, order: "desc", center: true,
            render: (fecha) => {
              return !fecha ? '' : new SDate(fecha).toString('dd-MM-yyyy');
            }
          },
          {
            key: 'key_usuario', label: 'Usuario', width: 130,
            render: (key_usuario) => {
              let obj_usr = data_usuario[key_usuario];
              if (!obj_usr) return '--';
              return obj_usr['Nombres'] + ' ' + obj_usr['Apellidos'];
            }
          },
          //consultar como puedo tener ambos, en una sola columna
          { key: 'tipo_entrada/descripcion', label: 'Tiket', width: 80 },
          { key: 'tipo_sector/descripcion', label: 'sectors', width: 80 },
          { key: 'cantidad', label: 'Cantidad', width: 80, center: true, },
          { key: 'precio', label: 'Precio', width: 80, center: true, },
          {
            key: '-xxx', label: 'Subtotal', width: 80, center: true, sumar: true, render: (obj) => {
              return obj.cantidad * obj.precio
            }
          },
          // {
          //   key: 'key_venta', label: 'tipo pago', width: 130,
          //   render: (key_venta) => {
          //     let data_pago = orden_pago.Actions.getAll(key_venta, this.props);
          //     if (!data_pago) return null;
          //     return data_pago.type;
          //   }
          // },

        ]}
        data={ventitas}
        filter={(ventitas) => {
          // issue #29 close 
          if (ventitas.tipo != "entrada" && ventitas.tipo != "sector") return false;
          return true;
        }}
      />
    );


  }


  getTotalQR(Ventas) {

    if (!Ventas) return;

    let data_pago = orden_pago.Actions.getAll(venta.key_venta, this.props);
    if (!data_pago) return null;

    Object.keys(data_pago).map((key) => {
      let obj = data_pago[key];
      if (obj.estado != 2) return;

      Ventas[key]["pagoAlvaro"] = obj.type;
    })
    return Ventas;
  }






  render() {
    return (
      <>
        <SPage title={'Lista'} disableScroll>
          <SView col={'xs-12'} center height>
            {this.getRecorroVentas()}
          </SView>
        </SPage>
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(ListaDetalle);
