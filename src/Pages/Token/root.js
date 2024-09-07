import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SDate, SHr, SIcon, SInput, SNavigation, SNotification, SPage, SText, STheme, SThread, SView, SLanguage} from 'servisofts-component';
import PBarraFooter from '../../Components/PBarraFooter';
import { Container } from '../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../Model';

export default class root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secondDuration: 60
    };
  }

  handleGetCode() {
    SSocket.sendPromise({
      component: "asistencia",
      type: "registro",
      data: {
        descripcion: "ASITENCIA TEST",
        key_usuario: Model.usuario.Action.getKey(),
        fecha: new SDate().addSecond(this.state.secondDuration).toString()
      },
      key_usuario: Model.usuario.Action.getKey(),
    }).then(e => {
      // this.setState({ time })
      this.input.setValue(e?.data?.codigo)
      // this.setState({ asistencia: e.data })
      new SThread(this.state.secondDuration * 1000, "asdasd",).start(() => {
        SNotification.send({
          title: "Codigo caducado",
          body: "El codigo caduco"
        })
        this.input.setValue("")
      })
    })
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
          <SView col={"xs-12"} center onPress={this.handleGetCode.bind(this)} style={{
            backgroundColor: STheme.color.secondary,
            borderRadius: 100,
            height: 105,
            width: 105,
          }}>
            <SIcon name='Logo' width={80} />
          </SView>
        </SView>
        <SView col={"xs-9"} style={{
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          backgroundColor: STheme.color.gray,
          height: 90,
          top: 20,
          left: -40,
          alignItems: "flex-end",
          padding: 10
        }}>
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
              letterSpacing: 20
            }}
            // label={"CODIGO"}
            placeholder={"______"}
            onChangeText={(e: string) => {
              if (!e) return e;
              e = e.replace(/[^0-9]/g, "")
              if (e.length > 6) {
                e = e.substring(0, 6)
              }
              if (!e) return "0";
              return e;
              // if (e != e) this.input.setValue(e);
              // return 4
            }}
          />
        </SView>
      </SView>
    </>
  }
  render() {
    return <SPage titleLanguage={{ es: "Asistencia", en: "Assistance" }}  footer={<PBarraFooter url={'/token'}   />}>
      <Container>
        {this.getToken()}
        <SButtom type='danger' onPress={() => {
          const code = this.input.getValue() ?? "";
          if (code.length < 6) {
            SNotification.send({
              title: "Error",
              body: "El codigo debe ser de 6 digitos",
              color: STheme.color.danger
            })
            return null;
          }
          SSocket.sendPromise({
            component: "asistencia",
            type: "asistir",
            codigo: code,
            key_usuario: Model.usuario.Action.getKey(),
          }).then(e => {
            SNotification.send({
              title: "Exito",
              body: "Se realizo la asistenncia con exito"
            })
            SNavigation.navigate("/token/exito")
          }).catch(e => {
            SNotification.send({
              title: "Error",
              body: "No se pudo realizar la asistencia.",
              color: STheme.color.danger
            })
            console.error(e);
          })
        }}>MARCAR</SButtom>

        <SHr h={50}/>
        <SText onPress={() => {
          SNavigation.navigate("/token/exito")
        }}>{"TEST VENTANA EXITO"}</SText>
      </Container>
    </SPage>
  }
}
