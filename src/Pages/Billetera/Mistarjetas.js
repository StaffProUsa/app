import React from 'react';
import {connect} from 'react-redux';
import {
  SForm,
  SHr,
  SIcon,
  SImage,
  SNavigation,
  SPage,
  SPopup,
  SSection,
  SText,
  STheme,
  SView
} from 'servisofts-component';
//SE USARÁ PARTE MAQUETA HAY TARJETA
class Mistarjetas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.bgSpace = 'transparent';
    this.bgborder = 'transparent';
  }

  getListaTarjeta() {
    return (
      <>
        <SView col={'xs-12 '} center border={this.bgborder}>
          <SView col={'xs-11'} row>
            <SText fontSize={18} font={'Roboto'} bold>
              Mis tarjetas de crédito y débido
            </SText>
            <SHr height={10} />
            <SText fontSize={14} font={'Roboto'}>
              Elige tu tarjeta de pago:
            </SText>
            <SHr height={16} color={this.bgSpace} />
            <SSection>
              <SView
                col={'xs-12'}
                row
                center
                style={{
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: STheme.color.gray
                }}
                backgroundColor={STheme.color.card}
                onPress={() => {
                  SPopup.open({
                    content: this.popupCodigoSeguridad(obj),
                    key: 'CodigoSeguridad'
                  });
                }}>
                <SView col={'xs-11'} height={50} row center>
                  <SView width={60} height={30} border={this.bgborder}>
                    <SImage
                      src={require('../../Assets/images/tarjeta1.png')}
                      style={{width: 40}}
                    />
                  </SView>
                  <SView flex center>
                    <SText
                      col={'xs-12'}
                      fontSize={16}
                      font={'Roboto'}
                      style={{fontWeight: 'bold'}}>
                      *** **** **** 554
                    </SText>
                  </SView>
                  <SView
                    width={40}
                    height={40}
                    border={this.bgborder}
                    center
                    onPress={() => {
                      // SPopup.open({ key: "confirmar", content: this.popupConfirmacion() });
                    }}>
                    <SIcon name='DeleteT' width='40'></SIcon>
                    {/* </SView> */}
                    {/* <SView width={10}></SView> */}
                    {/* <SView style={{ borderRadius: 100, backgroundColor: STheme.color.error, }} width={33} height={33} center flex
                   >
                    <SIcon name="DeleteT" width="15"></SIcon>
                  </SView> */}
                  </SView>
                </SView>
              </SView>
              <SHr height={7} color={this.bgSpace} />
            </SSection>

            <SHr height={8} color={this.bgSpace} />
            <SSection>
              <SView
                col={'xs-12'}
                row
                center
                style={{
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: STheme.color.gray
                }}
                backgroundColor={STheme.color.card}
                onPress={() => {
                  SPopup.open({
                    content: this.popupCodigoSeguridad(obj),
                    key: 'CodigoSeguridad'
                  });
                }}>
                <SView col={'xs-11'} height={50} row center>
                  <SView width={60} height={30} border={this.bgborder}>
                    <SImage
                      src={require('../../Assets/images/tarjeta2.png')}
                      style={{width: 40}}
                    />
                  </SView>

                  <SView flex center>
                    <SText
                      col={'xs-12'}
                      fontSize={16}
                      font={'Roboto'}
                      style={{fontWeight: 'bold'}}>
                      *** **** **** 554
                    </SText>
                  </SView>

                  <SView
                    width={40}
                    height={40}
                    border={this.bgborder}
                    center
                    onPress={() => {
                      // SPopup.open({ key: "confirmar", content: this.popupConfirmacion() });
                    }}>
                    <SIcon name='DeleteT' width='40'></SIcon>
                    {/* </SView> */}
                    {/* <SView width={10}></SView> */}
                    {/* <SView style={{ borderRadius: 100, backgroundColor: STheme.color.error, }} width={33} height={33} center flex
                   >
                    <SIcon name="DeleteT" width="15"></SIcon>
                  </SView> */}
                  </SView>
                </SView>
              </SView>
              <SHr height={7} color={this.bgSpace} />
            </SSection>

            <SHr height={23} color={this.bgSpace} />
            <SView col={'xs-12'} style={{alignItems: 'flex-end'}}>
              <SView row height={20}>
                <SView width={40}>
                  <SIcon
                    name={'TarjetaAdd'}
                    fill={STheme.color.secondary}
                    stroke={STheme.color.primary}
                    width={25}></SIcon>
                </SView>
                <SText color={STheme.color.primary}>Agregar una tarjeta </SText>
              </SView>
            </SView>
            <SHr height={23} color={this.bgSpace} />
          </SView>
        </SView>
      </>
    );
  }

  getFormFactura() {
    return (
      <>
        <SView col={'xs-12 '} border={this.bgborder} center>
          <SView col={'xs-11'}>
            <SHr height={20} color={this.bgSpace} />
            <SText fontSize={18} font={'Manrope'} style={{fontWeight: 'bold'}}>
              Información de Facturación
            </SText>
            <SHr height={12} color={this.bgSpace} />
            <SText fontSize={13} font={'Manrope'}>
              Datos requeridos para emitir la factura correspondiente.
            </SText>
            <SHr height={20} color={this.bgSpace} />
          </SView>

          <SView col={'xs-11'}>
            <SForm
              inputProps={{
                separation: 16,
                color: STheme.color.text,
                height: 64,
                fontSize: 16,
                font: 'Roboto'
              }}
              ref={(form) => {
                this.form = form;
              }}
              inputs={{
                Nombre: {
                  placeholder: 'Razón social',
                  isRequired: true,
                  defaultValue: 'servisofts srl',
                  icon: (
                    <SIcon
                      name={'InputUser'}
                      fill={STheme.color.primary}
                      width={17}
                      height={20}
                    />
                  )
                },
                NIT: {
                  placeholder: 'Nit',
                  defaultValue: '123456789',
                  icon: (
                    <SIcon
                      name={'InputDocument'}
                      fill={STheme.color.primary}
                      width={24}
                      height={16}
                    />
                  )
                }
              }}
              // onSubmitName={"Registrar"}
              onSubmit={(values) => {
                // if (this.key) {
                //   Parent.Actions.editar({ ...data, ...values }, this.props);
                // } else {
                //   //Parent.Actions.registro(values, this.props);
                //   SNavigation.navigate(Parent.component + "/misTarjetas");
                // }
              }}
            />
          </SView>
        </SView>
      </>
    );
  }

  getBtnFooter() {
    return (
      <>
        <SView col={'xs-12'} center style={{bottom: 0}}>
          <SView
            col={'xs-11'}
            height={50}
            center
            backgroundColor={STheme.color.card}
            style={{borderRadius: 4}}
            onPress={() => {
              SNavigation.navigate('/');
            }}>
            <SText color={STheme.color.text} font={'Roboto'} fontSize={18}>
              REALIZAR PEDIDO
            </SText>
          </SView>
        </SView>
      </>
    );
  }

  popupConfirmacion() {
    var INSTACE = this;
    return (
      <>
        <SView
          width={362}
          height={216}
          center
          row
          style={{borderRadius: 8}}
          withoutFeedback
          backgroundColor={STheme.color.background}
          border={STheme.color.primary}>
          <SHr height={50} />
          <SView col={'xs-9'} center>
            <SText color={STheme.color.text} style={{fontSize: 20}} bold center>
              ¿Estás seguro que deseas realizar este pedido?
            </SText>
          </SView>
          <SHr height={20} />
          <SView col={'xs-11'} row center>
            <SView col={'xs-6'} center>
              <SView
                width={140}
                height={44}
                center
                border={STheme.color.primary}
                style={{borderRadius: 8}}
                onPress={() => {
                  SPopup.close('confirmar');
                }}>
                <SText fontSize={14} color={STheme.color.primary} bold>
                  No, cancelar
                </SText>
              </SView>
            </SView>
            <SView col={'xs-6'} center>
              <SView
                width={140}
                height={44}
                center
                backgroundColor={STheme.color.primary}
                style={{borderRadius: 8}}
                onPress={() => {
                  INSTACE._form.submit();
                }}>
                <SText fontSize={14} color={STheme.color.secondary} bold>
                  Sí, Confirmar
                </SText>
              </SView>
            </SView>
          </SView>
          <SHr height={50} />
        </SView>
      </>
    );
  }
  render() {
    return (
      <>
        <SPage title={''}>
          <SView
            col={'xs-12  '}
            backgroundColor={STheme.color.background}
            center>
            <SView col={'xs-12 sm-12 md-12 lg-8 xl-6'}>
              <SHr height={15} color={this.bgSpace} />
              {this.getListaTarjeta()}
              <SHr height={18} color={STheme.color.card} />
              {this.getFormFactura()}
              <SView height={70} color={this.bgSpace} />
            </SView>
          </SView>
        </SPage>
        {this.getBtnFooter()}
        <SHr height={30} color={this.bgSpace} />
      </>
    );
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(Mistarjetas);
