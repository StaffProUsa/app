import React from 'react';
import {connect} from 'react-redux';
import {
  SIcon,
  SLoad,
  SNavigation,
  SPage,
  SPopup,
  STable2,
  STheme,
  SView,
  SImage,
  SDate,
  SOrdenador
} from 'servisofts-component';
import SSocket from 'servisofts-socket';
import venta from '..';
import FloatButtom from '../../../../../Components/FloatButtom';
import usuario from '../../../../Usuario/Components/usuario';
import actividad from '../../actividad';
import evento from '../../evento';

class Lista extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.key = SNavigation.getParam('key');
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

  getTotalVenta(eventos) {
    if (!eventos) return;

    Object.keys(eventos).map((key) => {
      eventos[key]['total'] = this.getTotalVentaEvento(key);
      eventos[key]['totalqr'] = 1;
      eventos[key]['totaltarjeta'] = 1;
    });
    // return eventos;
  }

  getTipo_entradaTabla() {
    var data = evento.Actions.getAll(this.props);
    if (!data) return <SLoad />;
    this.getTotalVenta(data);

    return (
      <STable2
        headerColor={STheme.color.info}
        header={[
          {
            key: 'index',
            label: '#',
            width: 50,
            color: STheme.color.danger,
            fontSize: 16,
            font: 'Roboto'
          },
          {
            key: 'key-foto',
            label: 'foto',
            width: 100,
            render: (key) => {
              var data_actividad = actividad.Actions.getByKeyEvento(
                key,
                this.props
              );
              if (!data_actividad) return null;

              return (
                SSocket.api.root +
                'actividad/' +
                new SOrdenador([
                  {key: 'fecha_on', order: 'asc', peso: 1}
                ]).ordenarArray(data_actividad)[0]?.key
              );
            },
            component: (url) => {
              return (
                <SImage
                  enablePreview
                  src={url + '?time=' + new Date().getTime()}
                  width={'100%'}
                  height={'100%'}
                />
              );
            }
          },
          {key: 'descripcion', label: 'Evento', width: 200},
          {key: 'total', label: 'Monto Total', width: 130, center: true},

          {
            key: 'key-detalle',
            label: 'detalle',
            width: 60,
            center: true,
            component: (item) => {
              return (
                <SView
                  onPress={() => {
                    SNavigation.navigate('admin/venta/detalle', { key: item });
                  }}>
                  <SIcon name={'PerfilEvent'} width={35} />
                </SView>
              );
            }
          }
        ]}
        data={data}
        filter={(dta) => {
          if (dta.estado != 1) return false;
          return true;
        }}
      />
    );
  }

  render() {
    return (
      <>
        <SPage title={'Lista'} disableScroll>
          <SView col={'xs-12'} center height>
            {this.getTipo_entradaTabla()}
          </SView>

         
        </SPage>
      </>
    );
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(Lista);
