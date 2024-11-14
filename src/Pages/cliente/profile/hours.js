import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SIcon, SNavigation, SPage, STable2, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';
import InputFecha from '../../../Components/NuevoInputs/InputFecha';

export default class hours extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      fecha_inicio: SNavigation.getParam("fecha_inicio", new SDate().toString("yyyy-MM-dd")),
      fecha_fin: SNavigation.getParam("fecha_inicio", new SDate().toString("yyyy-MM-dd"))
    };
    this.key_cliente = SNavigation.getParam("pk");
  }

  componentDidMount() {
    SSocket.sendPromise({
      component: "staff_usuario",
      type: "reporteHorasCliente",
      key_cliente: this.key_cliente,
      fecha_inicio: this.state.fecha_inicio,
      fecha_fin: this.state.fecha_fin
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
      <SView row col={"xs-12"} center>
        <SText>{"FROM:"}</SText>
        <SView width={4} />
        <InputFecha ref={ref => this.inpFechaInicio = ref}
          defaultValue={this.state.fecha_inicio}
        />
        <SView width={8} />
        <SText>{"TO:"}</SText>
        <SView width={4} />
        <InputFecha ref={ref => this.inpFechaFin = ref}
          defaultValue={this.state.fecha_fin}
        />
        <SView width={8} />
        <SText card onPress={() => {
          this.state.fecha_inicio = this.inpFechaInicio.getValue();
          this.state.fecha_fin = this.inpFechaFin.getValue();
          this.componentDidMount();
        }}>{"SEND"}</SText>
      </SView>
      <SView col={"xs-12"} flex>
        <STable2 data={this.state.data}
          rowHeight={25}
          header={[
            {
              key: "key_usuario-employee_number", label: "Employee Number", width: 120, render: ku => {
                const user = users[ku]
                return `${user?.employee_number}`
              }
            },
            {
              key: "key_usuario", cellStyle: { fontSize: 12 }, order: "asc", label: "User", width: 150, render: ku => {
                const user = users[ku]
                return `${user?.Nombres} ${user?.Apellidos}`
              }
            }
            ,
            {
              key: "-status", label: "Status", width: 150, renderExcel: a => "-", component: (obj) => {
                let CONT = <SText color={STheme.color.gray} fontSize={10}>{"--"}</SText>

                const fecha = new SDate(obj?.evento?.fecha, "yyyy-MM-ddThh:mm:ss");
                const hora = new SDate(obj?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ss.sssTZD");
                const horaf = new SDate(obj?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ss.sssTZD");
                const sdate = new SDate(fecha.toString("yyyy-MM-dd") + "T" + hora.toString("hh:mm:ss"), "yyyy-MM-ddThh:mm:ss");
                const sdatef = new SDate(fecha.toString("yyyy-MM-dd") + "T" + horaf.toString("hh:mm:ss"), "yyyy-MM-ddThh:mm:ss");
                const timerun = sdate.isBefore(new SDate())
                // console.log("obj", obj)
                let allowLoading = false;
                let estadoAsistencia = "";
                if (sdate.isAfter(new SDate())) {
                  // Si la fecha inicio aun no paso
                  CONT = <SText center color={STheme.color.gray} fontSize={10}>{"Esperando la hora de ingreso..."}</SText>
                  // estadoAsistencia = "Esperando la hora de ingreso..."
                } else if (!obj?.fecha_ingreso && !obj?.fecha_salida && sdatef.isBefore(new SDate())) {
                  CONT = <SText center color={STheme.color.danger} fontSize={10}>{"EL evento ya finalizo y no marcaste ingreso ni salida"}</SText>
                  // estadoAsistencia = "EL evento ya finalizo y no marcaste ingreso ni salida"
                } else if (!obj?.fecha_ingreso) {
                  allowLoading = true;
                  CONT = <SText center color={STheme.color.warning} fontSize={10}>{"Debes marcar ingreso en el evento"}</SText>
                  // estadoAsistencia = "Debes marcar ingreso en el evento"
                } else if (!obj?.fecha_salida) {
                  allowLoading = true;
                  CONT = <SText center color={STheme.color.warning} fontSize={10}>{"Debes marcar la salida"}</SText>
                  // estadoAsistencia = "Debes marcar la salida"
                } else if (sdatef.isBefore(new SDate())) {
                  CONT = <SText center color={STheme.color.success} fontSize={10}>{"Completado."}</SText>
                } else {
                  CONT = <SText center color={STheme.color.warning} fontSize={10}>{"Debe marcar entrada"}</SText>
                }

                return <SView col={"xs-12"} flex center>
                  {CONT}
                </SView>
              }
            },
            {
              key: "-horas", label: "Hours", cellStyle: { fontSize: 14, fontWeight: "bold" }, sumar: true, center: true, width: 50,
              render: a => {
                if (!a.fecha_ingreso || !a.fecha_salida) {
                  return "";
                }

                const fi = new SDate(a.fecha_ingreso, "yyyy-MM-ddThh:mm:ssTZD")
                const fs = new SDate(a.fecha_salida, "yyyy-MM-ddThh:mm:ssTZD")
                const disf = fi.diffTime(fs);
                return ((disf / 1000) / 60 / 60).toFixed(2);

              },
            },
            { key: "evento/fecha", label: "Date", width: 100, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("MONTH dd, yyyy") },
            { key: "staff/fecha_inicio", label: "Start", center: true, width: 70, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("HH") },
            { key: "staff/fecha_fin", label: "end", center: true, width: 70, render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("HH") },
            {
              key: "fecha_ingreso", label: "Clock In", center: true,
              width: 150,
              render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("yyyy MONTH dd, HH"),
            },
            { key: "fecha_salida", label: "Clock Out", center: true, width: 150, render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("yyyy MONTH dd, HH") },

            { key: "cliente/descripcion", label: "Client", width: 150 },
            { key: "evento/descripcion", label: "Event", width: 150 },
            { key: "staff/descripcion", label: "Staff", width: 150 },
            { key: "staff_tipo/descripcion", label: "Position", width: 150 },
          ]}
        />
      </SView>
    </SPage>
  }
}
