import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SDate, SHr, SIcon, SNavigation, SNotification, SPage, SPopup, SText, STheme, SView, SLanguage, SLoad } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import { Container } from '../../Components';
import Reclutas from './Components/Reclutas';
import Asistencias from './Components/Asistencias';
import Model from '../../Model';
import eventosPage from "../cliente/eventos"
import PBarraFooter from '../../Components/PBarraFooter';
import { MenuButtom, MenuPages } from 'servisofts-rn-roles_permisos';
export default class event extends Component {
  static INSTANCE: event;
  constructor(props) {
    super(props);
    this.state = {
    };
    this.key_evento = SNavigation.getParam("key_evento")
    event.INSTANCE = this;
  }


  onChangeLanguage(language) {
    this.setState({ ...this.state })
  }
  componentDidMount() {
    SLanguage.addListener(this.onChangeLanguage.bind(this))
    this.setState({ loading: true })
    SSocket.sendPromise({
      component: "evento",
      type: "getByKey",
      key: this.key_evento
    }).then(e => {
      this.setState({ data: e.data, loading: false })
    }).catch(e => {
      this.setState({ loading: false })
    })

    SSocket.sendPromise({
      component: "evento",
      type: "getEstadoReclutas",
      key_evento: this.key_evento
    }).then(e => {
      this.setState({ dataReclutas: e.data })
    }).catch(e => {

    })

  }
  componentWillUnmount() {
    SLanguage.removeListener(this.onChangeLanguage)
  }
  handleEliminar() {
    let lenguaje = SLanguage.language;
    SPopup.confirm({
      title: (lenguaje == "es") ? 'Eliminar' : 'Delete',
      message: (lenguaje == "es") ? '¿Está seguro de eliminar?' : 'Are you sure you want to delete?',
      onPress: () => {
        // evento.Actions.eliminar(this.state.data, this.props);
        SSocket.sendPromise({
          component: "evento",
          type: "editar",
          data: {
            key: this.key_evento,
            estado: 0,
          },
          key_usuario: Model.usuario.Action.getKey()
        }).then(e => {
          if (eventosPage.INSTANCE) eventosPage.INSTANCE.componentDidMount();
          SNavigation.goBack();
        }).catch(e => {
          SNotification.send({
            title: "error",
            body: "Error al eliminar",
            time: 5000,
          })
        })

      }
    });
  }

  EsFechaMenorOIgual(fecha) {
    if (!this.state?.dataReclutas) return <SLoad />;
    // Convertir la fecha de cadena a objeto Date
    const fechaObj = new Date(fecha);
    let result = false;

    // Obtener la fecha actual
    const fechaActual = new Date();
    let datas = this.state?.dataReclutas;

    // Object.keys(datas).forEach((key) => {
    //     const item = datas[key];
    //     let fechaIni = new Date(item.fecha_inicio);
    //     fechaIni.setDate(fechaIni.getDate() + 1);


    //     // let fechaObj = new Date(item.fecha_fin);
    //     let fechaObj = (item.fecha_fin === null) ? fechaIni : new Date(item.fecha_fin);

    //     if (fechaObj < fechaActual) {
    //         result = true;
    //     } else {
    //         result = false;
    //     }
    // });

    // return fechaObj.getDate() < fechaActual.getDate()
    return result;
  }

  renderHeader() {
    if (!this.state.data) return null;
    const { descripcion, observacion, fecha } = this.state.data
    return <SView col={"xs-12"} center>
      <SHr />
      <SView col={"xs-12"} row>
        <SView width={30} height={30} onPress={() => {
          this.handleEliminar()
          // SNavigation.navigate("/company/")registro
        }}>
          <SIcon name='Delete' />
        </SView>
        <SView width={32} />
        {(this.EsFechaMenorOIgual(new Date(fecha))) ? null : <SView width={30} height={30} onPress={() => {
          SNavigation.navigate('/evento/registro', { key_company: this.state?.data?.key_company, key: this.key_evento });
        }}>
          <SIcon name='Edit' />
        </SView>}

      </SView>
      <SHr />
      <SView col={"xs-12"} card center padding={10}>
        <SHr h={1} color={STheme.color.card} />
        <SHr h={10} />
        {/* <SText fontSize={10} col={"xs-12"} style={{ textAlign: "right" }} color={STheme.color.gray}>{new SDate(fecha, "yyyy-MM-ddThh:mm:ss").toString("MM-dd-yyyy hh:mm")}</SText> */}
        <SHr />
        <SText fontSize={18} center bold>{descripcion}</SText>
        <SHr />
        <SText fontSize={14} color={STheme.color.gray}>{observacion}</SText>
        <SHr />
        <SView row>
          <SText language={{
            en: "Start date:",
            es: "Fecha de inicio:"
          }} color={STheme.color.gray}
          />
          <SView width={10} />
          <SText fontSize={16} center color={STheme.color.text}>{new SDate(fecha, "yyyy-MM-ddThh:mm:ss").toString("MONTH dd, yyyy")}</SText>
        </SView>
        {(this.EsFechaMenorOIgual(new Date(fecha))) ? <SText fontSize={16} center color={STheme.color.danger} language={{
          en: "(Past event)",
          es: "(Evento pasado)"
        }} /> : null}
        <SHr h={25} />
        <SHr h={1} color={STheme.color.card} />
      </SView>
      <SHr h={15} />
      <SView col={"xs-12"} row center>
        <MenuPages path='/cliente/profile' permiso='ver'>

          {/* <MenuButtom
      icon={<SIcon name='Excel' />}
      label={SLanguage.select({
       en: "Report",
       es: "Reporte"
      })} url='/company/dashboardTimeSheets' params={{ pk: this.key_evento, }} />

     <MenuButtom
      icon={<SIcon name='Menu' />}
      label={SLanguage.select({ en: "timeSheets", es: "timeSheets" })} url='/company/timeSheets'
      params={{ key_company: this.state?.data?.key_company, key_cliente: this.state.data.key_cliente , key_evento: this.key_evento, }} /> */}


          <MenuButtom
            icon={<SIcon name='itimesheet' fill={STheme.color.text} />}
            label={SLanguage.select({ en: "Time Sheets", es: "Hoja de tiempos" })} url='/company/timeSheets'
            params={{ key_company: this.state?.data?.key_company, key_cliente: this.state.data.key_cliente, key_evento: this.key_evento, }} />
          <MenuButtom label={SLanguage.select({ en: "dashBoard", es: "dashBoard" })}
            // url='/company/dashboard' params={{ key_company: this.state?.data?.key_company, key_cliente: this.state.data.key_cliente, key_evento: this.key_evento, }}
            onPress={() => {
              SNavigation.navigation.navigate({ name: "/company/dashboard", params: { key_company: this.state?.data?.key_company, key_cliente: this.state.data.key_cliente, key_evento: this.key_evento, }, key: Math.random() })
            }}
            icon={<SIcon name='Excel' fill={STheme.color.text} />} />

        </MenuPages>


      </SView>
      <SHr h={15} />
      <SView col={"xs-12"} >
        <SView col={"xs-12"} row>
          <SText fontSize={18} language={{
            en: "Booking",
            es: "Reclutas"
          }} />
          <SView flex />
          {(!this.EsFechaMenorOIgual(new Date(fecha))) ?
            <SView width={30} height={30} onPress={() => {
              SNavigation.navigate("/staff/add", { key_evento: this.key_evento, key_company: this.state.data.key_company, fecha: new SDate(fecha, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd") })
            }}>
              <SIcon name='Add' />
            </SView> : null}
        </SView>
        {/* <SText card padding={16} o language={{ en: "Add new staff", es: "Crear nuevo staff" }}></SText> */}

        {/* <Reclutas key_evento={this.key_evento} /> */}
        <Reclutas data={this.state.dataReclutas} past={(this.EsFechaMenorOIgual(new Date(fecha)))} />
      </SView>
      {/* <SHr h={300} /> */}
      {/* <SHr h={1} color={STheme.color.card} /> */}
      <SHr h={25} />
      <Asistencias key_evento={this.key_evento} />
      <SHr h={50} />
    </SView >
  }
  render() {
    return <SPage
      // titleLanguage={{
      //     en: "Event",
      //     es: "Evento"
      // }}
      backAlternative={o => {
        if (this.state.data.key_cliente) {
          SNavigation.replace("/cliente/profile", { pk: this.state.data.key_cliente })
        } else {
          SNavigation.goBack();
        }
      }}
      onRefresh={() => {
        this.componentDidMount();
      }}
      footer={<PBarraFooter url={'/company'} />}
    >
      <Container loading={!this.state.data || this.state.loading}>
        {this.renderHeader()}
        <SHr h={50} />

      </Container>
      <SHr height={60} />
    </SPage>
  }
}
