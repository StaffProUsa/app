import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SDate, SHr, SInput, SLanguage, SNavigation, SNotification, SPage, SText, STheme, SView } from 'servisofts-component';
import { Container } from '../../Components';
import InputFecha from '../../Components/NuevoInputs/InputFecha';
import InputSelect from '../../Components/NuevoInputs/InputSelect';
import Input from '../../Components/Input';
import InputFloat from '../../Components/NuevoInputs/InputFloat';
import InputHora from '../../Components/NuevoInputs/InputHora';
import SIconApp from '../../Assets/SIconApp';
import Model from '../../Model';
import SSocket from 'servisofts-socket';
import all from '../usuario/all';

export default class registro2 extends Component {

  key_company = SNavigation.getParam('key_company');
  key_cliente = SNavigation.getParam('key_cliente');

  state = {
    bookings: [
      this.createDefaultStaff(),
    ],
  }

  onChangeLanguage(language) {
    this.setState({ ...this.state })
  }

  componentDidMount() {
    SLanguage.addListener(this.onChangeLanguage.bind(this))
  }

  componentWillUnmount() {
    SLanguage.removeListener(this.onChangeLanguage)
  }

  data = {}
  handlePress() {
    if (this.inpDescripcion.verify() == false) return;
    const event = {
      "descripcion": this.inpDescripcion.getValue(),
      "observacion": this.inpObservacion.getValue(),
      "key_cliente": this.key_cliente,
      "key_company": this.key_company,
      "fecha": this.inpFecha.getValue(),
      // "staff": this.state.bookings
    }

    let valid = true;
    const all_staff = this.state.bookings.map((item, index) => {
      if (item._ref) {
        if (!item._ref.verify()) {
          valid = false;
        }
      }

      const fecha_inicio = event.fecha + " " + new SDate(item.fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("hh:mm") + new SDate().toString("TZD");
      let fecha_fin = "";
      console.log("item", item);
      if (!item.fecha_fin) {
        fecha_fin = new SDate(fecha_inicio, "yyyy-MM-ddThh:mm:ss").addDay(1).toString("yyyy-MM-dd hh:mm") + new SDate().toString("TZD");;
      } else {
        fecha_fin = event.fecha + " " + new SDate(item.fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("hh:mm") + new SDate().toString("TZD");;
      }
      console.log("fecha_inicio", fecha_inicio);
      console.log("fecha_fin", fecha_fin);
      // if(!item.fecha_fin)
      return {
        "descripcion": item.descripcion,
        "observacion": item.observacion,
        "key_evento": "this.state.key_evento",
        "key_staff_tipo": item.key_staff_tipo,
        "location": item.location,
        "fecha_inicio": fecha_inicio,
        "fecha_fin": fecha_fin,
        "cantidad": item.cantidad,
        "nivel_ingles": item.nivel_ingles
      }
      // const fecha_fin = new SDate(item.fecha_fin, "yyyy-MM-ddThh:mm:ss");


    })
    if (!valid) {
      SNotification.send({
        title: "Error",
        body: "Complete todos los campos",
        color: STheme.color.danger,
        time: 5000,
      })
      return;
    }

    this.registrarEventoConStaff(event, all_staff);

    // SSocket.sendPromise({
    //     component: "evento",
    //     type: "registro",
    //     data: event,
    //     key_usuario: Model.usuario.Action.getKey(),
    // }).then(e => {
    //     all_staff.forEach((item, index) => {
    //         item.key_evento = e.data.key;
    //         SSocket.sendPromise({
    //             component: "staff",
    //             type: "registro",
    //             data: item,
    //             key_usuario: Model.usuario.Action.getKey(),
    //         }).then(e => {
    //             console.log("staff registrado", e);
    //             SNotification.send({
    //                 title: "Success",
    //                 body: "Staff registrado",
    //                 color: STheme.color.success,
    //                 time: 5000,
    //             })
    //         }).catch(e=>{
    //             console.log(e);
    //             SNotification.send({
    //                 title: "Error",
    //                 body: "Error al registrar el staff",
    //                 color: STheme.color.danger,
    //                 time: 5000,
    //             })
    //         })

    //     })
    //     console.log(e);
    // }).catch(e => {
    //     console.log(e);
    //     SNotification.send({
    //         title: "Error",
    //         body: "Error al registrar el evento",
    //         color: STheme.color.danger,
    //         time: 5000,
    //     })
    // })

    console.log(event, all_staff);

  }

  registrarEventoConStaff = async (event, all_staff) => {
    try {
      const eventoRes = await SSocket.sendPromise({
        component: "evento",
        type: "registro",
        data: event,
        key_usuario: Model.usuario.Action.getKey(),
      });

      console.log("Evento registrado", eventoRes);
      const key_evento = eventoRes.data.key;

      for (const item of all_staff) {
        item.key_evento = key_evento;
        try {
          const res = await SSocket.sendPromise({
            component: "staff",
            type: "registro",
            data: item,
            key_usuario: Model.usuario.Action.getKey(),
          });
          console.log("Staff registrado", res);
          SNotification.send({
            title: "Success",
            body: "Staff registrado",
            color: STheme.color.success,
            time: 5000,
          });
        } catch (err) {
          console.log("Error al registrar staff", err);
          SNotification.send({
            title: "Error",
            body: "Error al registrar el staff",
            color: STheme.color.danger,
            time: 5000,
          });
        }
      }

      // Una vez que todos los staff están registrados, navegar
      // SNavigation.goBack();
      SNavigation.replace("/company/event", { key_evento: key_evento })

    } catch (err) {
      console.log("Error al registrar evento", err);
      SNotification.send({
        title: "Error",
        body: "Error al registrar el evento",
        color: STheme.color.danger,
        time: 5000,
      });
    }
  };

  createDefaultStaff() {
    return {
      "cantidad": 1,
      "descripcion": "",
      "descripcion_staff_tipo": "",
      "hora_fin": "",
      "hora_inicio": "",
      "fecha_fin": "",
      "fecha_inicio": "",
      "key_staff_tipo": "",
      "location": "",
      "nivel_ingles": "NONE",
      "observacion": "",

    }
  }
  render() {
    return <SPage titleLanguage={{
      es: "Registro de evento",
      en: "Event registration"
    }}>
      <Container>
        <SView col={"xs-12"}>
          <SHr h={16} />
          <SText language={{ en: "Date", es: "Fecha" }} />
          <SHr />
          <InputFecha ref={ref => this.inpFecha = ref}
            defaultValue={new SDate(this.data['fecha'], "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd") ?? new SDate().toString("yyyy-MM-dd")}
            onChange={(e) => {
              this.
                console.log(e);
            }} />

          <SInput required
            ref={ref => this.inpDescripcion = ref}
            label={SLanguage.select({
              es: "Nombre del evento",
              en: "Event name"
            })} />
          <SInput
            ref={ref => this.inpObservacion = ref}
            label={SLanguage.select({
              es: "Información sobre el evento",
              en: "Information about the event"
            })} type='textArea' />
          <SHr h={64} />
          <SView col={"xs-12"} row>
            <SText fontSize={18} flex bold underLine language={{ en: "Booking", es: "Reclutas" }} />
            {/* <SView width={30} height={30} onPress={() => {
                            this.state.bookings.push({});
                            this.setState({ bookings: this.state.bookings })
                        }} >
                            <SIconApp name='Add' />
                        </SView> */}
          </SView>
          <SHr height={15} />
          {this.state.bookings.map((item, index) => <InputPosition
            key={index + "booking"}
            key_company={this.key_company}
            staff={item}
            ref={ref => item._ref = ref}
            onDelete={() => {
              this.state.bookings.splice(index, 1);
              this.setState({ bookings: this.state.bookings })
            }}
          />)}
          {/* <SHr /> */}
          <SView col={"xs-12"} style={{ alignItems: "flex-end" }}>
            <SView width={100} height={35} onPress={() => {
              this.state.bookings.push(this.createDefaultStaff());
              this.setState({ bookings: this.state.bookings })
            }} row center
              style={{
                backgroundColor: STheme.color.danger,
                borderRadius: 4,
                // padding: 8,
                // justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <SIconApp name='iconAdd' width={15} height={15} fill={STheme.color.white} />
              <SView width={5} />
              <SText fontSize={14} color={STheme.color.white} >{SLanguage.select({ es: "Posición", en: "Position" })}</SText>
            </SView>
          </SView>
        </SView>
        <SHr h={64} />
        <SButtom large onPress={this.handlePress.bind(this)} type='secondary'>
          {this.state.loading ? <SLoad /> : <SText color={STheme.color.white} language={{ es: "GUARDAR", en: "SAVE" }} />}
        </SButtom>
        <SHr h={20} />
      </Container>
    </SPage>
  }
}



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

class InputPosition extends Component {
  _ref = {}

  state = {

  }
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

  verify() {
    let valid = true;

    if (!this._ref["tipo"].verify()) {
      valid = false;
    }
    if (!this._ref["cantidad"].verify()) {
      valid = false;
    }
    if (!this._ref["nivel_ingles"].verify()) {
      valid = false;
    }
    if (!this._ref["hora_inicio"].verify()) {
      valid = false;
    }
    if (!this._ref["hora_fin"].verify()) {
      valid = false;
    }
    if (!this._ref["descripcion"].verify()) {
      valid = false;
    }
    if (!this._ref["location"].verify()) {
      valid = false;
    }
    return valid;

    // this._ref["cantidad"].verify();
    // this._ref["nivel_ingles"].verify();
    // this._ref["hora_inicio"].verify();
    // this._ref["hora_fin"].verify();
    // this._ref["descripcion"].verify();

  }

  render() {

    // const a = {
    //     "descripcion": val.descripcion,
    //     "observacion": val.observacion,
    //     "key_evento": this.state.key_evento,
    //     "key_staff_tipo": dataTipo.key,
    //     "fecha_inicio": fecha_inicio.toString("yyyy-MM-dd hh:mmTZD"),
    //     "fecha_fin": fecha_fin.toString("yyyy-MM-dd hh:mmTZD"),
    //     "cantidad": val.cantidad,
    //     "nivel_ingles": val.nivel_ingles
    // }
    return <SView col={"xs-12"} row style={{
      justifyContent: "space-between",
      alignItems: "center",
      // borderBottomWidth: 1,
      // borderBottomColor: STheme.color.card,
      // paddingBottom: 16,
      paddingBottom: 15,
      paddingLeft: 15,
      paddingRight: 15,
      backgroundColor: STheme.color.card,
      borderRadius: 8,
      marginBottom: 25
    }}>
      <SView width={30} style={{
        position: "absolute",
        top: -45,
        right: -10,
      }} >
        <SHr h={36} />
        <SView width={30} height={30} onPress={this.props.onDelete}>
          <SIconApp name='iconDelete' fill={STheme.color.danger} />
        </SView>
      </SView>
      <SInput
        ref={r => this._ref["tipo"] = r}
        label={SLanguage.select({
          es: "Tipo de Staff",
          en: "Staff Type"
        })}
        col={"xs-5.5"}
        editable={false}
        placeholder={SLanguage.select({
          es: "Tipo de Staff",
          en: "Staff Type"
        })}
        required
        value={this.props.staff.descripcion_staff_tipo}
        onPress={() => {
          SNavigation.navigate("/staff_tipo", {
            key_company: this.props.key_company, onSelect: (e) => {
              const input = this._ref["tipo"];
              this.props.staff.descripcion_staff_tipo = e.descripcion;
              this.props.staff.key_staff_tipo = e.key;
              this.forceUpdate();
              // input.setValue(e.descripcion)
              // input.setData(e);
            }
          })
        }} />
      <SInput
        ref={r => this._ref["cantidad"] = r}
        type='number'
        // defaultValue={1}
        value={this.props.staff?.cantidad}
        col={"xs-3"}
        label={SLanguage.select({
          es: "Cantidad",
          en: "Quantity"
        })} required placeholder={"0"}
        onChangeText={e => {
          this.props.staff.cantidad = e;
          this.forceUpdate();
        }}
      />


      <Input col={"xs-3"} inputStyle={{
        height: 40,
        borderRadius: 4,
        backgroundColor: STheme.color.card,
        color: STheme.color.text,
      }}

        value={this.props.staff.nivel_ingles}
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
              backgroundColor: STheme.color.primary,
            },
            render: () => {

              return <SView col={"xs-12"} flex card>
                <InputSelect
                  data={["NONE", "BASIC", "MEDIUM", "ADVANCED"]}
                  onChange={val => {
                    // if (this._ref["nivel_ingles"]) {
                    this.props.staff.nivel_ingles = val;
                    this.forceUpdate();
                    // this._ref["nivel_ingles"].setValue(val)
                    // }
                  }}
                  ITEM_HEIGHT={30} />
              </SView>
            }
          })
        }}
      />

      <SInput col={"xs-12"}
        ref={r => this._ref["location"] = r}
        label={SLanguage.select({ es: "Ubicación", en: "Location" })} type='text' value={this.props?.staff?.location} onChangeText={e => {
          this.props.staff.location = e;
          this.forceUpdate();
        }} />

      <Input col={"xs-4"} inputStyle={{
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
        value={this.props.staff.hora_inicio}
        ref={r => this._ref["hora_inicio"] = r}
        keyboardType="numeric"
        label={SLanguage.select({
          en: "Start time",
          es: "Hora de inicio"
        })}
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
                  this.state.startTime = val;

                  this.props.staff.hora_inicio = new SDate(val, "hh:mm").toString("HH")
                  this.props.staff.fecha_inicio = new SDate(val, "hh:mm").toString("yyyy-MM-ddThh:mm:ss")
                  this.forceUpdate();
                  // if (this._ref["hora_inicio"]) {
                  //     console.log(val);
                  //     this._ref["hora_inicio"].setValue(new SDate(val, "hh:mm").toString("HH"))
                  // }
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
      <SView width={10} />
      <Input col={"xs-4"} inputStyle={{
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
        value={this.props.staff.hora_fin}
        //   required
        keyboardType="numeric"
        label={SLanguage.select({
          en: "End time",
          es: "Hora de fin"
        })}
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
                  this.state.endTime = val;

                  this.props.staff.hora_fin = new SDate(val, "hh:mm").toString("HH")
                  this.props.staff.fecha_fin = new SDate(val, "hh:mm").toString("yyyy-MM-ddThh:mm:ss")
                  this.forceUpdate();
                  // if (this._ref["hora_fin"]) {
                  //     this._ref["hora_fin"].setValue(new SDate(val, "hh:mm").toString("HH"))
                  //     // this._ref["hora_fin"].setValue(val)
                  // }
                }} />
              </SView>
            }
          });
        }}
      />
      <SView flex />

      <SInput
        ref={r => this._ref["descripcion"] = r}
        label={SLanguage.select({ es: "Descripción", en: "Description" })} type='textArea' value={this.props?.staff?.descripcion} onChangeText={e => {
          this.props.staff.descripcion = e;
          this.forceUpdate();
        }} />
    </SView>
  }
}