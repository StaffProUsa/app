import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SDate, SHr, SInput, SNavigation, SPage, SPopup, SText, SView, SLanguage, STheme, SLoad } from 'servisofts-component';
import { Container } from '../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import list from "./list"
import event from '../company/event';
import Input from '../../Components/Input';
import InputFloat from '../../Components/NuevoInputs/InputFloat';
import InputHora from '../../Components/NuevoInputs/InputHora';
import InputSelect from '../../Components/NuevoInputs/InputSelect';
import PBarraFooter from '../../Components/PBarraFooter';

const formatTime = (time) => {
 if (!time) return;
 // Eliminar caracteres no numéricos, no ':' y no 'am/pm'
 let filtered = time.toLowerCase().replace(/[^0-9:apm]/g, '');

 // Verificar si tiene "am" o "pm" y eliminarlo temporalmente
 const isPM = filtered.includes('pm');
 const isAM = filtered.includes('am');
 filtered = filtered.replace(/am|pm/g, '').trim();

 // Separar en partes
 const parts = filtered.split(':');
 let hh = parts[0] || '';
 let mm = parts[1] || '';

 // Agregar ceros a la izquierda si es necesario
 hh = hh.padStart(2, '0');
 mm = mm.padStart(2, '0');

 // Convertir a formato de 24 horas si es necesario
 if (isPM && hh !== '12') {
  hh = String(parseInt(hh, 10) + 12).padStart(2, '0');
 } else if (isAM && hh === '12') {
  hh = '00';
 }

 // Limitar los valores de las horas y minutos
 if (parseInt(hh, 10) > 23) hh = '23';
 if (parseInt(mm, 10) > 59) mm = '59';

 // Unir de nuevo si no tiene minutos
 if (filtered.includes(':')) {
  return `${hh}:${mm}`;
 }
 return `${hh}:00`; // Si no incluye ':', asumir minutos '00'
};

const formatTime2 = (time: any) => {
 // Eliminar caracteres no numéricos y no ':'
 let filtered = time.replace(/[^0-9:]/g, '');

 // Separar en partes
 const parts = filtered.split(':');
 let hh = parts[0] || '';
 let mm = parts[1] || '';

 // Agregar ceros a la izquierda si es necesario
 hh = hh.padStart(2, '0');
 mm = mm.padStart(2, '0');

 // Limitar los valores de las horas y minutos
 if (parseInt(hh, 10) > 23) hh = '23';
 if (parseInt(mm, 10) > 59) mm = '59';

 // Unir de nuevo si no tiene minutos
 if (filtered.includes(':')) {
  return `${hh}:${mm}`;
 }
 return `${hh}:00`; // Si no incluye ':', asumir minutos '00'
}
const timeToMinutes = (time: any) => {
 const [hh, mm] = time.split(':').map(Number);
 return hh * 60 + mm;
};
export default class add extends Component {

 filterHorario(e: string) {
  // Permitir solo números y el carácter ':'
  let filtered = e.replace(/[^0-9:]/g, '');

  // Formatear a HH:MM
  const parts = filtered.split(':');
  if (parts.length > 2) return ''; // No más de un ':'

  let hh = parts[0] || '';
  let mm = parts[1] || '';

  // Limitar los valores de las horas y minutos
  if (hh.length > 2) {
   mm = hh.slice(2, 4);
   hh = hh.slice(0, 2);

   console.log("hay mm ", hh, ":", mm)

  }
  if (mm.length > 2) mm = mm.slice(0, 2);

  // Asegurarse de que horas y minutos sean válidos
  if (hh.length === 2 && parseInt(hh, 10) > 23) hh = '23';
  if (mm.length === 2 && parseInt(mm, 10) > 59) mm = '59';

  // Unir de nuevo si hay minutos
  if (hh.length === 2 && filtered.includes(':')) {
   filtered = `${hh}:${mm}`;
  } else {
   let adyen = ""
   console.log(e);
   if (filtered.includes(":")) {
    console.log(e);
    adyen = ":"
   }
   filtered = `${hh}${mm ? ':' + mm : adyen}`;
  }

  return filtered;
 }
 constructor(props) {
  super(props);
  this.state = {
   pk: SNavigation.getParam("pk"),
   key_evento: SNavigation.getParam("key_evento"),
   key_company: SNavigation.getParam("key_company"),
   fecha: SNavigation.getParam("fecha"),
   loading: false
  };
 }

 backAlternative(o) {
  if (this.state.pk) {
   SNavigation.replace("/company/event", { key_evento: this.state?.data?.key_evento })
  } else if (this.state.key_evento) {
   SNavigation.replace("/company/event", { key_evento: this.state.key_evento })
  } else {
   SNavigation.goBack();
  }
 }
 onChangeLanguage(language) {
  this.setState({ ...this.state })
 }
 componentDidMount() {
  SLanguage.addListener(this.onChangeLanguage.bind(this))

  if (!this.state.pk) return;
  SSocket.sendPromise({
   component: "staff",
   type: "getByKey",
   key: this.state.pk,
  }).then(e => {
   // this.setState({ data: e.data })
   this.state.data = e.data;
   this._ref["descripcion"].setValue(e.data.descripcion)
   this._ref["cantidad"].setValue(e.data.cantidad)
   // this.setState({ fecha: new SDate(e.data.fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd") })
   // this._ref["fecha_inicio"].setValue(new SDate(e.data.fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd"))
   if (e.data.fecha_inicio) {
    const hi = new SDate(e.data.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD")
    this._ref["hora_inicio"].setValue(hi.toString("HH"))
    console.log(hi);
   }
   // this._ref["fecha_fin"].setValue(new SDate(e.data.fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd"))
   if (e.data.fecha_fin) {
    this._ref["hora_fin"].setValue(new SDate(e.data.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH"))
   }
   this._ref["nivel_ingles"].setValue(e.data.nivel_ingles)
   console.log(e);

   SSocket.sendPromise({
    component: "staff_tipo",
    type: "getByKey",
    key: e.data.key_staff_tipo,
   }).then(e => {
    this._ref["tipo"].setValue(e.data.descripcion)
    this._ref["tipo"].setData(e.data)
    // this._ref["tipo"].setData(e.data)
   }).catch(e => {
    console.error(e);
   }
   )
  }).catch(e => {
   console.error(e);
  })
 }
 componentWillUnmount() {
  SLanguage.removeListener(this.onChangeLanguage)
 }
 handlePress() {
  const val = {}
  let valid = true;



  Object.keys(this._ref).map((k) => {
   const input: SInput = this._ref[k];

   if (input.verify) {

    // return <SLoad /> cargando;
    if (!input.verify()) {
     valid = false;
    } else {
     val[k] = input.getValue()
    }
   } else {
    val[k] = input.getValue()
   }

  })

  if (this._ref["tipo"]) {
   const data = this._ref["tipo"].getData();
   val["key_staff_tipo"] = data.key;
  }

  if (!valid) {
   return;
  }

  if (this.state.loading) {
   return;
   // this.setState({ loading: true })
  }
  this.setState({ loading: true })

  const tz = new SDate().getTimezone();

  if (this.state.pk) {
   // SSocket.sendPromise({
   //     component: "staff",
   //     type: "editar",
   //     data: {
   //         ...this.state.data,
   //         "descripcion": val.descripcion,
   //         "observacion": val.observacion,
   //         "fecha_inicio": val.fecha_inicio + " " + formatTime(val.hora_inicio ?? ""),
   //         "fecha_fin": val.fecha_fin + " " + formatTime(val.hora_fin ?? ""),
   //         cantidad: val.cantidad
   //     },
   //     key_usuario: Model.usuario.Action.getKey(),
   // }).then(e => {
   //     if (event.INSTANCE) event.INSTANCE.componentDidMount();
   //     SNavigation.goBack();
   // }).catch(e => {
   //     console.error(e);
   // })


   SSocket.sendPromise({
    component: "staff",
    type: "editar",
    data: {
     ...this.state.data,
     "descripcion": val.descripcion,
     "observacion": val.observacion,
     "fecha_inicio": !val.hora_inicio ? null : new SDate().toString("yyyy-MM-dd") + " " + formatTime(val.hora_inicio ?? "") + tz,
     "fecha_fin": !val.hora_fin ? null : new SDate().toString("yyyy-MM-dd") + " " + formatTime(val.hora_fin ?? "") + tz,
     cantidad: val.cantidad,
     nivel_ingles: val.nivel_ingles,
     key_staff_tipo: val.key_staff_tipo
    },
    key_usuario: Model.usuario.Action.getKey(),
   }).then(e => {
    // return <>
    //  <SLoad />
    //  <SText>ddd</SText>
    // </>

    console.log("ddddddddddd")
    this.setState({ loading: false })

    if (event.INSTANCE) event.INSTANCE.componentDidMount()
    SNavigation.goBack(this.backAlternative.bind(this));
   }).catch(e => {
    console.error(e);
    this.setState({ loading: false })
   })
  } else {
   const dataTipo = this._ref["tipo"].getData();
   SSocket.sendPromise({
    component: "staff",
    type: "registro",
    data: {
     "descripcion": val.descripcion,
     "observacion": val.observacion,
     "key_evento": this.state.key_evento,
     "key_staff_tipo": dataTipo.key,
     "fecha_inicio": !val.hora_inicio ? null : new SDate().toString("yyyy-MM-dd") + " " + formatTime(val.hora_inicio ?? "") + tz,
     "fecha_fin": !val.hora_fin ? null : new SDate().toString("yyyy-MM-dd") + " " + formatTime(val.hora_fin ?? "") + tz,
     cantidad: val.cantidad,
     nivel_ingles: val.nivel_ingles
    },
    key_usuario: Model.usuario.Action.getKey(),
   }).then(e => {
    this.setState({ loading: false })

    if (event.INSTANCE) event.INSTANCE.componentDidMount();
    SNavigation.goBack(this.backAlternative.bind(this));
   }).catch(e => {
    console.error(e);
    this.setState({ loading: false })

   })
  }


 }
 handleEliminar() {
  let lenguaje = SLanguage.language;
  SPopup.confirm({
   title: (lenguaje == "es") ? "¿Seguro de eliminar?" : "Are you sure to delete?",
   onPress: () => {
    SSocket.sendPromise({
     component: "staff",
     type: "editar",
     data: {
      key: this.state.data.key,
      estado: 0,
     },
     key_usuario: Model.usuario.Action.getKey(),
    }).then(e => {
     if (event.INSTANCE) event.INSTANCE.componentDidMount();
     SNavigation.goBack(this.backAlternative.bind(this));
    }).catch(e => {
     console.error(e);
    })
   }
  })

 }

 _ref = {}
 render() {
  let lenguaje = SLanguage.language;
  let tipo_staff = "Seleccione Tipo de staff";
  let descripcion = "Descripcion del staff";
  let cantidad = "Cantidad";
  let fecha_inicio = "Fecha de inicio";
  let hora_inicio = "Hora de inicio";
  let hora_fin = "Hora de fin";

  if (lenguaje == "en") {
   tipo_staff = "Select staff type";
   descripcion = "Staff description";
   cantidad = "Quantity";
   fecha_inicio = "Start date";
   hora_inicio = "Start time";
   hora_fin = "End time";
  }
  return <SPage titleLanguage={{ en: "Staff", es: "Staff" }}
   backAlternative={this.backAlternative.bind(this)}
   footer={<PBarraFooter url={'/company'} />}
  >
   <Container>
    <SView row col={"xs-12"} style={{
     justifyContent: "space-between"
    }}>
     {/* {this.state.pk ? null : <SInput
                        ref={r => this._ref["tipo"] = r}
                        label={tipo_staff}
                        col={"xs-7"}
                        editable={false}
                        placeholder={tipo_staff}
                        required
                        onPress={() => {
                            if (!this.state?.key_company) return;
                            SNavigation.navigate("/staff_tipo", {
                                key_company: this.state.key_company, onSelect: (e) => {
                                    const input: SInput = this._ref["tipo"];
                                    input.setValue(e.descripcion)
                                    input.setData(e);

                                }
                            })
                        }} />
                    } */}

     <SInput
      ref={r => this._ref["tipo"] = r}
      label={tipo_staff}
      col={"xs-7"}
      editable={false}
      placeholder={tipo_staff}
      // defaultValue={this.state?.data?.tipo?.descripcion}
      required
      onPress={() => {
       // if (!this.state?.key_company) return;
       SNavigation.navigate("/staff_tipo", {
        key_company: this.state.key_company, onSelect: (e) => {
         const input: SInput = this._ref["tipo"];
         input.setValue(e.descripcion)
         input.setData(e);

        }
       })
      }} />


     <SInput ref={r => this._ref["descripcion"] = r} label={descripcion} required placeholder={descripcion} type='textArea' />
     <SInput ref={r => this._ref["cantidad"] = r} type='number' defaultValue={1} col={"xs-7"} label={cantidad} required placeholder={"0"} />

     {/* <SInput ref={r => this._ref["fecha_inicio"] = r} disabled defaultValue={this.state.fecha} col={"xs-5.5"} type='date' label={fecha_inicio} required placeholder={"yyyy-MM-dd"} /> */}

     {/* <SView col={"xs-12 sm-7"} center>
                        <SHr />
                        <SHr />
                        <SText col={"xs-12"} language={{ en: "Start date", es: "Fecha de inicio" }}></SText>
                        <SHr />
                        <InputFecha ref={r => this._ref["fecha_inicio"] = r}  />
                    </SView> */}

     {/* <SInput ref={r => this._ref["hora_inicio"] = r} type='hour' col={"xs-5.5"} defaultValue={"00:01"} label={" "} placeholder={"hh:mm"} required onChangeText={(e => { */}
     {/* <SInput ref={r => this._ref["hora_inicio"] = r} type='hour' col={"xs-5.5"} label={" "} placeholder={"hh:mm"} required onChangeText={(e => {
                        const resp = this.filterHorario(e);
                        if (resp != e) {

                            this._ref["hora_inicio"].setValue(resp);
                        }
                    })} /> */}
     <Input col={"xs-12 sm-6"} inputStyle={{
      height: 40,
      borderRadius: 4,
      backgroundColor: STheme.color.card,
      color: STheme.color.text,
     }}
      // infoStyle={{
      //     color: STheme.color.text,
      //     fontSize: 12,
      // }}
      required
      ref={r => this._ref["hora_inicio"] = r}
      keyboardType="numeric"
      label={hora_inicio}
      labelStyle={{ color: STheme.color.text, fontSize: 12, fontFamily: "roboto", marginTop: 10 }}
      placeholder="HH:MM"
      // filter={this.filterHorario.bind(this)}
      onPress={(e) => {
       InputFloat.open({
        e: e, width: 120, height: 160,
        style: {
         backgroundColor: STheme.color.background,
         borderRadius: 4
        },
        render: () => {
         return <SView flex height card>
          <InputHora defaultValue={formatTime(this._ref["hora_inicio"].getValue())} onChange={val => {
           if (this._ref["hora_inicio"]) {
            this._ref["hora_inicio"].setValue(new SDate(val, "hh:mm").toString("HH"))
           }
          }} />
         </SView>
        }
       });
      }}
     // onChangeText={e => {
     //     // this._ref["hora_inicio"].setValue(e);
     //     this.state.hora_fin = e
     // }}
     />

     <Input col={"xs-12 sm-5"} inputStyle={{
      height: 40,
      borderRadius: 4,
      backgroundColor: STheme.color.card,
      color: STheme.color.text,
     }}
      // infoStyle={{
      //     color: STheme.color.text,
      //     fontSize: 12,
      // }}
      ref={r => this._ref["hora_fin"] = r}
      required
      keyboardType="numeric"
      label={hora_fin}
      labelStyle={{ color: STheme.color.text, fontSize: 12, fontFamily: "roboto", marginTop: 10 }}
      placeholder="HH:MM"
      filter={this.filterHorario.bind(this)}
      onPress={(e) => {
       InputFloat.open({
        e: e, width: 120, height: 160,
        style: {
         backgroundColor: STheme.color.background,
         borderRadius: 4
        },
        render: () => {
         return <SView flex height card>
          <InputHora defaultValue={formatTime(this._ref["hora_fin"].getValue())} onChange={val => {
           if (this._ref["hora_fin"]) {
            this._ref["hora_fin"].setValue(new SDate(val, "hh:mm").toString("HH"))
            // this._ref["hora_fin"].setValue(val)
           }
          }} />
         </SView>
        }
       });
      }}
     />
     <Input col={"xs-12 sm-5"} inputStyle={{
      height: 40,
      borderRadius: 4,
      backgroundColor: STheme.color.card,
      color: STheme.color.text,
     }}
      // infoStyle={{
      //     color: STheme.color.text,
      //     fontSize: 12,
      // }}
      ref={r => this._ref["nivel_ingles"] = r}

      label={SLanguage.select({ en: "English level", es: "Nivel de ingles" })}
      labelStyle={{ color: STheme.color.text, fontSize: 12, fontFamily: "roboto", marginTop: 10 }}
      placeholder={SLanguage.select({ en: "English level", es: "Nivel de ingles" })}
      // filter={this.filterHorario.bind(this)}
      onPress={(e) => {
       InputFloat.open({
        e: e,
        height: 180,
        width: 150,
        style: {
         backgroundColor: STheme.color.background
        },
        render: () => {
         return <SView col={"xs-12"} flex card>
          <InputSelect
           data={["NONE", "BASIC", "MEDIUM", "ADVANCED"]}
           onChange={val => {
            if (this._ref["hora_fin"]) {
             this._ref["nivel_ingles"].setValue(val)
            }
           }}
           ITEM_HEIGHT={30} />
         </SView>
        }
       })
      }}
     />
     {/* <SInput ref={r => this._ref["fecha_inicio"] = r} style={{display:"none"}} /> */}
     {/* <SInput ref={r => this._ref["fecha_fin"] = r} style={{display:"none"}} /> */}


     {/* <SInput ref={r => this._ref["fecha_fin"] = r} defaultValue={this.state.fecha} col={"xs-5.5"} type='date' label={"Fecha Fin"} required placeholder={"yyyy-MM-dd"} />
                    <SInput ref={r => this._ref["hora_fin"] = r} col={"xs-5.5"} label={" "} defaultValue={"23:59"} placeholder={"hh:mm"} required onChangeText={(e => {
                        const resp = this.filterHorario(e);
                        if (resp != e) {

                            this._ref["hora_fin"].setValue(resp);
                        }
                        // return this.filterHorario(e);
                    })} /> */}
    </SView>
    <SHr h={16} />

    <SView row col={"xs-12"} center>
     {this.state.pk ? <>

      <SView width={30} />
      <SButtom onPress={this.handleEliminar.bind(this)} type='secondary'><SText language={{ es: "ELIMINAR", en: "DELETE" }} color={STheme.color.white} /></SButtom>

      <SView width={30} />

      <SButtom onPress={this.handlePress.bind(this)} type='success'>
       {this.state.loading ?<SLoad/>:<SText color={STheme.color.white} language={{ es: "ACTUALIZAR", en: "SAVE" }} />}
      </SButtom>
     </>
      :
      <SButtom onPress={this.handlePress.bind(this)} type='secondary'>
       {this.state.loading ? <SLoad /> : <SText color={STheme.color.white} language={{ es: "GUARDAR", en: "SAVE" }} />}

       {/* <SText color={STheme.color.white} language={{ es: "GUARDAR", en: "SAVE" }} /> */}
      </SButtom>}




    </SView>

   </Container>
   <SHr h={105} />
  </SPage >
 }
}
