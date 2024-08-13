import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SCharts from 'servisofts-charts';
import { SPage, STheme } from 'servisofts-component';
import SSocket from 'servisofts-socket';

export default class reporte_envios extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData() {
    SSocket.sendPromise({
      service: "notification",
      component: "notification",
      type: "getNotificaciones",
      fecha_inicio: "2024-06-01T00:00:00",
      fecha_fin: "2024-06-18T23:59:59",
    }).then(e => {
      console.log(e);
      this.setState({ data: e.data })
    }).catch(e => {
      console.error(e)
    })
  }
  render() {
    return <SPage title={"Envios"}>
      <SCharts
        type='Line'
        showGuide
        showLabel
        showValue
        textColor={STheme.color.text}
        strokeWidth={1}
        data={{
          "2024-06-14": 1,
          "2024-06-15": 18,
          "2024-06-16": 10,
          "2024-06-17": 6,
          "2024-06-18": 11,

        }} />
    </SPage>
  }
}
