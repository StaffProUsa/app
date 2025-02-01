import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SIcon, SNavigation, SPage, STable2, SText, STheme, SView, SLanguage, SHr } from 'servisofts-component';
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
  onChangeLanguage(language) {
    this.setState({ ...this.state })
  }
  componentDidMount() {
    SLanguage.addListener(this.onChangeLanguage.bind(this))
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
  componentWillUnmount() {
    SLanguage.removeListener(this.onChangeLanguage)
  }

  render() {
    const users = Model.usuario.Action.getAll() ?? {};

    return <SPage titleLanguage={{
      en: "Attendace Report",
      es: "Reporte de horas trabajadas"
    }} disableScroll>
      <SHr />
      <SView row col={"xs-12"} center>
        <SText language={{
          en: "FROM:",
          es: "DESDE:"
        }} />
        <SView width={4} />
        <InputFecha ref={ref => this.inpFechaInicio = ref}
          defaultValue={this.state.fecha_inicio}
        />
        <SView width={8} />
        <SText language={{
          en: "TO:",
          es: "HASTA:"
        }} />
        <SView width={4} />
        <InputFecha ref={ref => this.inpFechaFin = ref}
          defaultValue={this.state.fecha_fin}
        />
        <SView width={8} />

        <SView width={4} />
        <SView padding={5} card onPress={() => {
          this.state.fecha_inicio = this.inpFechaInicio.getValue();
          this.state.fecha_fin = this.inpFechaFin.getValue();
          this.componentDidMount();
        }} style={{
          backgroundColor: STheme.color.secondary
        }} row center>
          <SIcon name='Search' width={18} fill={STheme.color.white} />
          <SView width={4} />
          <SText color={STheme.color.white} language={{
            en: "SEARCH",
            es: "BUSCAR"
          }} />
        </SView>
      </SView>
      <SView col={"xs-12"} flex>
        <STable2 data={this.state.data}
          rowHeight={25}
          header={[
            { key: "index", label: "#", width: 35 },
            {
              key: "evento/fecha", order: "desc", label: SLanguage.select({
                en: "Date",
                es: "Fecha"
              }), width: 100, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ss").toString("MONTH dd, yyyy")
            },
            {
              key: "cliente/descripcion", label: SLanguage.select({
                en: "Client",
                es: "Cliente"
              }), width: 150
            },
            {
              key: "employee_number", label: SLanguage.select({
                en: "Employee Number",
                es: "Número de empleado"
              }), width: 120, 
            },
            {
              key: "key_usuario", cellStyle: { fontSize: 12 },  label: SLanguage.select({
                en: "User",
                es: "Usuario"
              }), width: 150, render: ku => {
                const user = users[ku]
                return `${user?.Nombres} ${user?.Apellidos}`
              }
            },
            {
              key: "staff_tipo/descripcion", label: SLanguage.select({
                en: "Position",
                es: "Posición"
              }), width: 150
            }
            ,
            {
              key: "staff/fecha_inicio", label: SLanguage.select({
                en: "Start",
                es: "Inicio"
              }), center: true, width: 70, render: a => new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")
            },
            {
              key: "staff/fecha_fin", label: SLanguage.select({
                en: "End",
                es: "Fin"
              }), center: true, width: 70, render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")
            },
            {
              key: "fecha_ingreso", label: SLanguage.select({
                en: "Clock In",
                es: "Ingreso"
              }), center: true,
              width: 150,
              render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("HH"),
            },
            {
              key: "fecha_salida", label: SLanguage.select({
                en: "Clock Out",
                es: "Salida"
              }), center: true, width: 150, render: a => !a ? "" : new SDate(a, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")
            },
            {
              key: "-horas", label: SLanguage.select({
                en: "Hours",
                es: "Horas"
              }),  cellStyle: { fontSize: 14, fontWeight: "bold" }, sumar: true, center: true, width: 50, 
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
            {
              key: "evento/descripcion", label: SLanguage.select({
                en: "Event",
                es: "Evento"
              }), width: 150
            },
            { key: "staff/descripcion", label: "Staff", width: 150 },
            {
              key: "-status", label: SLanguage.select({
                en: "Status",
                es: "Estado"
              }), width: 150, renderExcel: (obj) => {
                let CONT = "--"

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
                  CONT = SLanguage.select({
                    en: "Waiting for the start time...",
                    es: "Esperando la hora de ingreso..."
                  })
                  // estadoAsistencia = "Esperando la hora de ingreso..."
                } else if (!obj?.fecha_ingreso && !obj?.fecha_salida && sdatef.isBefore(new SDate())) {
                  CONT = SLanguage.select({
                    en: "The event is over and you did not mark entry or exit",
                    es: "EL evento ya finalizó y no marcaste ingreso ni salida"
                  })
                  // estadoAsistencia = "EL evento ya finalizo y no marcaste ingreso ni salida"
                } else if (!obj?.fecha_ingreso) {
                  allowLoading = true;
                  CONT = SLanguage.select({
                    en: "You must check in at the event",
                    es: "Debes marcar ingreso en el evento"
                  })
                  // estadoAsistencia = "Debes marcar ingreso en el evento"
                } else if (!obj?.fecha_salida) {
                  allowLoading = true;
                  CONT = SLanguage.select({
                    en: "You must check out",
                    es: "Debes marcar la salida"
                  })
                  // estadoAsistencia = "Debes marcar la salida"
                } else if (sdatef.isBefore(new SDate())) {
                  CONT = SLanguage.select({
                    en: "Completed",
                    es: "Completado"
                  })
                } else {
                  CONT = SLanguage.select({
                    en: "You must check in",
                    es: "Debes marcar entrada"
                  })
                }

                return CONT
              },
              component: (obj) => {
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
                  CONT = <SText center color={STheme.color.gray} fontSize={10} language={{
                    en: "Waiting for the start time...",
                    es: "Esperando la hora de ingreso..."
                  }} />
                  // estadoAsistencia = "Esperando la hora de ingreso..."
                } else if (!obj?.fecha_ingreso && !obj?.fecha_salida && sdatef.isBefore(new SDate())) {
                  CONT = <SText center color={STheme.color.danger} fontSize={10} language={{
                    en: "The event is over and you did not mark entry or exit",
                    es: "EL evento ya finalizó y no marcaste ingreso ni salida"
                  }} />
                  // estadoAsistencia = "EL evento ya finalizo y no marcaste ingreso ni salida"
                } else if (!obj?.fecha_ingreso) {
                  allowLoading = true;
                  CONT = <SText center color={STheme.color.warning} fontSize={10} language={{
                    en: "You must check in at the event",
                    es: "Debes marcar ingreso en el evento"
                  }} />
                  // estadoAsistencia = "Debes marcar ingreso en el evento"
                } else if (!obj?.fecha_salida) {
                  allowLoading = true;
                  CONT = <SText center color={STheme.color.warning} fontSize={10} language={{
                    en: "You must check out",
                    es: "Debes marcar la salida"
                  }} />
                  // estadoAsistencia = "Debes marcar la salida"
                } else if (sdatef.isBefore(new SDate())) {
                  CONT = <SText center color={STheme.color.success} fontSize={10} language={{
                    en: "Completed",
                    es: "Completado"
                  }} />
                } else {
                  CONT = <SText center color={STheme.color.warning} fontSize={10} language={{
                    en: "You must check in",
                    es: "Debes marcar entrada"
                  }} />
                }

                return <SView col={"xs-12"} flex center>
                  {CONT}
                </SView>
              }
            }







          ]}
        />
      </SView>
    </SPage>
  }
}
