import React from 'react';
import { connect } from 'react-redux';
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
import SSocket from 'servisofts-socket';
import Parent from '..';

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

    this._ref = {};
    this._ref2 = {};
  }

  getregistro() {
    let data = {};
    if (this.key) {
      data = Parent.Actions.getByKey(this.key, this.props);
      if (!data) return <SLoad />;
    }

    return (
      <SForm
        center
        row
        ref={(form) => {
          this.form = form;
        }}
        inputProps={{
          customStyle: 'romeo',
          separation: 16,

          color: STheme.color.text
          // fontSize: 16,
          // font: "Roboto",
        }}
        inputs={{
          "key": { label: "Tipo", defaultValue: data["key"], editable: false },
          "descripcion": { label: "valor", defaultValue: data["descripcion"] }
        }}
        // onSubmitName={"Registrar"}
        onSubmit={(values) => {
          if (this.key) {
            Parent.Actions.editar({ ...data, ...values }, this.props);
          } else {
            Parent.Actions.registro(values, this.props);
          }
        }}
      />
    );
  }

  render() {
    var reducer = this.props.state[Parent.component + 'Reducer'];
    if (reducer.type == 'registro' || reducer.type == 'editar') {
      if (reducer.estado == 'exito') {
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
                Detalle Tipo entrada
              </SText>
              {this.getregistro()}
            </SView>
          </SView>
        </SPage>

        <SView col={'xs-12'} center style={{ bottom: 0 }}>
          <SView
            col={'xs-11 sm-10 md-8 lg-6 xl-4'}
            height={50}
            center
            backgroundColor={STheme.color.card}
            style={{ borderRadius: 4 }}
            onPress={() => {
              this.form.submit();
            }}>
            <SText color={STheme.color.text} font={'Roboto'} fontSize={14} bold>
              EDITAR
            </SText>
          </SView>
        </SView>
        <SHr height={25} />
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(Registro);
