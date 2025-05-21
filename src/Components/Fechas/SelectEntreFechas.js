import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { SDate, SIcon, SInput, SNavigation, SText, STheme, SThread, SView } from 'servisofts-component'

type DataType = {
 fecha_inicio: String,
 fecha_fin: String,
}
type SelectEntreFechasProps = {
 onChange: (e: { fecha_inicio: string; fecha_fin: string }) => void;
 fecha_inicio: string;
 fecha_fin: string;
} & DataType
export default class SelectEntreFechas extends Component<SelectEntreFechasProps> {
 constructor(props) {
  super(props);

  this.state = {
   fecha_inicio: this.props.fecha_inicio ?? new SDate().toString("yyyy-MM-dd"),
   fecha_fin: this.props.fecha_fin ?? new SDate().toString("yyyy-MM-dd"),
  }


  // this.state.fecha_inicio = SNavigation.getParam("fecha_inicio", SelectEntreFechas.defaultProps.fecha_inicio)
  // this.state.fecha_fin = SNavigation.getParam("fecha_inicio", SelectEntreFechas.defaultProps.fecha_fin)
 }

 componentDidMount() {
  new SThread(100, "kekeke").start(() => {
   this.props.onChange(this.state)
  })
 }

 handleChange(key, e) {
  // this.setState({ fecha_fin: e })
  // console.log(e, key)
  if (this.state[key] == e) return;
  this.state[key] = e;
  this.props.onChange(this.state)

 }
 render() {
  return <>
   <SView row >
    <SView row width={140} padding={4} center>
     <SIcon name='eventos' width={16} height={16} style={{ padding: 4 }} fill={STheme.color.text} />
     <SText language={{ es: "Desde ", en: "From " }} />
     <SInput flex type='date' style={{
      padding: 0,
      textAlign: "center",
      fontSize: 12
     }} height={26} defaultValue={this.state.fecha_inicio} onChangeText={this.handleChange.bind(this, "fecha_inicio")}
     // placeholder={}
     />
    </SView>
    <SView row width={140} padding={4} center>
     <SIcon name='eventos' width={16} height={16} style={{ padding: 4 }} fill={STheme.color.text} />

     <SText language={{ es: "Hasta ", en: "to "}}
     />
     <SInput flex type='date' height={26} style={{
      padding: 0,
      textAlign: "center",
      fontSize: 12
     }} defaultValue={this.state.fecha_fin} onChangeText={this.handleChange.bind(this, "fecha_fin")} />
    </SView>
   </SView>
  </>
 }
}