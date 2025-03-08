import React, { Component } from 'react';
import { Text, TextStyle, View } from 'react-native';
import { SDate, SIcon, SImage, SLanguage, SNavigation, SPage, SText, STheme, SView, } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { DinamicTable } from 'servisofts-table'

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
export default class historyAlvaro_back extends Component {

 // key_company_ = SNavigation.getParam("key_company")
 key_cliente_ = SNavigation.getParam("key_cliente")
 key_evento_ = SNavigation.getParam("key_evento")
 key_company_ = "b8118596-9980-4a27-aa4e-a48384095350";

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
   component: "staff_usuario",
   type: "getMisTrabajosEntreFechas",
   key_usuario: "798994df-71c1-4850-b45d-6fc2642e6fb3",
   fecha_inicio: fecha_inicio_statatio,
   fecha_fin: fecha_fin_statatio
  })

  return Object.values(resp.data);

 }



 calculador_hora(hora_inicio: string, hora_fin: string) {
  if (!hora_inicio) return "";
  const time = new SDate(hora_inicio, "yyyy-MM-ddThh:mm:ssTZD").diffTime(new SDate(hora_fin, "yyyy-MM-ddThh:mm:ssTZD"))
  return isNaN(time) ? "" : time / 1000 / 60 / 60;



 }

 render() {
  // console.log("cliee " + this.key_cliente_)
  return <SPage title={"Test"} disableScroll>
   <SView col={"xs-12"} flex>
    <DinamicTable
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

     <Col key={"fecha_00"} label={SLanguage.select({ es: "fecha", en: "fecha" })} width={100}
      dataType='date' data={e => new SDate(e.row.fecha_on, "yyyy-MM-dd").date}
      format={e => new SDate(e.data).toString("yyyy-MM-dd")} />

     <Col key={"fecha_01"} label={SLanguage.select({ es: "fecha invitacion", en: "fecha invitacion" })} width={100}
      dataType='date' data={e => new SDate(e.row.fecha_aprobacion_invitacion, "yyyy-MM-dd").date}
      format={e => new SDate(e.data).toString("yyyy-MM-dd")} />

     <Col key={"fecha_02"} label={SLanguage.select({ es: "horario incio", en: "horario incio" })} width={100}
      dataType='date' data={e => new SDate(e.row.fecha_ingreso, "yyyy-MM-dd").date}
      format={e => new SDate(e.data).toString("yyyy-MM-dd")} />

     <Col key={"fecha_03"} label={SLanguage.select({ es: "horario salida", en: "horario salida" })} width={100}
      dataType='date' data={e => new SDate(e.row.fecha_salida, "yyyy-MM-dd").date}
      format={e => new SDate(e.data).toString("yyyy-MM-dd")} />

      <Col key={"company_0001"} label={SLanguage.select({ es: "company", en: "company" })} width={120}
      data={e => `${e.row.company?.descripcion}`}
      customComponent={e => <ImageLabel label={e.data} src={SSocket.api.root + "com/" + e.row?.company?.key} textStyle={e.textStyle} />}
     />
     <Col key={"company_01"} label={SLanguage.select({ es: "Telefono", en: "Telefono" })} width={120} data={e => e.row.company.telefono} />
     <Col key={"company_02"} label={SLanguage.select({ es: "observacion", en: "observacion" })} width={70} data={e => e.row.company.observacion} />

     <Col key={"cliente_01"} label={SLanguage.select({ es: "cliente", en: "cliente" })} width={70} data={e => e.row.cliente.descripcion} />
     <Col key={"cliente_02"} label={SLanguage.select({ es: "Direccion", en: "Direccion" })} width={70} data={e => e.row.cliente.direccion} />
     <Col key={"cliente_03"} label={SLanguage.select({ es: "Fecha", en: "Date" })} width={150} data={e => e.row.cliente.fecha_on} />

     <Col key={"event_01"} label={SLanguage.select({ es: "Evento", en: "Evento" })} width={150} data={e => e.row.evento.descripcion} />
     <Col key={"event_02"} label={SLanguage.select({ es: "observacion", en: "observacion" })} width={70} data={e => e.row.evento.observacion} />
     <Col key={"event_03"} label={SLanguage.select({ es: "Fecha", en: "Fecha" })} width={80}
      dataType='date' data={e => new SDate(e.row.evento.fecha_aprobacion, "yyyy-MM-dd").date}
      format={e => new SDate(e.data).toString("yyyy-MM-dd")} />
     <Col key={"event_04"} label={SLanguage.select({ es: "Aprobacion", en: "Aprobacion" })} width={80}
      dataType='date' data={e => new SDate(e.row.evento.fecha_aprobacion, "yyyy-MM-dd").date}
      format={e => new SDate(e.data).toString("yyyy-MM-dd")} />
     <Col key={"event_2"} label={SLanguage.select({ es: "Invitacion", en: "Evento invitacion" })} width={80}
      dataType='date'
      data={e => new SDate(e.row.evento.fecha_aprobacion_invitacion, "yyyy-MM-dd").date}
      format={e => new SDate(e.data).toString("yyyy-MM-dd")} />

     <Col key={"staff_01"} label={SLanguage.select({ es: "staff", en: "staff" })} width={150} data={e => e.row.staff.descripcion} />
     <Col key={"staff_02"} label={SLanguage.select({ es: "Ingles", en: "Ingles" })} width={70} data={e => e.row.staff.nivel_ingles} />
     <Col key={"staff_tipo_01"} label={SLanguage.select({ es: "Tipo", en: "Tipo" })} width={90} data={e => e.row.staff_tipo.descripcion} />

     <Col key={"var_0"} label={SLanguage.select({ es: "employee_number", en: "employee_number" })} width={150} data={e => e.row.usuario_company?.employee_number} />
     <Col key={"var_1"} label={SLanguage.select({ es: "salario_hora", en: "employee_number" })} width={90} data={e => ""} />
     <Col key={"var_2"} label={SLanguage.select({ es: "usuario_atiende", en: "employee_number" })} width={90} data={e => ""} />
     <Col key={"var_3"} label={SLanguage.select({ es: "employee_number", en: "employee_number" })} width={90} data={e => ""} />

    </DinamicTable>
   </SView>
  </SPage>
 }
}
