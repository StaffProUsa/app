import React from 'react';
import { SGradient, SHr, SIcon, SNavigation, SPage, SText, STheme, SView, SLanguage, SThread, SImage, SInput, SPopup } from 'servisofts-component';

import PBarraFooter from '../../Components/PBarraFooter';
import { Container } from '../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import { Platform } from 'react-native';
import PackageJson from "../../../package.json"
import PButtom from '../../Components/PButtom';

export default class Sorry extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      foto_id: 0
    };

    this.key = SNavigation.getParam('key');

  }

  componentDidMount() {
    let usuario = Model.usuario.Action.getUsuarioLog();
    this.setState({ usuario: usuario })
  }



  getPerfil() {
    var usuario = this.state.usuario;
    if (!usuario) {
      return <SView col={"xs-12"} center><SIcon name={"User"} width={80} height={80} /></SView>
    }
    return <>
      <SView col={"xs-12"} center row>
        <SView col={"xs-3"} >
          <SView
            style={{
              width: 80,
              height: 80,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <SView
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: STheme.color.card,
                borderRadius: 8,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: STheme.color.card
              }}>
              <SImage
                src={`${SSocket.api.root}usuario/${usuario.key
                  }?time=${new Date().getTime()}`}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: "cover"
                }}
              />
            </SView>
          </SView>
        </SView>
        <SView col={"xs-0.5"} />
        <SView col={"xs-7.5"} >
          <SView col={"xs-12"} row >
            <SIcon name={"User"} width={15} height={15} fill={STheme.color.text} />
            <SView width={5} />
            <SText fontSize={16} color={STheme.color.lightGray}>{usuario.Nombres} {usuario.Apellidos}</SText>
          </SView>
          <SView col={"xs-12"} row >
            <SIcon name={"InputEmail"} width={15} height={15} fill={STheme.color.text} />
            <SView width={5} />
            <SText fontSize={16} color={STheme.color.lightGray}>{usuario.Correo}</SText>
          </SView>
        </SView>
      </SView>
    </>
  }

  getToken() {
    return <>
      <SView col={"xs-12"} row>
        <SView col={"xs-3"} center style={{
          borderWidth: 1,
          borderColor: STheme.color.background,
          borderRadius: 100,
          backgroundColor: STheme.color.gray,
          height: 130,
          width: 130,
          right: -10,
          zIndex: 99,
          padding: 11
        }}>
          <SView col={"xs-12"} center style={{
            backgroundColor: STheme.color.secondary,
            borderRadius: 100,
            height: 105,
            width: 105,
          }}>
            <SIcon name='Logo' width={80} />
          </SView>
        </SView>
        <SView col={"xs-9"} style={{
          // borderWidth: 1,
          // borderColor: STheme.color.background,
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          backgroundColor: STheme.color.gray,
          height: 90,
          top: 20,
          left: -40,
          alignItems: "flex-end",
          padding: 10
        }}>
          {/* <SText fontSize={20} bold>123456</SText> */}
          <SInput
            ref={ref => this.input = ref}
            style={{
              textAlign: "right",
              padding: 5,
              height: 70,
              borderWidth: 0,
              right: 0,
              fontSize: 30,
              borderRadius: 12,
            }}
            // label={"CODIGO"}
            placeholder={"_ _ _ _ _ _"}
          // iconR={
          //   <SView width={60} center card height onPress={() => {
          //     const code = this.input.getValue();
          //     SSocket.sendPromise({
          //       component: "asistencia",
          //       type: "asistir",
          //       codigo: code,
          //       key_usuario: Model.usuario.Action.getKey(),
          //     }).then(e => {
          //       console.log(e);
          //     }).catch(e => {
          //       console.error(e);
          //     })
          //   }}><SText>SUBIR</SText></SView>
          // }
          />
        </SView>
      </SView>
    </>
  }

  render() {
    console.log(this.state.data)
    // console.log(this.state.usuario)
    const { descripcion } = this.state.data ?? {};
    // const { usuario } = this.state.usuario ?? {};
    // const usuario = this.state.usuario ?? {};
    // console.log(data)
    return (
      <>
        <SPage title={'Enter token'} footer={<PBarraFooter url={'/trabajos'} />}>
          <SHr height={20} />
          <Container>
            <SView col={'xs-12'}  >
              <SText fontSize={20} bold>{descripcion}</SText>
            </SView>
            <SHr height={35} />
            {this.getPerfil()}
            <SHr height={40} />
            <SView col={'xs-12'}  >
              <SText fontSize={20} bold language={{
                es: "Ingresa el token de su coordinador",
                en: "Enter your coordinator's token"
              }} />
              <SHr height={15} />
            </SView>

            {this.getToken()}
            <SHr height={30} />
            <SView col={"xs-11"} row center>
              <PButtom rojo onPress={() => {
                this.setState({ loading: true, error: "" })
                const code = this.input.getValue();
                console.log(code)
                SSocket.sendPromise({
                  component: "asistencia",
                  type: "asistir",
                  codigo: code,
                  key_usuario: Model.usuario.Action.getKey(),
                }).then(e => {
                  console.log(e);
                  this.setState({ loading: false })
                  SPopup.alert("Success", "You have successfully entered the token", () => {
                    SNavigation.reset("/inicio");
                  })
                }).catch(e => {
                  console.error(e);
                  this.setState({ loading: false, error: e.error })
                  SPopup.alert("Error", e.error)
                })
              }}
                loading={this.state.loading}
              >
                <SText color={STheme.color.text} language={{
                  es: "INICIAR",
                  en: "START"
                }} />
              </PButtom>
              <SHr height={25} />
              {/* <PButtom secondary onPress={() => {

              }}>
                <SText color={STheme.color.text} language={{
                  es: "CANCELAR",
                  en: "CANCEL"
                }} />
              </PButtom> */}
            </SView>
          </Container>
          <SHr height={25} />
        </SPage>

        <SHr height={20} />
        {/* <PBarraFooter url={'reservas'} /> */}
      </>
    );
  }
}
