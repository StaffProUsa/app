import React, { Component } from 'react';
import { Text, TextStyle, View } from 'react-native';
import { SDate, SIcon, SImage, SLanguage, SNavigation, SPage, SText, STheme, SView, } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { DinamicTable } from 'servisofts-table'
import { ExporterStateType } from 'servisofts-table/DinamicTable/DinamicTable';

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
export default class timeSheets extends Component {

  key_company_ = SNavigation.getParam("key_company")
  key_cliente_ = SNavigation.getParam("key_cliente")
  key_evento_ = SNavigation.getParam("key_evento")
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

  async loadData() {
    const resp: any = await SSocket.sendPromise({
      component: "board",
      type: "timesheet_company",
      key_company: this.key_company_
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

    // let filtrador = [];

    // if (this.key_cliente_) {
    //  filtrador.push({
    //   "col": "key_cliente",
    //   "type": "string",
    //   "operator": "=",
    //   "value": "Calistenia"
    //  })
    // }





    console.log("cliee " + this.key_cliente_)
    return <SPage title={"Time Sheet"} disableScroll>
      <SView col={"xs-12"} flex>
        <DinamicTable
          loadInitialState={async () => {

            let filters: ExporterStateType["filters"] = [];
            if (this.key_cliente_) {
              const clientResp: any = await SSocket.sendPromise({
                component: "cliente",
                type: "getByKey",
                key: this.key_cliente_
              })

              filters.push({
                "col": "key_cliente",
                "type": "string",
                "operator": "=",
                "value": clientResp?.data?.descripcion
              })
            }
            if (this.key_evento_) {
              const eventtResp: any = await SSocket.sendPromise({
                component: "evento",
                type: "getByKey",
                key: this.key_evento_
              })

              filters.push({
                "col": "key_evento",
                "type": "string",
                "operator": "=",
                "value": eventtResp?.data?.descripcion
              })
            }

            return {
              filters: filters,
            }
          }}

          loadData={this.loadData.bind(this)}
          colors={{
            text: STheme.color.text,
            // accent: STheme.color.secondary,
            border: STheme.color.card,
            // background: STheme.color.secondary,
            background: STheme.color.barColor,
            card: STheme.color.card
          }}
          cellStyle={{
            borderWidth: 0,
            height: 30,
            // borderBottomWidth:1,
          }}
          textStyle={{
            fontSize: 12,
          }}
        >

          <Col key={"fecha"} label={SLanguage.select({ es: "Fecha", en: "Date" })} width={80}
            dataType='date'
            data={e => new SDate(e.row.staff.fecha_inicio, "yyyy-MM-dd").date}
            format={e => new SDate(e.data).toString("yyyy-MM-dd")}
          // textStyle={{ color: STheme.color.success }}
          />




          <Col key={"key_cliente"} label={SLanguage.select({ es: "Cliente", en: "Client" })} width={100}
            data={e => {
              return e.row?.cliente.descripcion;
            }}
            customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "cliente/" + e.row?.cliente?.key} textStyle={e.textStyle} />}

          />


          <Col key={"key_evento"} label={SLanguage.select({ es: "Evento", en: "Event" })} width={100}
            data={e => {
              return e.row?.evento.descripcion;
            }}

          />

          <Col key={"employee_number"} label={SLanguage.select({ es: "Numero empleado", en: "Employee number" })} width={70}
            data={e => {
              return e.row?.usuario_company?.employee_number;
            }}
          />
          <Col key={"usuario"} label={SLanguage.select({ es: "Usuario", en: "User" })} width={120}
            data={e => `${e.row.usuario?.Nombres} ${e.row.usuario?.Apellidos}`}
            customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "usuario/" + e.row?.usuario?.key} textStyle={e.textStyle} />}
          />
          <Col key={"salario_hora"} label={SLanguage.select({ es: "Salario", en: "Salary" })} width={60}
            dataType='number'

            data={e => {
              return e.row?.usuario_company?.salario_hora;
            }}
            format={e => isNaN(e.data) ? null : Number.isInteger(e.data) ? e.data : e.data.toFixed(2)}
          />

          <Col key={"usuario_atiende"} label={SLanguage.select({ es: "Jefe", en: "Boss" })} width={80}
            data={e => `${e.row.usuario_atiende?.Nombres ?? ""} ${e.row.usuario_atiende?.Apellidos ?? ""}`}
            customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "usuario/" + e.row?.usuario_atiende?.key} textStyle={e.textStyle} />}
          />

          <Col key={"staff"} label={SLanguage.select({ es: "Posición", en: "Position" })} width={100}
            data={e => e.row.staff_tipo.descripcion}
            customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "staff_tipo/" + e.row?.staff_tipo?.key} textStyle={e.textStyle} />}
          />

          <Col key={"inicio"} label={SLanguage.select({ es: "Hora inicio", en: "Clock In" })} width={80}
            dataType='date'
            data={e => new SDate(e.row.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").date}
            format={e => new SDate(e.data).toString("HH")}
          />

          <Col key={"fin"} label={SLanguage.select({ es: "Hora fin", en: "Clock Out" })} width={80}
            dataType='date'
            data={e => (!e.row.staff_usuario.fecha_ingreso) ? null : new SDate(e.row.staff_usuario.fecha_salida, "yyyy-MM-ddThh:mm:ssTZD").date}
            format={e => (!e.row.staff_usuario.fecha_ingreso) ? null : new SDate(e.data).toString("HH")}
          />
          <Col key={"horas"} label={SLanguage.select({ es: "Horas", en: "Times" })} width={60}
            dataType='number'
            textStyle={{
              fontWeight: "bold"
            }}
            data={e => {
              if (!e.row.staff_usuario.fecha_ingreso) return "";
              let hora44 = this.calculador_hora(e.row.staff_usuario.fecha_ingreso, e.row.staff_usuario.fecha_salida);
              return hora44;
            }}
            format={e => isNaN(e.data) ? null : Number.isInteger(e.data) ? e.data : e.data.toFixed(2)}
          />


          <Col key={"sutbtotal"} label={SLanguage.select({ es: "Subtotal", en: "Subtotal" })} width={60}
            dataType='number'
            data={e => {
              let hora44: any = this.calculador_hora(e.row.staff_usuario.fecha_ingreso, e.row.staff_usuario.fecha_salida);
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
