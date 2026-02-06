import React from 'react';
import { SGradient, SHr, SIcon, SImage, SPage, SText, STheme, SView, SLanguage, SNavigation, SDate, SLoad, SNotification } from 'servisofts-component';

import PBarraFooter from '../Components/PBarraFooter';
import { Btn, Container } from '../Components';
import Model from '../Model';
import usuarios from './rol/profile/usuarios';
import SSocket from 'servisofts-socket';
import MDL from '../MDL';
import PButtom from '../Components/PButtom';

export default class invitationDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: {},
      empresa: "Sofia",
      type: ""
    };
    this.key = SNavigation.getParam("key");
  }
  componentDidMount() {
    let usuario_ = Model.usuario.Action.getUsuarioLog();
    if (!usuario_) {
      SNavigation.navigate('/login');
    }
    this.setState({ usuario: usuario_ })

    // SSocket.sendPromise({
    //   component: "staff_usuario",
    //   type: "getInvitacionesPendientes",
    //   key_usuario: Model.usuario.Action.getKey()
    // }).then(e => {
    //   const d = e.data.find(a => a?.staff_usuario?.key == this.key);
    //   this.setState({ data: d })
    // }).catch(e => {
    //   console.error(e);
    // })

    SSocket.sendPromise({
      component: "staff_usuario",
      type: "getInvitacion",
      key: this.key,
      // key_usuario: Model.usuario.Action.getKey()
    }).then(e => {

      const key_usuario_actual = Model.usuario.Action.getKey();

      if (e.data.key_usuario != key_usuario_actual) {
        console.log("No es el mismo usuario");
        this.setState({
          type: "no_user"
        })
        return;
      }
      if (e.data.estado == 0) {
        console.log("La invitacion ya no esta disponible");
        this.setState({
          type: "no_disponible"
        })
        return;
      }
      if (e.data.estado == 1) {
        console.log("La invitacion ya fue aceptada");
        this.setState({
          type: "no_disponible"
        })
        return;
      }


      SSocket.sendPromise({
        component: "staff_usuario",
        type: "getInvitacionesPendientes",
        key_usuario: Model.usuario.Action.getKey()
      }).then(e => {
        const d = e.data.find(a => a?.staff_usuario?.key == this.key);
        this.setState({ data: d })
      }).catch(e => {
        console.error(e);
      })
      // const d = e.data.find(a => a?.staff_usuario?.key == this.key);
      // this.setState({ data: d })
    }
    );


  }

  diferenciaEs24Horas(fecha_inicio, fecha_fin) {
    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);

    const diffMs = fin.getTime() - inicio.getTime();
    const horas = diffMs / (1000 * 60 * 60);

    return horas === 24;
  }
  render() {
    // console.log(this.state.usuario)
    // console.log(this.state.data)
    let obj = this.state.data;
    let usuario = this.state.usuario;
    let lenguaje = SLanguage.language;

    //Validar fechas para no mostrar hora fin
    let es24horas = false;
    es24horas = this.diferenciaEs24Horas(obj?.staff?.fecha_inicio, obj?.staff?.fecha_fin);

    return (
      <>
        <SPage titleLanguage={{ es: "Invitación", en: "Invitation" }} onRefresh={(res) => {
          this.componentDidMount();
          if (res) res()
        }} >
          {this.state.type == "no_user" && <SView col={"xs-12"} center>
            <SHr height={30} />
            <SView col={"xs-8"} padding={15} center style={{
              borderRadius: 4,
              borderColor: STheme.color.secondary,
              borderWidth: 3,
              height: 300
            }}>
              <SText center fontSize={18} color={STheme.color.text} language={{
                es: "Esta invitación no corresponde a su usuario actual. Verifique que haya iniciado sesión con la cuenta correcta.",
                en: "This invitation does not correspond to your current user. Please make sure you are signed in with the correct account."
              }} />
              <SIcon name="Logo" width={80} height={80} fill={STheme.color.text} />
              <PButtom rojo small onPress={() => {
                SNavigation.navigate("/")
              }}><SText color={STheme.color.white} language={{
                es: "IR A INICIO",
                en: "GO HOME"
              }} /></PButtom>
            </SView>
          </SView>
          }
          {this.state.type == "" &&
            <SView col={'xs-12'} >
              <SHr height={25} />
              <Container loading={!this.state.data}>
                <SView col={'xs-12'} row center>
                  <SView col={'xs-6'} >
                    <SText fontSize={18} language={{
                      es: "Hola " + usuario?.Nombres + " " + usuario?.Apellidos + "!",
                      en: "Hi " + usuario?.Nombres + " " + usuario?.Apellidos + "!"
                    }} />
                    <SText></SText>
                  </SView>
                  <SView col={'xs-6'} flex style={{ alignItems: "flex-end" }}>
                    <SView height={80} width={80} style={{ borderRadius: 50, }} center   >
                      <SImage enablePreview src={SSocket.api.root + "company/" + obj?.company?.key} width={100} height={100} style={{ resizeMode: 'cover', borderRadius: 50, zIndex: 9 }} />
                      <SImage enablePreview src={require('../Assets/images/noImage.jpg')} width={100} height={100} style={{ resizeMode: 'cover', borderRadius: 50, position: "absolute" }} />
                    </SView>
                  </SView>
                </SView>
                <SHr height={15} />
              </Container>
              <SView col={'xs-12'} center backgroundColor={STheme.color.secondary} padding={15}>
                <SText fontSize={22} color={STheme.color.white} center language={{
                  // es: "¡Te invitamos a ser parte de " + obj?.company?.descripcion + "!",
                  // en: "We invite you to be part of " + obj?.company?.descripcion + "!"
                  es: "¡" + obj?.company?.descripcion + " te invita a ser parte de un nuevo evento!",
                  en: obj?.company?.descripcion + " invites you to be part of a new event!"

                }} />
              </SView>
              <SHr height={30} />
              <Container>
                <SView col={'xs-12'} >
                  <SText fontSize={18} language={{
                    es: "Necesitamos incorporar personas para el cargo de:",
                    en: "We need to incorporate people for the position of:"
                  }} />
                  <SHr height={25} />
                  <SView col={'xs-12'} row center>
                    <SView col={'xs-6'} flex style={{ alignItems: "flex-end" }} >
                      <SView width={80} height={80}>
                        <SImage enablePreview src={SSocket.api.root + 'staff_tipo/' + obj?.staff_tipo?.key} width={80} height={80} style={{ resizeMode: 'cover', borderRadius: 10, right: 5, zIndex: 9 }} />
                        <SImage src={require('../Assets/images/noImage.jpg')} width={80} height={80} style={{ resizeMode: 'cover', borderRadius: 10, position: "absolute", right: 10 }} />
                      </SView>
                    </SView>
                    <SView col={'xs-6'} flex>
                      {/* <SView width={20} /> */}
                      <SText fontSize={20} >{obj?.staff_tipo?.descripcion}</SText>
                      <SText fontSize={15} color={STheme.color.gray}  >
                        {obj?.staff_tipo?.observacion || "---"}
                      </SText>
                    </SView>

                  </SView>
                  <SHr height={20} />
                  <SView
                    row
                    col={'xs-12'}
                    center
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: STheme.color.card
                    }}></SView>
                  <SHr height={20} />
                  <SText fontSize={18} language={{
                    es: "Requerimientos:",
                    en: "Requirements:"
                  }} />
                  <SHr height={20} />
                  <SView col={'xs-12'} row center>
                    <SView col={'xs-12 sm-6'}  >
                      <SText fontSize={15} color={STheme.color.gray}  >* {obj?.staff?.descripcion || "---"}</SText>
                      <SHr height={15} />
                    </SView>

                    <SView col={'xs-12 sm-6'} row >
                      <SText fontSize={15} color={STheme.color.gray} center language={{
                        es: "* Nivel de inglés: ",
                        en: "* English level: "
                      }} />
                      <SText fontSize={15} color={STheme.color.gray} center >{obj?.staff?.nivel_ingles}</SText>
                      <SHr height={15} />
                      {/* <SText fontSize={15} color={STheme.color.gray} center language={{
                      es: "* Autorización para trabajar en USA: ",
                      en: " Authorization to work in USA: "
                    }} />
                    <SText fontSize={15} color={STheme.color.gray} center >{(obj?.cliente?.papeles) ? "YES" : "NO"}</SText> */}
                    </SView>
                    <SHr height={15} />
                    <SView col={'xs-12'}  >
                      <SHr height={20} />
                      <SText fontSize={16} language={{
                        es: "Más detalles:",
                        en: "More details:"
                      }} />
                      <SText fontSize={15} color={STheme.color.gray}  >{obj?.cliente?.observacion || "---"}</SText>
                    </SView>
                  </SView>
                  <SHr height={20} />
                  <SView
                    row
                    col={'xs-12'}
                    center
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: STheme.color.card
                    }}></SView>
                  <SHr height={20} />
                  <SView col={'xs-12'} row center>
                    <SView col={'xs-6'} row >
                      {/* <SIcon name={'eventi'} fill={STheme.color.primary} width={20} height={20} /> */}
                      <SView width={8} />
                      <SText fontSize={20} language={{
                        es: "Evento:",
                        en: "Event:"
                      }} />
                    </SView>
                    <SView col={'xs-6'} >
                      <SText fontSize={20} color={STheme.color.gray} >{obj?.evento?.descripcion}</SText>
                    </SView>
                    <SHr height={10} />
                    <SView col={'xs-6'} row >
                      {/* <SIcon name={'idate'} fill={STheme.color.primary} width={20} height={20} /> */}
                      <SView width={8} />
                      <SText fontSize={20} language={{
                        es: "Ubicación:",
                        en: "Location:"
                      }} />
                    </SView>
                    <SView col={'xs-6'} flex>
                      <SText fontSize={20} color={STheme.color.gray} >{obj?.cliente?.direccion}</SText>
                    </SView>
                    <SHr height={10} />
                    <SView col={'xs-6'} row >
                      {/* <SIcon name={'idate'} fill={STheme.color.primary} width={20} height={20} /> */}
                      <SView width={8} />
                      <SText fontSize={20} language={{
                        es: "Fecha:",
                        en: "Date:"
                      }} />
                    </SView>
                    <SView col={'xs-6'} row>
                      <SText fontSize={20} color={STheme.color.gray} >{new SDate(obj?.staff?.fecha_inicio).toString("MM-dd-yyyy")}</SText>
                    </SView>
                    <SHr height={10} />
                    <SView col={'xs-6'} row >
                      {/* <SIcon name={'idate'} fill={STheme.color.primary} width={20} height={20} /> */}
                      <SView width={8} />
                      <SText fontSize={20} language={{
                        es: "Hora Inicio:",
                        en: "Start time:"
                      }} />
                    </SView>
                    <SView col={'xs-6'} row>
                      <SText fontSize={20} color={STheme.color.gray} >{new SDate(obj?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                    </SView>
                    <SHr height={10} />
                    {(obj?.staff?.fecha_fin) ? <>
                      <SView col={'xs-6'} row >
                        <SView width={8} />
                        <SText fontSize={20} language={{
                          es: "Hora fin:",
                          en: "End time:"
                        }} />
                      </SView>
                      <SView col={'xs-6'} row>
                        <SText fontSize={20} color={STheme.color.gray} >{!es24horas ? new SDate(obj?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH") : "---"}</SText>
                      </SView><SHr height={10} /></> : null}



                    {/* <SView col={'xs-6'} row >
                    <SIcon name={'time'} fill={STheme.color.primary} width={20} height={20} />
                    <SView width={8} />
                    <SText fontSize={20} language={{
                      es: "Horario:",
                      en: "Schedule:"
                    }} />
                  </SView>
                  <SView col={'xs-6'} row>
                    <SText fontSize={20} color={STheme.color.lightGray} >08:30 AM - 12:30 PM</SText>
                  </SView> */}
                  </SView>
                  <SHr height={55} />
                  <SView col={'xs-12'} row center>
                    <Btn col={"xs-5"} onPress={() => {
                      // SNavigation.navigate("/registro")
                      let data = {
                        key: obj?.staff_usuario?.key,
                        fecha_rechazo: new SDate().toString(),
                        key_usuario: Model.usuario.Action.getKey(),
                        descripcion_rechazo: "Rechazado por el usuario",
                        estado: 0
                      }
                      SSocket.sendPromise({
                        component: "staff_usuario",
                        type: "editar",
                        // fecha_rechazo: new SDate().toString(),
                        // descripcion_rechazo: "Rechazado por el usuario",
                        // key_usuario: Model.usuario.Action.getKey(),
                        // key: obj.staff_usuario.key
                        data: data
                      }).then(e => {
                        console.log(e);
                        MDL.evento.dispatchEvent({ type: "onRecibeInvitation" })
                        // SNavigation.navigate("/evento",{key:obj?.evento?.key});
                        // SNavigation.navigate("/inicio");
                        this.setState({ loading: false })
                        SNavigation.goBack();
                      }).catch(e => {
                        console.error(e);
                        this.setState({ loading: false, error: e.error })
                      })

                    }} backgroundColor={STheme.color.darkGray} >
                      <SText fontSize={18} color={STheme.color.white} language={{
                        es: "NO, GRACIAS",
                        en: "NO, THANKS"
                      }} />
                    </Btn>
                    <SView width={25} />
                    <Btn col={"xs-5"} onPress={() => {
                      this.setState({ loading: true, error: "" })
                      SSocket.sendPromise({
                        component: "staff_usuario",
                        type: "aceptarInvitacion",
                        key_usuario: Model.usuario.Action.getKey(),
                        key_staff_usuario: obj.staff_usuario.key
                      }).then(e => {
                        console.log(e);
                        MDL.evento.dispatchEvent({ type: "onRecibeInvitation" })
                        // SNavigation.navigate("/evento",{key:obj?.evento?.key});
                        // SNavigation.navigate("/inicio");
                        this.setState({ loading: false })
                        SNavigation.goBack();
                      }).catch(e => {
                        console.error(e);
                        if (e.error_code == "YA_TIENE_POSICION") {

                          SNotification.send({
                            title: "Error",
                            body: lenguaje == "es" ? "Ya estás asignado en otro horario. Si deseas forzar la aceptación, por favor contacta con el administrador." : "You are already assigned to another schedule. If you want to force acceptance, please contact the administrator.",
                            color: STheme.color.danger,
                            time: 8000,
                          })
                        } else if (e.error_code == "EVENTO_LLENO") {

                          SNotification.send({
                            title: "Error",
                            body: lenguaje == "es" ? "Lo sentimos, los cupos para esta posición ya están completos." : "Sorry, the slots for this position are already full.",
                            color: STheme.color.danger,
                            time: 8000,
                          })
                        } else {
                          SNotification.send({
                            title: "Error",
                            body: e.error,
                            color: STheme.color.danger,
                            time: 8000,
                          })
                        }
                        this.setState({ loading: false, error: e.error })
                      })
                    }} backgroundColor={STheme.color.secondary}
                      loading={this.state.loading}

                    >
                      <SText fontSize={18} color={STheme.color.white} language={{
                        es: "ACEPTAR",
                        en: "ACCEPT"
                      }} />
                    </Btn>
                  </SView>
                </SView>
              </Container>
              <SHr height={25} />
            </SView>}
          {this.state.type == "no_disponible" &&
            <SView col={"xs-12"} center>
              <SHr height={30} />
              <SView col={"xs-8"} padding={15} center style={{
                borderRadius: 4,
                borderColor: STheme.color.secondary,
                borderWidth: 3,
                height: 300
              }}>
                <SText center fontSize={22} color={STheme.color.text} language={{
                  es: "La invitación ya no existe",
                  en: "The invitation no longer exists"
                }} />
                <SIcon name="Logo" width={80} height={80} fill={STheme.color.text} />
                <PButtom rojo small onPress={() => {
                  SNavigation.navigate("/")
                }}><SText color={STheme.color.white} language={{
                  es: "IR A INICIO",
                  en: "GO HOME"
                }} /></PButtom>
              </SView>

            </SView>
          }
        </SPage >

        <SHr height={20} />
        {/* <PBarraFooter url={'reservas'} /> */}
      </>
    );
  }
}
