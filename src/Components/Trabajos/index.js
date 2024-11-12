import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
  SGradient,
  SHr,
  SIcon,
  SImage,
  SNavigation,
  SText,
  STheme,
  SView,
  SLanguage,
  SList2,
  SDate,
  SLoad
} from 'servisofts-component';
import Model from '../../Model';
import SSocket from 'servisofts-socket';
import Degradado from '../Degradado';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // this.page = SNavigation.getParam("page");
  }
  componentDidMount() {
    SSocket.sendPromise({
      component: "staff_usuario",
      type: "getTrabajosProximos",
      key_usuario: Model.usuario.Action.getKey()
    }).then(e => {
      e.data.map((obj) => {
        const f = new SDate(obj.evento.fecha, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd")
        const hi = new SDate(obj.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString("hh:mm:ss")
        const hf = new SDate(obj.staff.fecha_fin, "yyyy-MM-ddThh:mm:ss").toString("hh:mm:ss")
        obj.fecha_inicio = f + "T" + hi
        obj.fecha_fin = f + "T" + hf
      })
      this.setState({ data: e.data })
    }).catch(e => {
      console.error(e);
    })
  }

  build_horario_(obj) {
    return <SView col={"xs-12"}>
      {/* <SView row >
        <SText fontSize={12} color={STheme.color.gray} language={{
          es: "Fecha: ",
          en: "Date: "
        }} />
        <SText fontSize={12}>{new SDate(obj?.evento?.fecha).toString("yyyy-MM-dd")}</SText>
      </SView> */}
      <SView row >
        <SText fontSize={10} color={STheme.color.gray} language={{
          es: "Hora de inicio: ",
          en: "Start: "
        }} />
        {/* <SText fontSize={10}>{new SDate(obj?.staff?.fecha_inicio).toString("DAY dd de MON, hh:mm")}</SText>
        <SHr/> */}
        <SText fontSize={10}>{new SDate(obj?.evento?.fecha, "yyyy-MM-dd").toString('MONTH dd, yyyy')}</SText>
        <SView width={8} />
        <SText fontSize={10}>{new SDate(obj?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ss").toString('HH')}</SText>
        {/* toLocaleDateString */}
      </SView >
      {/* <SView row >
        <SText fontSize={10} color={STheme.color.gray} language={{
          es: "Hora de salida: ",
          en: "Departure: "
        }} />
        <SText fontSize={10}>{new SDate(obj?.staff?.fecha_fin).toString("DAY dd de MON, hh:mm")}</SText>
      </SView> */}
    </SView>
  }

  build_horario(obj) {
    return <SView col={"xs-12"} row>
      <SView col={"xs-4"} center >
        <SText fontSize={12} color={STheme.color.gray} language={{
          es: "Fecha",
          en: "Date"
        }} />
        <SText center bold fontSize={13}>{new SDate(obj?.evento?.fecha, "yyyy-MM-dd").toString('MONTH dd, yyyy')}</SText>
      </SView>
      <SView col={"xs-4"} center style={{
        borderLeftWidth: 1,
        borderColor: STheme.color.lightGray
      }}>
        <SText fontSize={12} color={STheme.color.gray} language={{
          es: "Hora Inicio",
          en: "Start Time"
        }} />
        <SText fontSize={14} bold color={STheme.color.text}>{new SDate(obj?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
      </SView>
      {(obj?.staff?.fecha_fin) ? <SView col={"xs-4"} center style={{
        borderLeftWidth: 1,
        borderColor: STheme.color.lightGray
      }}>
        <SText fontSize={12} color={STheme.color.gray} language={{
          es: "Hora Fin",
          en: "End Time"
        }} />
        <SText fontSize={14} bold color={STheme.color.text}>{new SDate(obj?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
      </SView> : null}

    </SView>
  }
  build_horario_asistencia(obj) {
    return <SView col={"xs-12"} row>
      <SView col={"xs-4"} center height={40}>
        <SText fontSize={12} color={STheme.color.gray} language={{
          es: "Asistencia",
          en: "Attendance"
        }} />
        {/* <SText center bold fontSize={13}>{new SDate(obj?.evento?.fecha, "yyyy-MM-dd").toString('MONTH dd, yyyy')}</SText>  */}
      </SView>
      <SView col={"xs-4"} center style={{
        borderLeftWidth: 1,
        borderColor: STheme.color.lightGray
      }}>

        {!obj?.staff_usuario?.fecha_ingreso ? null :
          <>
            <SText fontSize={12} color={STheme.color.gray} language={{
              es: "Ingreso",
              en: "Clock In"
            }} />
            <SText fontSize={14} bold color={STheme.color.text}>{new SDate(obj?.staff_usuario?.fecha_ingreso, "yyyy-MM-ddThh:mm:ss").toString("HH")}</SText>
          </>
        }
      </SView>
      {(obj?.staff?.fecha_fin) ? <SView col={"xs-4"} center style={{
        borderLeftWidth: 1,
        borderColor: STheme.color.lightGray
      }}>
        {!obj?.staff_usuario?.fecha_salida ? null :
          <>
            <SText fontSize={12} color={STheme.color.gray} language={{
              es: "Salida",
              en: "Clock Out"
            }} />
            <SText fontSize={14} bold color={STheme.color.text}>{new SDate(obj?.staff_usuario?.fecha_salida, "yyyy-MM-ddThh:mm:ss").toString("HH")}</SText>
          </>
        }
      </SView> : null}

    </SView>
  }

  build_asistencia(obj) {
    if (!obj?.asistencia_staff_usuario) return null
    return <SView col={"xs-12"} row>
      <SHr height={1} color={STheme.color.lightGray} />
      <SHr height={10} />
      <SView col={"xs-4"} center >
        <SText fontSize={14} bold color={STheme.color.success} language={{
          es: `Información de asistencia:`,
          en: `Attendance information:`
        }} />
      </SView>
      <SView col={"xs-4"} center >
        <SText fontSize={12} color={STheme.color.gray} language={{
          es: `Ingreso`,
          en: `Income`
        }} />
        <SText fontSize={14} bold color={STheme.color.text}>{new SDate(obj?.asistencia_staff_usuario[0].fecha_on, "yyyy-MM-ddThh:mm:ss").toString("HH")}</SText>
      </SView>
      {(obj?.asistencia_staff_usuario.length > 1) ? <SView col={"xs-4"} center style={{
        borderLeftWidth: 1,
        borderColor: STheme.color.lightGray
      }}>
        <SText fontSize={12} color={STheme.color.gray} language={{
          es: `Salida`,
          en: `Exit`
        }} />
        <SText fontSize={14} bold color={STheme.color.text}>{new SDate(obj?.asistencia_staff_usuario[obj?.asistencia_staff_usuario.length - 1].fecha_on, "yyyy-MM-ddThh:mm:ss").toString("HH")}</SText>
      </SView> : null}

    </SView>
  }


  renderItem(obj) {
    console.log("obj", obj?.staff_usuario?.key_usuario_atiende)
    let userCoordinador = Model.usuario.Action.getByKey(obj?.staff_usuario?.key_usuario_atiende)
    // if(!userCoordinador) return null
    let isInvitation = (obj?.staff_usuario?.estado == 2)

    const fecha = new SDate(obj?.evento?.fecha, "yyyy-MM-ddThh:mm:ss");
    const hora = new SDate(obj?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD");
    const sdate = new SDate(fecha.toString("yyyy-MM-dd") + "T" + hora.toString("hh:mm:ss"), "yyyy-MM-ddThh:mm:ss");
    const timerun = sdate.isBefore(new SDate())
    // console.log("obj", obj)

    let allowLoading = false;
    let estadoAsistencia = "";
    if (sdate.isAfter(new SDate())) {
      // Si la fecha inicio aun no paso
      estadoAsistencia = "Esperando la hora de ingreso..."
    } else if (!obj?.staff_usuario?.fecha_ingreso && !obj?.staff_usuario?.fecha_salida && new SDate(obj.fecha_fin, "yyyy-MM-ddThh:mm:ss").isBefore(new SDate())) {
      estadoAsistencia = "EL evento ya finalizo y no marcaste ingreso ni salida"
    } else if (!obj?.staff_usuario?.fecha_ingreso) {
      allowLoading = true;
      estadoAsistencia = "Debes marcar ingreso en el evento"
    } else if (!obj?.staff_usuario?.fecha_salida) {
      allowLoading = true;
      estadoAsistencia = "Debes marcar la salida"
    }



    return <SView col={"xs-12"} padding={8} style={{
      borderRadius: 16,
      borderWidth: 1,
      borderColor: STheme.color.lightGray,
      overflow: "hidden",
    }} >
      <Degradado />
      <SView row col={"xs-12"}  onPress={() => {
        if (isInvitation) {
          SNavigation.navigate("/invitationDetail", { key: obj?.staff_usuario?.key })
        } else {
          SNavigation.navigate("/evento", { key: obj?.evento?.key })
        }
      }}>
        <SView col={"xs-2 sm-2"} row center >
          <SView style={{
            width: 40,
            height: 40,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: STheme.color.darkGray,
            overflow: "hidden",
          }}>
            <SImage src={SSocket.api.root + "company/" + obj?.company?.key} style={{
              resizeMode: "cover",
            }} />
          </SView>
        </SView>
        <SView col={"xs-10 sm-3.5"} style={{paddingBottom:10}}>
          <SText fontSize={16}>{obj?.company?.descripcion}</SText>
          <SText fontSize={12} color={STheme.color.gray} language={{
            es: "Empresa",
            en: "Company"
          }} />
        </SView>
        {/* <SView col={"xs-12 sm-0.5"} height={8} /> */}
        {(obj?.staff_usuario?.key_usuario_atiende) ? <SView col={"xs-12 sm-6"} row >
          <SView col={"xs-2 sm-4"} row center>
            <SView width={40} height={40} style={{ borderRadius: 5, overflow: "hidden" }} backgroundColor={STheme.color.darkGray}>
              <SImage src={SSocket.api.root + "usuario/" + obj?.staff_usuario?.key_usuario_atiende} width={40} height={40} style={{ resizeMode: 'cover', overflow: "hidden" }} />
            </SView>
          </SView>
          <SView col={"xs-8 sm-8"}  >
            <SText>{userCoordinador?.Nombres} {userCoordinador?.Apellidos}</SText>
            <SText fontSize={12} color={STheme.color.gray} language={{
              es: "Coordinador",
              en: "Coordinator"
            }} />
          </SView>
        </SView> : null}
      </SView>
      <SHr height={10} />
      <SHr h={1} color={STheme.color.lightGray + "65"} />
      <SHr height={10} />
      <SView row col={"xs-12"}>
        <SView col={"xs-2 sm-2"} row >
          {/* <SIcon name={"eventi"} fill={STheme.color.gray} width={12} /> */}
          <SText fontSize={12} color={STheme.color.gray} language={{
            es: "Cliente: ",
            en: "Client: "
          }} />
        </SView>
        <SView col={"xs-10 sm-4.5"}  >
          <SText fontSize={12}>{obj?.cliente?.descripcion}</SText>
        </SView>
        {/* <SHr height={5} /> */}
        <SView col={"xs-12 sm-0.5"} height={10} />
      </SView>
      <SHr h={4} />
      <SView row col={"xs-12"}>
        <SView col={"xs-2 sm-2"} row >
          {/* <SIcon name={"eventi"} fill={STheme.color.gray} width={12} /> */}
          <SText fontSize={12} color={STheme.color.gray} language={{
            es: "Evento: ",
            en: "Event: "
          }} />
        </SView>
        <SView col={"xs-10 sm-4.5"}  >
          <SText fontSize={12}>{obj?.evento?.descripcion}</SText>
        </SView>
        {/* <SHr height={5} /> */}
        <SView col={"xs-12 sm-0.5"} height={10} />
        <SView col={"xs-2 sm-2"} row >
          {/* <SIcon name={"worki"} fill={STheme.color.gray} width={12} /> */}
          <SText fontSize={12} color={STheme.color.gray} language={{
            es: "Requiere: ",
            en: "Requires: "
          }} />
        </SView>
        <SView col={"xs-10 sm-3"}  >
          <SText fontSize={12}>{obj?.staff_tipo?.descripcion}</SText>
        </SView>
      </SView>
      <SHr height={10} />
      <SHr h={1} color={STheme.color.lightGray + "65"} />
      <SHr height={10} />


      {this.build_horario(obj)}
      <SHr height={5} />
      {this.build_horario_asistencia(obj)}
      <SHr height={5} />

      {this.build_asistencia(obj)}


      {/* <SView col={"xs-2"} row center>
        <SIcon name={"asistencia2"} fill={STheme.color.gray} height={12} />
      </SView>
      <SView col={"xs-10"}  >
        <SText fontSize={12}>{obj?.asistencia_staff_usuario ? obj?.asistencia_staff_usuario.length : 0}</SText>
      </SView> */}
      <SHr h={4} />
      {allowLoading ? <SLoad type='bar' /> : null}
      <SHr h={4} />
      <SText color={STheme.color.warning}>{estadoAsistencia}</SText>
      <SHr h={4} />
      {/* <SView withoutFeedback>
        <SText onPress={() => {
          console.log("aho ksa kas ")
        }} underLine>{"Clock in"}</SText>
      </SView> */}
    </SView>
  }

  render() {
    return (
      <>
        <SView col={"xs-12"} row>
          <SView col={"xs-6"}>
            <SText fontSize={18} bold language={{
              es: "Trabajos en curso",
              en: "Jobs in progress"
            }} />
          </SView>
          <SView col={"xs-6"} flex style={{ alignItems: "flex-end" }} center>
            <SView width={150} backgroundColor={STheme.color.secondary} padding={10} style={{
              borderRadius: 10,
              overflow: "hidden",
            }} row center onPress={() => {
              SNavigation.navigate("/history")
            }}>
              <SIcon name={"history"} fill={STheme.color.white} width={20} />
              <SView width={10} />
              <SText fontSize={12} color={STheme.color.white} language={{
                es: "VER HISTORIAL",
                en: "SEE HISTORY "
              }} />
            </SView>
          </SView>
        </SView>
        <SHr height={10} />
        <SList2 data={this.state.data}
          order={[{ key: "fecha_inicio", order: "asc" }]}
          render={this.renderItem.bind(this)} />
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(index);
