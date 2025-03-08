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
export default class historyAlvaro extends Component {

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




  console.log("cliee " + this.key_cliente_)
  return <SPage title={"Test"} disableScroll>
   <SView col={"xs-12"} flex>
    <DinamicTable


     loadData={this.loadData1111.bind(this)}
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

     <Col key={"key"} label={SLanguage.select({ es: "Fecha", en: "Date" })} width={80}
      data={e => ""}
     />

    </DinamicTable>
   </SView>
  </SPage>
 }
}
