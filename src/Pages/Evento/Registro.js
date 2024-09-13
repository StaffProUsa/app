import React from 'react';
import { connect } from 'react-redux';
import {
  SDate,
  SForm,
  SHr,
  SLoad,
  SNavigation,
  SNotification,
  SPage,
  SText,
  STheme,
  SView
} from 'servisofts-component';
import eventos from "../cliente/eventos"
import SSocket from 'servisofts-socket';
import Model from '../../Model';
const inputHandler = (text, nro) => {
  console.log(text.nativeEvent.text);
  var value = text.nativeEvent.text;
  if (value.length >= nro) {
    SPopup.alert('Usted no puede ingresar más de ' + nro + ' caracteres');
  }
};

export default class Registro extends React.Component {
  _ref;
  _ref2;
  constructor(props) {
    super(props);
    this.state = {};
    this.key = SNavigation.getParam('key');
    this.key_company = SNavigation.getParam('key_company');
    this.key_cliente = SNavigation.getParam('key_cliente');
    this._ref = {};
    this._ref2 = {};
  }

  componentDidMount() {
    if (this.key) {
      // data = evento.Actions.getByKey(this.key, this.props);
      SSocket.sendPromise({
        component: "evento",
        type: "getByKey",
        key: this.key
      }).then(e => {
        this.setState({ data: e.data })
      }).catch(e => {

      })
    }
  }
  getregistro() {
    let data = {};
    if (this.key) {
      data = this.state.data
      if (!data) return <SLoad />;
    }
    if (this.key_company) {
      data['key_company'] = this.key_company;
      // this.key_company = data.key_company;
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
          // foto_p: { type: "image", isRequired: false, defaultValue: `${SSocket.api.root}evento/${this.key}?time=${new Date().getTime()}`, col: "xs-4 sm-3.5 md-3 lg-2.5 xl-2.5", style: { borderRadius: 8, overflow: 'hidden', width: 130, height: 130, borderWidth: 0 } },
          fecha: {
            label: 'Fecha del evento',
            type: 'date',
            isRequired: false,
            defaultValue: new SDate(data['fecha'], "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd") ?? new SDate().toString("yyyy-MM-dd"),
            col: 'xs-7'
          },
          descripcion: {
            label: 'Nombre del evento',
            type: 'text',
            isRequired: true,
            defaultValue: data['descripcion']
          },


          // cantidad: {
          //   label: 'cantidad',
          //   type: 'number',
          //   isRequired: false,
          //   defaultValue: data['cantidad'],
          //   col: 'xs-5.5'
          // },
          observacion: {
            label: 'Informarcion sobre el evento',
            type: 'textArea',
            placeholder: "Informarcion sobre el evento",
            isRequired: false,
            defaultValue: data['observacion'],
            col: 'xs-12'
          },
          // key_ubicacion: {
          //   label: 'Ubicacion',
          //   isRequired: false,
          //   defaultValue: data['key_ubicacion'],
          //   // data: {},
          //   col: 'xs-12'
          // },
        }}
        // onSubmitName={"Registrar"}
        onSubmit={(values) => {
          values.estado_venta = 0;
          if (this.key_company) values.key_company = this.key_company;
          if (this.key_cliente) values.key_cliente = this.key_cliente;

          if (this.key) {
            SSocket.sendPromise({
              component: "evento",
              type: "editar",
              data: { ...data, ...values },
              key_usuario: Model.usuario.Action.getKey(),
            }).then(e => {
              if (eventos.INSTANCE) eventos.INSTANCE.componentDidMount()
              SNavigation.goBack();
            }).catch(e => {
              SNotification.send({
                title: "Error",
                body: e.error ?? "Error desconocido",
                color: STheme.color.danger
              })
            })
            // evento.Actions.editar({ ...data, ...values }, this.props);
          } else {
            SSocket.sendPromise({
              component: "evento",
              type: "registro",
              data: { ...values },
              key_usuario: Model.usuario.Action.getKey(),
            }).then(e => {
              if (eventos.INSTANCE) eventos.INSTANCE.componentDidMount()
              SNavigation.goBack();
            }).catch(e => {
              SNotification.send({
                title: "Error",
                body: e.error ?? "Error desconocido",
                color: STheme.color.danger
              })
            })
            // evento.Actions.registro(values, this.props);
          }
        }}
      />
    );
  }

  render() {
    // var reducer = this.props.state[evento.component + 'Reducer'];
    // if (reducer.type == 'registro' || reducer.type == 'editar') {
    //   if (reducer.estado == 'exito') {
    //     // if (reducer.type == "registro") this.key = reducer.lastRegister?.key;
    //     // if (this.form) {
    //     //   this.form.uploadFiles(SSocket.api.root + "upload/" + evento.component + "/" + this.key);
    //     // }
    //     if (eventos.INSTANCE) eventos.INSTANCE.componentDidMount();
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
                Detalle evento
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
              {this.key ? "EDITAR" : "REGISTRAR"}
            </SText>
          </SView>
        </SView>
        <SHr height={25} />
      </>
    );
  }
}
