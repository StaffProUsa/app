import React, { Component } from 'react';
import { View, Text, RefreshControl, FlatList, ScrollView } from 'react-native';
import { SForm, SHr, SIcon, SLoad, SPage, SText, STheme, SView, SLanguage, SNavigation, SGradient, SDate } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { Container } from '../Components';
import PBarraFooter from '../Components/PBarraFooter';
import Model from '../Model';
import Calendar from '../Components/Calendar';
import MisStaffTipo from '../Components/MisStaffTipo';
import MisCompanys from '../Components/MisCompanys';

const CANTIDAD_X_PAGE = 30;

export default class Inicio extends Component {
  static INSTANCE: Inicio;
  ref = {}
  constructor(props) {
    super(props);
    Inicio.INSTANCE = this;
    this.state = {
      refreshing: false,
      page: 0,
      endData: false,
      data: [],
      dataTipo: [],
      fecha_inicio: new SDate("2024/09/01").toString("yyyy-MM-dd"),
      fecha_fin: new SDate("2024/09/30").toString("yyyy-MM-dd"),
    };

  }

  loadDataInvitaciones() {

    SSocket.sendPromise({
      component: "staff_usuario",
      type: "getInvitacionesPendientes",
      key_usuario: Model.usuario.Action.getKey()
    }).then(e => {
      this.setState({ invitaciones: e.data })
    }).catch(e => {
      console.error(e);
    })
  }
  componentDidMount() {

    // Actions.usuario_company.getAllCompanyUser().then(e => {

    // }).catch(e => {

    // })
    this.loadDataInvitaciones();

    this.state.data = []
    this.state.page = 0;
    this.state.endData = false;
    // this.getFiltros();
    SSocket.addEventListener("onMessage", this.handleSocketMessage.bind(this))
  }
  componentWillUnmount() {
    SSocket.removeEventListener("onMessage", this.handleSocketMessage.bind(this));
  }
  handleSocketMessage(obj) {
    if (obj.component == "staff_usuario" && obj.type == "invitarGrupoNotify") {
      this.loadDataInvitaciones();
    }
  }
  onChangeFavorito() {
    this.componentDidMount();
  }



  handleRefresh = async () => {
    this.state.page = 0;
    this.state.data = [];
    this.state.dataTipo = {};
    this.state.endData = false;
    this.setState({ data: [], refreshing: true })
    this.setState({ dataTipo: [], refreshing: true })
  };


  renderInvitaciones() {
    if (!this.state.invitaciones) return null
    let txtInvitacion = "";
    let txtInvitacion_en = "";
    if (this.state.invitaciones.length == 1) {
      txtInvitacion = "Tienes 1 invitación pendiente",
        txtInvitacion_en = "You have 1 pending invitation"
    } else {
      txtInvitacion = `Tienes ${this.state.invitaciones.length} invitaciones pendientes`,
        txtInvitacion_en = `You have ${this.state.invitaciones.length} pending invitations`
    }

    return <>
      <SView col={"xs-12"} padding={15} row
        style={{
          backgroundColor: "#F1C666",
          borderRadius: 14,
          borderLeftWidth: 4,
          borderLeftColor: "#DE7B26",


        }}>
        <SView col={"xs-2"} row center padding={5}>
          <SIcon name={"exclamacion2"} fill={"#DE7B26"} width={35} height={35} />
        </SView>
        <SView col={"xs-7"}  >
          <SText fontSize={16} bold color={"#585858"} language={{
            es: "AVISO IMPORTANTE",
            en: "IMPORTANT NOTICE"
          }} />
          <SText color={"#585858"} onPress={() => {
            // SNavigation.navigate("/invitations")
          }} language={{
            es: txtInvitacion,
            en: txtInvitacion_en
          }} />
        </SView>

        <SView col={"xs-3"} row center>
          <SView col={"xs-12"} row center padding={10} backgroundColor={"#585858"} onPress={() => {
            SNavigation.navigate("/invitations")
          }}
            style={{ borderRadius: 6 }}>
            <SText language={{
              es: "VER",
              en: "SEE"
            }} />
          </SView>
        </SView>
      </SView>


    </>
  }

  render() {
    return <SPage titleLanguage={{ es: "Próximos eventos", en: "Next events" }} preventBack footer={<PBarraFooter url={'/'} />} >
      <Container>
        <SView col={"xs-12"}>
          {this.state.invitaciones && this.state.invitaciones.length > 0 && <>
            <SHr h={10} />
            {this.renderInvitaciones()}
            <SHr h={10} />
          </>}
        </SView>
      </Container>
      <SView col={"xs-12"} center>
        <SView col={"xs-11.5"} center>
          {/* <MisCompanys /> */}
          <MisStaffTipo />
          <Calendar />
        </SView>
        <SHr height={60} />
      </SView>
    </SPage>
  }
}

