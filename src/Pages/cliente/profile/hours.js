import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SIcon, SNavigation, SPage, STable2, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';

export default class hours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      fecha_inicio: SNavigation.getParam("fecha_inicio", "2021-01-01"),
      fecha_fin: SNavigation.getParam("fecha_inicio", "2040-01-01")
    };
    this.key_cliente = SNavigation.getParam("pk");
  }

  componentDidMount() {
    SSocket.sendPromise({
      component: "staff_usuario",
      type: "reporteHorasCliente",
      key_cliente: this.key_cliente,
      fecha_inicio: "2021-01-01",
      fecha_fin: "2030-01-01"
    }).then((e) => {
      this.setState({ data: e.data })
    }).catch(e => {

    })
  }
  render() {
    const users = Model.usuario.Action.getAll() ?? {};

    return <SPage titleLanguage={{
      en: "Attendace Report",
      es: "Reporte de horas trabajadas"
    }} disableScroll>
      <STable2 data={this.state.data}
        rowHeight={30}
        header={[
          { key: "index", width: 50 },
          {
            key: "key_usuario", width: 150, render: ku => {
              const user = users[ku]
              return `${user?.Nombres} ${user?.Apellidos}`
            }
          },
          {
            key: "-horas", sumar: true, center: true, width: 50,
            render: a => {
              if (!a.fecha_ingreso || !a.fecha_salida) {
                return "";
              }

              const fi = new SDate(a.fecha_ingreso, "yyyy-MM-ddThh:mm:ss")
              const fs = new SDate(a.fecha_salida, "yyyy-MM-ddThh:mm:ss")
              const disf = fi.diffTime(fs);
              return ((disf / 1000) / 60 / 60).toFixed(2);

            },
          },
          { key: "evento/fecha", width: 100, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("MONTH dd, yyyy") },
          { key: "staff/fecha_inicio", center: true, width: 70, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("HH") },
          { key: "staff/fecha_fin", center: true, width: 70, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("HH") },
          {
            key: "fecha_ingreso", center: true,
            width: 150,
            render: a => !a ? "No Clock In" : new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("yyyy MONTH dd, HH"),
          },
          { key: "fecha_salida", center: true, width: 150, render: a => !a ? "No Clock Out" : new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("yyyy MONTH dd, HH") },


          { key: "evento/descripcion", width: 150 },
          { key: "evento/descripcion", width: 150 },
          { key: "cliente/descripcion", width: 150 },
          { key: "staff/descripcion", width: 150 },
          { key: "staff_tipo/descripcion", width: 150 },
        ]}
      />
    </SPage>
  }
}
