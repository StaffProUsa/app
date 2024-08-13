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
  SView,
  SImage,
  SLoad
} from 'servisofts-component';
import PButtomFooter from '../../Components/PButtomFooter';
import carrito from '../../Services/Casagrandeadmin/Components/carrito';
import BoxDetalle from '../Carrito/BoxDetalle';
import UsuarioR from '../../Services/Usuario/Components/usuario/index';
import venta from '../../Services/Casagrandeadmin/Components/venta';
import Tarjeta from '../../Services/Casagrandeadmin/Components/tarjeta';
import VerificarOrden from '../../Components/Orden'


class PagoTarjeta extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tarjetaForm: false,
      btnAgregar: 0
    };
    this.bgSpace = 'transparent';
    this.bgborder = 'transparent';
    this.key_venta = SNavigation.getParam('key_venta');
    this.name = SNavigation.getParam('nombre');
    this.nit = SNavigation.getParam('nit');
  }

  getFacturacion() {
    return (
      <>
        <SView col={'xs-11'} style={{ borderRadius: 16 }} center>
          <SHr height={15} />
          <SView col={'xs-12'}>
            <SText color={STheme.color.text} font={'Roboto'} fontSize={20} >
              Detalle Facturación
            </SText>
          </SView>
          <SHr height={4} color={this.bgSpace} />

          <SView col={'xs-12'} row center>
            <SView col={'xs-12'} height={25} row>
              <SView
                flex
                border={this.bgborder}
                style={{ alignItems: 'flex-start' }}
                center>
                <SView row border={this.bgborder}>
                  <SText
                    color={STheme.color.text}
                    font={'Roboto'}
                    fontSize={12}>
                    Nombre o Razón Social
                  </SText>
                </SView>
              </SView>
              <SView
                flex
                center
                border={this.bgborder}
                style={{ alignItems: 'flex-end' }}>
                <SText
                  color={STheme.color.text}
                  font={'Roboto'}
                  fontSize={12}>
                  {this.name}
                </SText>
              </SView>
            </SView>
            <SView col={'xs-12'} height={25} row>
              <SView
                flex
                border={this.bgborder}
                style={{ alignItems: 'flex-start' }}
                center>
                <SView row border={this.bgborder}>
                  <SText
                    color={STheme.color.text}
                    font={'Roboto'}
                    fontSize={12}>
                    NIT/CI
                  </SText>
                </SView>
              </SView>
              <SView
                flex
                center
                border={this.bgborder}
                style={{ alignItems: 'flex-end' }}>
                <SText
                  color={STheme.color.text}
                  font={'Roboto'}
                  fontSize={12}>
                  {this.nit}
                </SText>
              </SView>
            </SView>
            <SHr height={20} color={this.bgSpace} />
          </SView>
        </SView>
      </>
    );
  }

  getFormTarjeta() {//dinamico
    var nombres = '';
    var correo = "";
    var usuario = this.props.state.usuarioReducer?.usuarioLog;
    if (usuario) {
      nombres = usuario['Nombres'] + ' ' + usuario['Apellidos'];
      correo = usuario['Correo'];
    }

    return (
      <>
        <SView col={'xs-12 '} center >
          <SView col={'xs-11'} row>
            <SHr height={18} color={this.bgSpace} />
            <SText fontSize={20} font={'Roboto'} >
              Detalle de tarjeta
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
                card_holder_name: {
                  label: 'Nombre',
                  placeholder: 'Nombre completo',
                  isRequired: true,
                  defaultValue: nombres
                },
                card_holder_email: {
                  label: 'Correo electrónico',
                  placeholder: 'name@email.com',
                  isRequired: true,
                  type: 'email',
                  defaultValue: correo
                },
                credit_card_number: {
                  label: 'Número de tarjeta',
                  placeholder: '0000-0000-0000-0000',
                  isRequired: true,
                  type: 'number'
                },
                expiration_month: {
                  label: 'Caducidad Mes',
                  placeholder: 'MM',
                  isRequired: true,
                  col: 'xs-6',
                  type: 'number',
                  maxLength: 2
                },
                expiration_year: {
                  label: 'Caducidad Año',
                  placeholder: 'AA',
                  isRequired: true,
                  col: 'xs-6',
                  type: 'number',
                  maxLength: 2,
                  style: {
                    // marginLeft: 5
                  }
                },
                cvv_code: {
                  label: 'Código de seguridad',
                  placeholder: '0000',
                  isRequired: true,
                  col: 'xs-6',
                  type: 'number',
                  maxLength: 4
                }
              }}
              // onSubmitName={"Registrar"}
              onSubmit={(values) => {
                SPopup.open({
                  key: 'confirmar',
                  content: this.popupConfirmacion(values, 0) //si es 0 hace registro tarjeta
                });
              }}
            />
            <SView width={100} style={{ bottom: 50, left: 180, position: 'absolute', alignItems: "flex-end" }}>
              <SView col={'xs-6'} row center></SView>
              <SView
                // col={'xs-2'}
                // row
                onPress={() => {
                  SPopup.open({ content: this.popupQueEs(), key: 'queEs' });
                }}>
                <SIcon
                  name={'InfoTarjeta'}
                  width={20}
                  height={20}
                  fill={STheme.color.text}
                />
              </SView>
            </SView>
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
          width={320}
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
            <SHr height={10} />
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
        {/* { (this.state.loading) ? <SLoad/> : null } */}
        <SText
          fontSize={14}
          color={active ? STheme.color.primary : STheme.color.secondary}
          bold>
          {title}

        </SText>
      </SView>
    );
  };

  popupConfirmacion(data, estado) {
    // var INSTACE = this;
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
              ¿Estás seguro que deseas pagar este pedido?
            </SText>
          </SView>

          <SView col={'xs-12'} style={{ alignItems: 'center' }}>
            <SView col={'xs-12'} height={20} />
            <SView row col={'xs-11'}>
              {this.btn({
                title: 'No, cancelar',
                onPress: () => {
                  SPopup.close('confirmar');
                },
                active: false
              })}
              <SView col={'xs-1'} />
              {this.btn({
                title: 'Sí, Confirmar',
                onPress: () => {

                  //AQUI
                  if (this.state.loading) return;
                  if (estado == 0) {
                    Tarjeta.Actions.registro(data, this.props);
                  }
                  this.setState({
                    loading: true
                  })
                  venta.Actions.pago_tarjeta(this.key_venta, data, this.props).then(resp => {
                    console.log(resp);
                    console.log("entro");
                    this.setState({
                      loading: false
                    })
                    SNavigation.navigate('billetera/mensajePedidoExitoso');
                  }).catch(e => {
                    console.error(e);
                    this.setState({
                      loading: false
                    })
                  })

                  SPopup.close('confirmar');
                  //SNavigation.navigate('verificarOrden', { key: this.key_venta });



                },
                active: true
              })}
              {/* <VerificarOrden key={this.key_venta} props={this.props} /> */}
            </SView>
          </SView>
        </SView>
      </>
    );
  }
  listaTarjetas(tarjetasData) {
    return Object.keys(tarjetasData).map((key, index) => {
      var obj = tarjetasData[key];
      var nroTrajeta = obj.credit_card_number;
      return (
        <>
          <SView col={'xs-12'} height={60} center
            style={{
              backgroundColor: STheme.color.card,
              borderColor: STheme.color.primary,
              borderWidth: 1,
              borderRadius: 8
            }}
            onPress={() => {
              SPopup.open({
                key: 'confirmar',
                content: this.popupConfirmacion(obj, 1) // si es 1 directo registra venta
              });
            }}
          >
            <SView col={'xs-11'} row center>
              <SView width={60} height={30} border={this.bgborder}>
                <SImage
                  src={require('../../Assets/images/tarjeta1.png')}
                  style={{ width: 40 }}
                />
              </SView>
              <SView flex center>
                <SText
                  col={'xs-12'}
                  fontSize={16}
                  font={'Roboto'}>
                  *** **** **** {nroTrajeta.substring(nroTrajeta.length - 4)}
                </SText>
              </SView>
              <SView
                width={40}
                height={40}
                border={this.bgborder}
                center
                onPress={() => {
                  // SPopup.open({ key: "confirmar", content: this.popupConfirmacion() });
                  Tarjeta.Actions.eliminar(obj, this.props)
                }}>
                <SIcon name='DeleteT' width='40'></SIcon>
              </SView>
            </SView>
          </SView>
          <SHr height={10} />
        </>
      )
    });
  }

  getTarjetas(tarjetasData) {//dinamico
    return (
      <>
        <SView col={'xs-12 '} center >
          <SView col={'xs-11'} row>
            <SHr height={18} color={this.bgSpace} />
            <SText fontSize={18} font={'Roboto'} bold>
              Mis tarjetas de crédito y débito
            </SText>
            <SHr height={18} />
            <SText fontSize={14} font={'Roboto'} >
              Elige tu tarjeta de pago:
            </SText>
            <SHr height={18} />
            {this.listaTarjetas(tarjetasData)}
            <SHr height={10} />

          </SView>
        </SView>
      </>
    );
  }
  contenidoTarteja() {
    //  this.setState( this.state.btnAgregar == 0 ? { btnAgregar: 1 } : { btnAgregar: 0 } )
    let tarjetasData = Tarjeta.Actions.getByKeyUsuario(this.props.state.usuarioReducer?.usuarioLog?.key, this.props);
    if (!tarjetasData) return <SLoad />;
    // if (this.state.filter == "en espera" && estado != "en espera") return null;
    if (tarjetasData.length > 0) {
      if (this.state.btnAgregar == 0) this.setState({ btnAgregar: 1 });
      if (this.state.tarjetaForm) return this.getFormTarjeta();
      return this.getTarjetas(tarjetasData);
      // return this.getFormTarjeta();
    } else {
      console.log(this.state.tarjetaForm + " aaaa")
      if (!this.state.tarjetaForm) this.setState({ tarjetaForm: true });
      return this.getFormTarjeta();
    }
  }

  validarBoton() {
    if (!this.state.tarjetaForm) return;
    return (
      <>
        <PButtomFooter
          primary
          fontSize={24}
          loading={this.state.loading}
          onPress={() => {
            //venta.Actions.pago_tarjeta(this.key_venta, {}, this.props) //ricky
            if (!this.form?.submit) {
              SPopup.alert("Elige tu tarjeta de pago")
            } else {
              this.form.submit();
            }
          }}>
          PAGAR PEDIDO
        </PButtomFooter>
      </>
    )
  }

  render() {
    const reducer = this.props.state[venta.component + 'Reducer'];
    if (reducer.type == 'pago_tarjeta' || reducer.type == 'registro') {
      if (reducer.estado == 'exito') {
        reducer.estado = '';
        //SNavigation.navigate('billetera/mensajePedidoExitoso');
        //return <VerificarOrden/>
        // alert("OKKKKK")
      }

    }

    if (this.state.loading) return <SLoad />;

    return (
      <>
        <SPage title={''} center>
          <VerificarOrden key_venta={this.key_venta} />
          <SView
            col={'xs-12 md-5'}
            backgroundColor={STheme.color.background}
            center>
            <SHr height={15} color={this.bgSpace} />
            <SView col={'xs-11'} center>
              <BoxDetalle />
            </SView>
            <SHr height={18} color={STheme.color.card} />
            {this.getFacturacion()}
            <SHr height={18} color={STheme.color.card} />
            {this.contenidoTarteja()}
            <SView col={'xs-11'} style={{ alignItems: 'flex-end', transform: [{ scale: this.state.btnAgregar }] }}
              onPress={() => {
                this.setState(this.state.tarjetaForm ? { tarjetaForm: false } : { tarjetaForm: true })
                // this.setState({ tarjetaForm: true })
                this.setState({ btnAgregar: 0 })
              }}
            >
              <SText fontSize={18} font={'Roboto'}>{this.state.tarjetaForm ? "Mis tarjetas" : "Agregar tarjeta"}</SText>
            </SView>
            <SHr height={45} color={this.bgSpace} />
          </SView>
        </SPage>
        {this.validarBoton()}

      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(PagoTarjeta);
