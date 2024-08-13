import React from 'react';
import {connect} from 'react-redux';
import {
  SForm,
  SHr,
  SLoad,
  SNavigation,
  SPage,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import sector from '..';
 
const inputHandler = (text, nro) => {
  console.log(text.nativeEvent.text);
  var value = text.nativeEvent.text;
  if (value.length >= nro) {
    SPopup.alert('Usted no puede ingresar más de ' + nro + ' caracteres');
  }
};

class Registro extends React.Component {
  _ref;
  _ref2;
  constructor(props) {
    super(props);
    this.state = {};
    this.key = SNavigation.getParam('key');
    this.key_evento = SNavigation.getParam('key_evento');

    this._ref = {};
    this._ref2 = {};
  }

  getregistro() {
    let data = {};
    if (this.key) {
      data = sector.Actions.getByKey(this.key, this.props);
      if (!data) return <SLoad />;
    }

    return (
      <SForm
        center
        row
        ref={(form) => {
          this.form = form;
        }}
        style={{
          justifyContent: 'space-between',
        }}
        inputProps={{
          customStyle: 'romeo',
          separation: 16,

          color: STheme.color.text
          // fontSize: 16,
          // font: "Roboto",
        }}
        inputs={{
         descripcion: {
            label: 'Descripcion',
            type: 'text',
            isRequired: true,
            defaultValue: data['descripcion']
          },
          precio: {
            label: 'Precio',
            type: 'money',
            isRequired: false,
            defaultValue: parseFloat(data['precio'] ?? 0).toFixed(2),
            col: 'xs-5.5'
          },
          // cantidad: {
          //   label: 'Cantidad disponibles',
          //   type: 'number',
          //   isRequired: false,
          //   defaultValue: data['cantidad'] ?? 0,
          //   col: 'xs-5.5'
          // }
        }}
        // onSubmitName={"Registrar"}
        onSubmit={(values) => {
          if (this.key) {
            sector.Actions.editar({...data, ...values}, this.props);
          } else {
            sector.Actions.registro(
              {...values, key_evento: this.key_evento},
              this.props
            );
          }
        }}
      />
    );
  }

  render() {
    var reducer = this.props.state[sector.component + 'Reducer'];
    if (reducer.type == 'registro' || reducer.type == 'editar') {
      if (reducer.estado == 'exito') {
        if (reducer.type == 'registro') this.key = reducer.lastRegister?.key;
        reducer.estado = '';
        SNavigation.goBack();
      }
    }

    return (
      <>
        <SPage title={'Registro'}>
          <SView col={'xs-12'} backgroundColor={'transparent'} center row>
            <SView
              col={'xs-11 sm-10 md-8 lg-6 xl-4'}
              backgroundColor={'transparent'}>
              <SText fontSize={18} font={'Roboto'} bold>
               Regitro de sector
              </SText>
              {this.getregistro()}
            </SView>
          </SView>
        </SPage>

        <SView col={'xs-12'} center style={{bottom: 0}}>
          <SView
            col={'xs-11 sm-10 md-8 lg-6 xl-4'}
            height={50}
            center
            backgroundColor={STheme.color.card}
            style={{borderRadius: 4}}
            onPress={() => {
              this.form.submit();
            }}>
            <SText color={STheme.color.text} font={'Roboto'} fontSize={14} bold>
              REGISTRAR
            </SText>
          </SView>
        </SView>
        <SHr height={25} />
      </>
    );
  }
}
const initStates = (state) => {
  return {state};
};
export default connect(initStates)(Registro);
