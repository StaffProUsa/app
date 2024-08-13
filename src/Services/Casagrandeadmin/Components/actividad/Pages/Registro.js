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
import actividad from '..';

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
      data = actividad.Actions.getByKey(this.key, this.props);
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
          foto_p: {
            type: 'image',
            isRequired: false,
            defaultValue: `${SSocket.api.root}actividad/${this.key
              }?time=${new Date().getTime()}`,
            col: 'xs-4 sm-3.5 md-3 lg-2.5 xl-2.5',
            style: {
              borderRadius: 8,
              overflow: 'hidden',
              width: 130,
              height: 130,
              borderWidth: 0
            }
          },
          descripcion: {
            label: 'descripcion',
            type: 'text',
            isRequired: true,
            defaultValue: data['descripcion']
          },
          tipo: {
            label: 'tipo',
            type: 'select',
            options: ["image", "video"],
            isRequired: true,
            defaultValue: data['tipo'] ?? "image"
          },
          index: {
            label: 'index',
            type: 'number',
          },
          // estado: {
          //   label: 'estado',
          //   type: 'text',
          //   isRequired: false,
          //   defaultValue: data['estado']
          // },
          // fecha: {
          //   label: 'fecha',
          //   type: 'text',
          //   isRequired: false,
          //   defaultValue: data['fecha'],
          //   col: 'xs-6'
          // },
          // observacion: {
          //   label: 'observacion',
          //   type: 'text',
          //   isRequired: false,
          //   defaultValue: data['observacion'],
          //   col: 'xs-6'
          // }
        }}
        // onSubmitName={"Registrar"}
        onSubmit={(values) => {
          if (this.key) {
            actividad.Actions.editar({ ...data, ...values }, this.props).then(e => {
              this.form.uploadFiles(
                SSocket.api.root + 'upload/' + actividad.component + '/' + this.key
              );
              SNavigation.goBack();
            }).catch(e => {

            })
          } else {
            // actividad.Actions.registro(values, this.props);
            actividad.Actions.registro(
              { ...values, key_evento: this.key_evento },
              this.props
            ).then(e => {
              this.form.uploadFiles(
                SSocket.api.root + 'upload/' + actividad.component + '/' + e.data.key
              );
              SNavigation.goBack();
            }).catch(e => {

            })
          }
        }}
      />
    );
  }

  render() {
    // var reducer = this.props.state[actividad.component + 'Reducer'];
    // if (reducer.type == 'registro' || reducer.type == 'editar') {
    //   if (reducer.estado == 'exito') {
    //     if (reducer.type == 'registro') this.key = reducer.lastRegister?.key;
    //     if (this.form) {
    //       // this.form.uploadFiles(
    //       //   SSocket.api.root + 'upload/' + actividad.component + '/' + this.key
    //       // );
    //     }
    //     reducer.estado = '';
    //     SNavigation.goBack();
    //   }
    // }

    return (
      <>
        <SPage title={'Registro'}>
          <SView col={'xs-12'} backgroundColor={'transparent'} center row>
            <SView
              col={'xs-11 sm-10 md-8 lg-6 xl-4'}
              backgroundColor={'transparent'}>
              <SText fontSize={18} font={'Roboto'} bold>
                Detalle actividad
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
  return { state };
};
export default connect(initStates)(Registro);
