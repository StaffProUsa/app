import React from 'react';
import { connect } from 'react-redux';
import {
  SForm,
  SHr,
  SIcon,
  SNavigation,
  SPage,
  SPopup,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import PButtomFooter from '../../Components/PButtomFooter';
import carrito from '../../Services/Casagrandeadmin/Components/carrito';
import venta from '../../Services/Casagrandeadmin/Components/venta';
import BoxDetalle from './BoxDetalle';
import { Container } from '../../Components';
import Model from '../../Model';
import SSocket from 'servisofts-socket';

class Confirmar_admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.bgSpace = 'transparent';
    this.bgborder = 'transparent';
    // this.name;
    // this.nit;
  }

  getDetalleCarrito() {
    const data = carrito.Actions.getEventosActivos(this.props);
    if (!data) return <SLoad />;

    const MontoTotal = 0;

    return Object.keys(data.entradas).map((key, index) => {
      var obj = data.entradas[key];

      MontoTotal += obj.precio * obj.cantidad;
      <>
        <SView col={'xs-12'} height={25} row>
          <SView
            flex
            border={this.bgborder}
            style={{ alignItems: 'flex-start' }}
            center>
            <SView row border={this.bgborder}>
              <SIcon name={'Ticket'} fill={STheme.color.text} width={14} />
              <SView width={5} />
              <SText color={STheme.color.text} font={'Roboto'} fontSize={12}>
                {obj.descripcion}
              </SText>
            </SView>
          </SView>
          <SView
            flex
            center
            border={this.bgborder}
            style={{ alignItems: 'flex-end' }}>
            <SText color={STheme.color.text} font={'Roboto'} fontSize={12}>
              Bs. {MontoTotal.toFixed(2)}
            </SText>
          </SView>
        </SView>

        <SView col={'xs-12'} row>
          <SView flex>
            <SText color={STheme.color.text} font={'Roboto'} fontSize={14}>
              {obj.tipo_entrada.descripcion +
                ' Bs. ' +
                obj.precio +
                ' x ' +
                obj.cantidad}
            </SText>
          </SView>
          <SView flex center>
            <SText color={STheme.color.text} font={'Roboto'} fontSize={14}>
              Bs. {(obj.precio * obj.cantidad).toFixed(2)}
            </SText>
          </SView>
        </SView>
        <SHr height={10} color={this.bgSpace} />
      </>;
    });
  }

  getFormTarjeta() {
    let nombres = '';
    let correo = '';
    let telefono = '';
    const usuario = this.props.state.usuarioReducer.usuarioLog;
    if (usuario) {
      nombres = usuario['Nombres'] + ' ' + usuario['Apellidos'];
      correo = usuario['Correo'];
      telefono = usuario['Telefono'];
    }

    return (
      <>
        <SView col={'xs-12 '} center>
          <SView col={'xs-11'} row>
            <SHr height={18} color={this.bgSpace} />
            <SText fontSize={20} font={'Roboto'}>
              Detalle registro
            </SText>
            <SForm
              row
              inputProps={{
                customStyle: 'romeo',
                separation: 16,
                color: STheme.color.text,
                placeholderTextColor: STheme.color.lightGray
              }}
              ref={(form) => {
                this.form = form;
              }}
              inputs={{
                nit: {
                  label: 'NIT/CI',
                  placeholder: 'NIT/CI',
                  isRequired: true,
                  type: 'number',
                  defaultValue: 123456789
                },
                razon_social: {
                  label: 'Nombre o Razón social',
                  placeholder: 'Nombre o Razón social',
                  isRequired: true,
                  defaultValue: nombres
                },
                telefono: {
                  label: 'Teléfono',
                  placeholder: 'Teléfono',
                  type: 'telefono',
                  defaultValue: telefono
                },
                correo: {
                  label: 'Correo electrónico',
                  placeholder: 'Correo',
                  isRequired: true,
                  type: 'email',
                  defaultValue: correo
                }
              }}
              onSubmit={(values) => {
                const dataCarrito = carrito.Actions.getAllSimple(this.props);
                values['detalle'] = dataCarrito;

                // se crea un variable para el encabezado y el detalle del carrito
                // para enviar al Popup de confirmacion
                this.sendCarritoDetallao = values;
                SPopup.open({
                  key: 'pop_confirmar',
                  content: this.popupConfirmacion()
                });
              }}
            />
            <SHr height={8} color={this.bgSpace} />
            <SHr height={16} color={this.bgSpace} />
          </SView>
        </SView>
      </>
    );
  }

  popupQueEs() {
    return (
      <>
        <SView
          width={362}
          height={246}
          center
          row
          style={{ borderRadius: 8 }}
          withoutFeedback
          backgroundColor={STheme.color.background}
          border={STheme.color.primary}>
          <SHr height={20} />
          <SText color={STheme.color.text} style={{ fontSize: 20 }} bold center>
            Código de seguridad
          </SText>
          <SHr height={20} />
          <SView col={'xs-11'} center row>
            <SView col={'xs-5'} center flex>
              <SIcon width={100} name='TarjetaSeguridad'></SIcon>
            </SView>
            <SView col={'xs-6'} center>
              <SText fontSize={14} color={STheme.color.text}>
                Son los 3-4 dígitos numéricos ubicados en la parte trasera de su
                tarjeta.
              </SText>
            </SView>
          </SView>
          <SView col={'xs-12'} center>
            <SHr height={25} />
            <SView
              width={140}
              height={44}
              center
              backgroundColor={STheme.color.primary}
              style={{ borderRadius: 8 }}
              onPress={() => {
                SPopup.close('queEs');
              }}>
              <SText fontSize={14} color={STheme.color.secondary} bold>
                Entendido
              </SText>
            </SView>
            <SHr height={15} />
          </SView>
        </SView>
      </>
    );
  }

  btn = ({ title, onPress, active }) => {
    return (
      <SView
        col={'xs-5.5'}
        height={44}
        center
        border={STheme.color.primary}
        backgroundColor={active ? STheme.color.secondary : STheme.color.primary}
        style={{ borderRadius: 8 }}
        onPress={onPress}>
        <SText
          fontSize={14}
          color={active ? STheme.color.primary : STheme.color.secondary}
          bold>
          {title}
        </SText>
      </SView>
    );
  };

  popupConfirmacion() {
    return (
      <>
        <SView
          style={{
            width: '100%',
            maxWidth: 320,
            height: 210,
            borderRadius: 8
          }}
          center
          withoutFeedback
          backgroundColor={STheme.color.background}
          border={STheme.color.primary}>
          <SView col={'xs-12'} center>
            <SText
              color={STheme.color.primary}
              style={{ fontSize: 20 }}
              bold
              center>
              ¿Estás seguro que deseas realizar este pedido?
            </SText>
          </SView>

          <SView col={'xs-12'} style={{ alignItems: 'center' }}>
            <SView col={'xs-12'} height={20} />
            <SView row col={'xs-11'}>
              {this.btn({
                title: 'No, cancelar',
                onPress: () => {
                  SPopup.close('pop_confirmar');
                },
                active: false
              })}
              <SView col={'xs-1'} />
              {this.btn({
                title: 'Sí, Confirmar',
                onPress: () => {
                  // if (this.state.loading) return null;
                  // this.setState({loading: true});

                  SPopup.close('pop_confirmar');
                  // SNavigation.navigate('cargandoqr', {
                  //   data: this.sendCarritoDetallao
                  // });
                  SSocket.sendPromise({
                    component: "venta",
                    type: 'registro',
                    estado: 'cargando',
                    key_usuario: Model.usuario.Action.getKey(),
                    data: this.sendCarritoDetallao
                  }, (7 * 60 * 1000)).then(e => {
                    console.log(e)
                  }).catch((e) => {
                    console.log(e);
                  })
                  // console.log('la ostias ', this.sendCarritoDetallao);

                  // SPopup.close('pop_confirmar');
                  // SNavigation.navigate('cargando', {
                  //   data: this.sendCarritoDetallao
                  // });

                  // se registra la venta, usando el pupup de confirmacion
                  // venta.Actions.registro(this.sendCarritoDetallao, this.props)
                  //   .then((resp) => {
                  //     SPopup.close('pop_confirmar');
                  //     this.setState({loading: false});
                  //     this.props.dispatch(resp);
                  //     console.log('State: venta', resp.estado);
                  //     SNavigation.navigate('evento/qr', {key: resp.data.key});
                  //   })
                  //   .catch((e) => {
                  //     SPopup.close('pop_confirmar');
                  //     console.log('State: venta ', e.estado);
                  //     console.log('negativo choco', e);
                  //     SPopup.alert('Error al realizar la venta');
                  //     this.setState({loading: false});
                  //   });
                },
                active: true
              })}
            </SView>
          </SView>
        </SView>
      </>
    );
  }

  render() {
    const reducer = this.props.state[venta.component + 'Reducer'];
    if (reducer.type == 'registro' || reducer.type == 'editar') {
      if (reducer.estado == 'exito') {
        reducer.estado = '';
        // SNavigation.goBack();
        console.log('reducer estado ', reducer.estado);
      }
    }
    return (
      <>
        <SPage title={''} center>
          <Container>
            <SHr height={15} color={this.bgSpace} />
            <SView col={'xs-11'} center>
              <BoxDetalle />
            </SView>
            <SHr height={18} color={STheme.color.card} />
            {this.getFormTarjeta()}
            <SHr height={45} color={this.bgSpace} />
          </Container>
        </SPage>
        <PButtomFooter
          secondary
          fontSize={24}
          onPress={() => {
            this.form.submit();
          }}>
          REGISTRO SIN PAGO
        </PButtomFooter>
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Confirmar_admin);
