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
  SDate
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
      this.setState({ data: e.data })
    }).catch(e => {
      console.error(e);
    })
  }

  build_horario(obj) {
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
        <SText fontSize={10}>{new SDate(obj?.staff?.fecha_inicio).toString('MM-dd-yyyy hh:mm')}</SText>
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


  renderItem(obj) {
    let userCoordinador = Model.usuario.Action.getByKey(obj?.staff_usuario?.key_usuario_atiende)
    console.log("userCoordinador", userCoordinador)
    return <SView col={"xs-12"} row padding={8} style={{
      borderRadius: 16,
      borderWidth: 1,
      borderColor: STheme.color.darkGray,
      overflow: "hidden",
    }}>
      <Degradado />
      <SView col={"xs-2 sm-2"} row center>
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
      <SView col={"xs-10 sm-3.5"} >
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
      <SHr height={10} />
      <SHr h={1} color={STheme.color.card} />
      <SHr height={10} />
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
      <SHr height={10} />
      <SHr h={1} color={STheme.color.card} />
      <SHr height={10} />


      {this.build_horario(obj)}
      {/* <SHr height={5} /> */}
      {/* <SView col={"xs-2"} row center>
        <SIcon name={"asistencia2"} fill={STheme.color.gray} height={12} />
      </SView>
      <SView col={"xs-10"}  >
        <SText fontSize={12}>{obj?.asistencia_staff_usuario ? obj?.asistencia_staff_usuario.length : 0}</SText>
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
              <SText fontSize={12} color={STheme.color.text} language={{
                es: "VER HISTORIAL",
                en: "SEE HISTORY "
              }} />
            </SView>
          </SView>
        </SView>
        <SHr height={10} />
        <SList2 data={this.state.data} order={[{ key: "staff/fecha_inicio", order: "desc" }]} render={this.renderItem.bind(this)} />
      </>
    );
  }
}
const initStates = (state) => {
  return { state };
};
export default connect(initStates)(index);
