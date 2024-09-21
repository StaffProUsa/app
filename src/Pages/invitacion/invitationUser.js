import React from 'react';
import { SGradient, SHr, SIcon, SImage, SPage, SText, STheme, SView, SLanguage, SNavigation, SDate, SLoad } from 'servisofts-component';

import PBarraFooter from '../Components/PBarraFooter';
import { Btn, Container } from '../Components';
import Model from '../Model';
import usuarios from './rol/profile/usuarios';
import SSocket from 'servisofts-socket';

export default class invitationUser extends React.Component {
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
    // let obj = {this.state.data};
    let usuario = this.state.usuario;
    return (
      <>
        <SPage titleLanguage={{ es: "Invitación Staff", en: "Invitation Staff" }}  >
          <SView col={'xs-12'} >
            <SHr height={25} />
            <Container >
              <SView col={'xs-12'} row center>
                <SView col={'xs-6'} >
                  <SText fontSize={18} language={{
                    es: "Hola " + usuario?.Nombres + " " + usuario?.Apellidos + "!",
                    en: "Hi " + usuario?.Nombres + " " + usuario?.Apellidos + "!"
                  }} />
                  <SText></SText>
                </SView>
                <SView col={'xs-6'} flex style={{ alignItems: "flex-end" }}>
                  <SView height={80} width={80} style={{ borderRadius: 50, backgroundColor:STheme.color.secondary }} center   >
                    {/* <SImage enablePreview src={SSocket.api.root + "company/" + obj?.company?.key} width={100} height={100} style={{ resizeMode: 'cover', borderRadius: 50 }} /> */}
                    <SIcon name={"Logo"} fill={STheme.color.primary} width={60} height={60} />
                  </SView>
                </SView>
              </SView>
              <SHr height={15} />
            </Container>
            <SView col={'xs-12'} center backgroundColor={STheme.color.secondary} padding={15}>
              <SText fontSize={22} color={STheme.color.text} language={{
                es: "¡Te invitamos a ser parte de Staff Pro USA!",
                en: "We invite you to be part of Staff Pro USA!"
              }} />
            </SView>
            <SHr height={30} />
            <Container>
              <SView col={'xs-11'} center>
                <SHr height={25} />
                <SView style={{
                  borderRadius: 100,
                  borderWidth: 2,
                  borderColor: STheme.color.warning,
                  padding: 20
                }}>
                  <SIcon name={'alerta'} fill={STheme.color.warning} width={50} height={50} />
                </SView>
                <SHr height={30} />
                <SText center fontSize={18} language={{
                  es: "Antes de continuar, para poder acceder a un trabajo, por favor completa la información de tu perfil.",
                  en: "Before continuing, in order to access a job, please complete your profile information."
                }} />
                <SHr height={25} />
                
             
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
                    SNavigation.navigate("/perfil/editar_")
                  }} backgroundColor={STheme.color.secondary}
                    loading={this.state.loading}

                  >
                    <SText fontSize={18} color={STheme.color.text} language={{
                      es: "IR A PERFIL",
                      en: "GO TO PROFILE"
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
