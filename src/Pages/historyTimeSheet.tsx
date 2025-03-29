import React, { Component } from 'react';
import { Text, TextStyle, View } from 'react-native';
import { SDate, SIcon, SImage, SLanguage, SNavigation, SPage, SText, STheme, SView, } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { DinamicTable } from 'servisofts-table'
import Model from '../Model';
import { ExporterStateType } from 'servisofts-table/DinamicTable/DinamicTable';
import TableIcon from '../Components/Table/TableIcon';

// type DataType = typeof DATATEST[0]
type DataType = any
const Col = DinamicTable.Col<DataType>


const ImageLabel = ({ label, src, textStyle }) => {
  return <SView row >
    <SView width={16} height={16} style={{ borderRadius: 100, overflow: "hidden", backgroundColor: STheme.color.card }}>
      <SImage src={src} style={{
        resizeMode: "cover"
      }} />
    </SView>
    <SView width={4} />
    <Text style={[textStyle as TextStyle, { flex: 1 }]} numberOfLines={1} >{label}</Text>
  </SView>
}
export default class historyAlvaro extends Component {

  params = SNavigation.getAllParams();
  // key_company_ = SNavigation.getParam("key_company")
  // key_cliente_ = SNavigation.getParam("key_cliente")
  // key_evento_ = SNavigation.getParam("key_evento")
  // key_company_ = "b8118596-9980-4a27-aa4e-a48384095350";

  getByKeys = async (keys: string[]) => {
    // let keys = [...new Set(Object.values(e.data).map(a => a.key_usuario).filter(key => key !== null))

    const request = {
      version: "2.0",
      service: "usuario",
      component: "usuario",
      type: "getAllKeys",
      keys: keys,
    }
    const response: any = await SSocket.sendPromise(request)
    const data = Object.values(response.data).map((a: any) => a.usuario) as any[];
    return data;
  }

  async loadData1111() {

    let fecha_inicio_statatio = "2022-03-01";
    let fecha_fin_statatio = new SDate().toString('yyyy-MM-dd');
    const resp: any = await SSocket.sendPromise({
      component: "board",
      type: "timesheet_cliente",
      key_cliente: Model.usuario.Action.getKey(),
      fecha_inicio: fecha_inicio_statatio,
      fecha_fin: fecha_fin_statatio
    })

    let keys: any[] = [...new Set(resp.data.map((a: any) => a.staff_usuario.key_usuario).filter(key => key !== null))]
    keys = [...keys, ...new Set(resp.data.map((a: any) => a.staff_usuario.key_usuario_atiende).filter(key => key !== null))]
    let usuarios = await this.getByKeys(keys);
    resp.data = Object.values(resp.data).map((a: any) => {
      a.usuario = usuarios.find((b: any) => b.key == a.staff_usuario.key_usuario)
      a.usuario_atiende = usuarios.find((b: any) => b.key == a.staff_usuario.key_usuario_atiende)
      return a;
    })

    return resp.data;

  }



  calculador_hora(hora_inicio: string, hora_fin: string) {
    if (!hora_inicio) return "";
    const time = new SDate(hora_inicio, "yyyy-MM-ddThh:mm:ssTZD").diffTime(new SDate(hora_fin, "yyyy-MM-ddThh:mm:ssTZD"))
    return isNaN(time) ? "" : time / 1000 / 60 / 60;



  }

  render() {
    // console.log("cliee " + this.key_cliente_)
    return <SPage titleLanguage={{ es: "Reporte de asistencia", en: "Timesheet" }} disableScroll>
      <SView col={"xs-12"} flex>
        <DinamicTable
          loadInitialState={async () => {
            let filters: ExporterStateType["filters"] = [];
            if (this.params.state) {
              filters.push({
                col: "state",
                type: "string",
                operator: "=",
                value: this.params.state
              })
            }
            return {
              filters: filters,
              sorters: [
                {
                  key: "fecha",
                  order: "desc",
                  type: "date"
                },
              ]
            }
          }}
          loadData={this.loadData1111.bind(this)}
          colors={{
            text: STheme.color.text,
            border: STheme.color.card,
            background: STheme.color.barColor,
            card: STheme.color.card
          }}
          cellStyle={{ borderWidth: 0, height: 30 }}
          textStyle={{ fontSize: 12 }}
        >

          <Col key={"state"} label={SLanguage.select({ es: "State", en: "Estado" })} width={70}
            data={e => {

              if (e.row?.staff_usuario?.fecha_salida) {
                return "COMPLETED"
              }

              if (e.row?.staff_usuario?.fecha_ingreso) {
                return "READY"
              }

              if (new SDate(e.row?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").getTime() < new SDate().getTime()) {
                return "FINISHED"
              }

              return "PENDING"

            }}

            customComponent={e => {
              let color: any = STheme.color.primary;
              switch (e.dataFormat) {
                case "FINISHED":
                  color = STheme.color.danger;
                  break;
                case "READY":
                  color = STheme.color.warning;
                  break;
                case "PENDING":
                  color = STheme.color.lightGray;
                  break;
                case "COMPLETED":
                  color = STheme.color.success;
                  break;
              }

              return <SView col={"xs-12"} center >
                <SView padding={3} center style={{
                  backgroundColor: color,
                  borderRadius: 4,
                }}>
                  <Text style={[e.textStyle as TextStyle, { color: "#fff", fontWeight: "bold", fontSize: 10 }]} >{e.dataFormat}</Text>
                </SView>
              </SView>
            }} />


          <Col key={"fecha"}

            label={SLanguage.select({ es: "Fecha", en: "Date" })} width={80}
            dataType='date' data={e => new SDate(e.row?.staff.fecha_inicio, "yyyy-MM-dd").date}
            format={e => new SDate(e.data).toString("yyyy-MM-dd")} />
          <Col key={"key_company"}
            labelIcon={<TableIcon name='icompany' />}
            label={SLanguage.select({ es: "Compania", en: "Company" })} width={100}
            data={e => { return e.row?.company?.descripcion; }}
            customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "company/" + e.row?.company?.key} textStyle={e.textStyle} />} />
          <Col key={"key_cliente"}
            labelIcon={<TableIcon name='icliente' />}
            label={SLanguage.select({ es: "Cliente", en: "Client" })} width={100}
            data={e => { return e.row?.cliente?.descripcion; }}
            customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "cliente/" + e.row?.cliente?.key} textStyle={e.textStyle} />} />
          <Col key={"key_evento"}
            labelIcon={<TableIcon name='ievento' />}
            label={SLanguage.select({ es: "Evento", en: "Event" })} width={100}
            data={e => { return e.row?.evento?.descripcion; }} />
          <Col key={"employee_number"} label={SLanguage.select({ es: "Numero empleado", en: "Employee number" })} width={70}
            data={e => { return e.row?.usuario_company?.employee_number; }} />
          <Col key={"usuario"}
            labelIcon={<TableIcon name='iusuario' />}
            label={SLanguage.select({ es: "Usuario", en: "User" })} width={120}
            data={e => `${e.row?.usuario?.Nombres} ${e.row?.usuario?.Apellidos}`}
            customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "usuario/" + e.row?.usuario?.key} textStyle={e.textStyle} />}
          />
          <Col key={"salario_hora"} label={SLanguage.select({ es: "Salario", en: "Salary" })} width={60}
            dataType='number'
            data={e => { return e.row?.usuario_company?.salario_hora; }}
            format={e => isNaN(e.data) ? null : Number.isInteger(e.data) ? e.data : e.data.toFixed(2)} />

          <Col key={"usuario_atiende"} label={SLanguage.select({ es: "Jefe", en: "Boss" })} width={80}
            data={e => `${e.row?.usuario_atiende?.Nombres ?? ""} ${e.row?.usuario_atiende?.Apellidos ?? ""}`}
            customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "usuario/" + e.row?.usuario_atiende?.key} textStyle={e.textStyle} />} />

          <Col key={"staff"} label={SLanguage.select({ es: "Posición", en: "Position" })} width={100}
            data={e => e.row?.staff_tipo?.descripcion}
            customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "staff_tipo/" + e.row?.staff_tipo?.key} textStyle={e.textStyle} />} />

          <Col key={"inicio"} label={SLanguage.select({ es: "Hora inicio", en: "Clock In" })} width={80}
            dataType='date' data={e => (!e.row?.staff_usuario.fecha_ingreso) ? null : new SDate(e.row?.staff_usuario.fecha_ingreso, "yyyy-MM-ddThh:mm:ssTZD").date}
            format={e => (!e.row.staff_usuario.fecha_ingreso) ? null : new SDate(e.data).toString("HH")}
          />

          <Col key={"fin"} label={SLanguage.select({ es: "Hora fin", en: "Clock Out" })} width={80}
            dataType='date'
            data={e => (!e.row?.staff_usuario.fecha_salida) ? null : new SDate(e.row?.staff_usuario.fecha_salida, "yyyy-MM-ddThh:mm:ssTZD").date}
            format={e => (!e.row.staff_usuario.fecha_salida) ? null : new SDate(e.data).toString("HH")}
          />

          <Col key={"horas"} label={SLanguage.select({ es: "Horas", en: "Times" })} width={60}
            dataType='number'
            textStyle={{
              fontWeight: "bold"
            }}
            data={e => {
              if (!e.row.staff_usuario.fecha_ingreso || !e.row.staff_usuario.fecha_salida) return "";
              let hora44 = this.calculador_hora(e.row?.staff_usuario.fecha_ingreso, e.row?.staff_usuario.fecha_salida);
              return hora44;
            }}
            format={e => isNaN(e.data) ? null : Number.isInteger(e.data) ? e.data : e.data.toFixed(2)}
          />

          <Col key={"sutbtotal"} label={SLanguage.select({ es: "Subtotal", en: "Subtotal" })} width={60}
            dataType='number'
            data={e => {
              if (!e.row.staff_usuario.fecha_ingreso || !e.row.staff_usuario.fecha_salida) return "";
              let hora44: any = this.calculador_hora(e.row?.staff_usuario.fecha_ingreso, e.row?.staff_usuario.fecha_salida);
              let dadda = parseFloat(hora44 ?? "") * e.row?.usuario_company?.salario_hora;
              return dadda;
            }}
            format={e => isNaN(e.data) ? null : Number.isInteger(e.data) ? e.data : e.data.toFixed(2)}
          />

        </DinamicTable>
      </SView>
    </SPage>
  }
}
