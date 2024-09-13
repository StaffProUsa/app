import React from 'react';
import { SGradient, SHr, SIcon, SImage, SPage, SText, STheme, SView, SLanguage, SNavigation, SDate, SLoad } from 'servisofts-component';

import PBarraFooter from '../Components/PBarraFooter';
import { Btn, Container } from '../Components';
import Model from '../Model';
import usuarios from './rol/profile/usuarios';
import SSocket from 'servisofts-socket';

export default class invitationDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: {},
      empresa: "Sofia"
    };
    this.key = SNavigation.getParam("key");
  }
  componentDidMount() {
    let usuario_ = Model.usuario.Action.getUsuarioLog();
    if (!usuario_) {
      SNavigation.navigate('login');
    }
    this.setState({ usuario: usuario_ })

    SSocket.sendPromise({
      component: "staff_usuario",
      type: "getInvitacionesPendientes",
      key_usuario: Model.usuario.Action.getKey()
    }).then(e => {
      this.setState({ data: e.data[this.key] })
    }).catch(e => {
      console.error(e);
    })
  }
  render() {
    // console.log(this.state.usuario)
    // console.log(this.state.data)
    let obj = this.state.data;
    let usuario = this.state.usuario;
    return (
      <>
        <SPage titleLanguage={{ es: "Invitación", en: "Invitation" }}  >
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
                    <SImage enablePreview src={SSocket.api.root + "company/" + obj?.company?.key} width={100} height={100} style={{ resizeMode: 'cover', borderRadius: 50 }} />
                  </SView>
                </SView>
              </SView>
              <SHr height={15} />
            </Container>
            <SView col={'xs-12'} center backgroundColor={STheme.color.secondary} padding={15}>
              <SText fontSize={22} color={STheme.color.text} language={{
                es: "¡Te invitamos a ser parte de " + obj?.company?.descripcion + "!",
                en: "We invite you to be part of " + obj?.company?.descripcion + "!"
              }} />
            </SView>
            <SHr height={30} />
            <Container>
              <SView col={'xs-11'} >
                <SText fontSize={18} language={{
                  es: "Necesitamos incorporar personas para el cargo de:",
                  en: "We need to incorporate people for the position of:"
                }} />
                <SHr height={25} />
                <SView col={'xs-12'} row center>
                  <SView col={'xs-6'} flex style={{ alignItems: "flex-end" }} >
                    <SView width={80} height={80}>
                      <SImage enablePreview src={SSocket.api.root + 'staff_tipo/' + obj?.staff_tipo?.key} width={100} height={100} style={{ resizeMode: 'contain', borderRadius: 10 }} />
                    </SView>
                  </SView>
                  <SView col={'xs-6'} row>
                    <SView width={20} />
                    <SText fontSize={17} >{obj?.staff_tipo?.descripcion}</SText>
                  </SView>

                </SView>
                <SHr height={25} />
                <SText fontSize={15} color={STheme.color.lightGray} center >
                  {"'"}{obj?.staff_tipo?.observacion}{"'"}
                </SText>
                <SHr height={25} />
                <SView col={'xs-12'} row center>
                  <SView col={'xs-6'} row >
                    <SIcon name={'eventi'} fill={STheme.color.primary} width={20} height={20} />
                    <SView width={8} />
                    <SText fontSize={20} language={{
                      es: "Evento:",
                      en: "Event:"
                    }} />
                  </SView>
                  <SView col={'xs-6'} >
                    <SText fontSize={20} color={STheme.color.lightGray} >{obj?.evento?.descripcion}</SText>
                  </SView>
                  <SHr height={10} />
                  <SView col={'xs-6'} row >
                    <SIcon name={'idate'} fill={STheme.color.primary} width={20} height={20} />
                    <SView width={8} />
                    <SText fontSize={20} language={{
                      es: "Fecha:",
                      en: "Date:"
                    }} />
                  </SView>
                  <SView col={'xs-6'} row>
                    <SText fontSize={20} color={STheme.color.lightGray} >{new SDate(obj?.evento?.fecha).toString("yyyy-MM-dd")}</SText>
                  </SView>
                  <SHr height={10} />
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
                  }} backgroundColor={STheme.color.darkGray} >
                    <SText fontSize={18} color={STheme.color.text} language={{
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
                      // SNavigation.navigate("/evento",{key:obj?.evento?.key});
                      // SNavigation.navigate("/inicio");
                      this.setState({ loading: false })
                      SNavigation.reset("/inicio");
                    }).catch(e => {
                      console.error(e);
                      this.setState({ loading: false, error: e.error })
                    })
                  }} backgroundColor={STheme.color.secondary}
                    loading={this.state.loading}

                  >
                    <SText fontSize={18} color={STheme.color.text} language={{
                      es: "ACEPTAR",
                      en: "ACCEPT"
                    }} />
                  </Btn>
                </SView>
              </SView>
            </Container>
            <SHr height={25} />
          </SView>
        </SPage>

        <SHr height={20} />
        {/* <PBarraFooter url={'reservas'} /> */}
      </>
    );
  }
}
