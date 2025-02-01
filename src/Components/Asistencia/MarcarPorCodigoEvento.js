import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SDate, SHr, SIcon, SInput, SNavigation, SNotification, SPage, SText, STheme, SThread, SView, SLanguage, SImage, SLoad } from 'servisofts-component';
import PBarraFooter from '../PBarraFooter';
import { Container } from '../';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import PButtom from '../PButtom';
import Trabajos from '../Trabajos';

export default class MarcarPorCodigoEvento extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secondDuration: 60
        };
    }

    input: SInput
    handleGetCode() {
        SSocket.sendPromise({
            component: "asistencia",
            type: "registro",
            data: {
                descripcion: "ASITENCIA TEST",
                key_usuario: Model.usuario.Action.getKey(),
                // fecha: new SDate().addSecond(this.state.secondDuration).toString()
            },
            key_usuario: Model.usuario.Action.getKey(),
        }).then(e => {

            // this.setState({ time })
            this.input.setValue(e?.data?.codigo)
            // this.input.setValue("")
            // this.setState({ asistencia: e.data })
            // new SThread(this.state.secondDuration * 1000, "asdasd",).start(() => {
            //   SNotification.send({
            //     title: "Codigo caducado",
            //     body: "El codigo caduco"
            //   })
            //   this.input.setValue("")
            // })
        })
    }
    getToken() {
        return <>
            <SView col={"xs-12"} row>
                <SView col={"xs-3"} center height style={{
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
                    <SView col={"xs-12"} center height onPress={(this.props?.dataJefe) ? this.handleGetCode.bind(this) : null} style={{
                        backgroundColor: STheme.color.secondary,
                        borderRadius: 100,
                        padding: 10,
                        // height: 105,
                        // width: 105,
                    }}>
                        {/* <SIcon name='Logo' width={80} /> */}
                        {/* <SImage source={require("../../Assets/images/logoToken.png")}  /> */}
                        <SImage src={require('../../Assets/images/logoToken.png')} style={{ resizeMode: "contain", zIndex: 9, }} />
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
                            fontSize: 25,
                            borderRadius: 12,
                            letterSpacing: 11,
                            backgroundColor: STheme.color.white,
                            color: STheme.color.black,
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
        let lenguaje = SLanguage.language;
        return <SView col={"xs-12"} center >
            <SHr h={20} />

            {(this.props?.dataJefe) ? <SText fontSize={20} center bold color={STheme.color.text} >{SLanguage.select({
                en: "You have been assigned as event leader",
                es: "Has sido asignado como jefe del evento"
            })}</SText> : <SText fontSize={20} center bold color={STheme.color.text} >{SLanguage.select({
                en: "Enter the code to start the event",
                es: "Ingresa el código para iniciar el evento"
            })}</SText>}


            <SHr h={20} />
            {this.getToken()}
            <SHr h={40} />
            <PButtom rojo onPress={() => {
                const code = this.input.getValue() ?? "";
                if (code.length < 6) {
                    SNotification.send({
                        title: "Error",
                        body: (lenguaje == "es") ? "El código debe ser de 6 digitos" : "The code must be 6 digits",
                        color: STheme.color.danger,
                        time: 5000
                    })
                    return null;
                }
                SNotification.send({
                    key: "asistencia",
                    title: SLanguage.select({
                        en: "Performing Attendance",
                        es: "Realizando asistencia"
                    }),
                    body: SLanguage.select({
                        en: "Please wait a moment",
                        es: "Espere un momento"
                    }),
                    type: "loading",
                })
                SSocket.sendPromise({
                    component: "asistencia",
                    type: "asistirEvento",
                    codigo: code,
                    key_evento: this.props.key_evento,
                    key_usuario: Model.usuario.Action.getKey(),
                }).then(e => {
                    this.setState({ reload: true })
                    new SThread(1000, "ASdas").start(() => {
                        this.setState({ reload: false })
                    })
                    SNotification.send({
                        key: "asistencia",
                        title: "Exito",
                        body: (lenguaje == "es") ? "Se realizó la asistencia con éxito" : "The assistance was successful",
                        time: 5000
                    })
                    SNavigation.navigate("/token/exito")
                }).catch(e => {
                    SNotification.send({
                        key: "asistencia",
                        title: "Error",
                        body: (lenguaje == "es") ? "No se pudo realizar la asistencia." : "The assistance could not be carried out.",
                        color: STheme.color.danger,
                        time: 5000
                    })
                    console.error(e);
                })
            }}
                loading={this.state.loading}
            >
                <SText color={STheme.color.white} language={{
                    es: "INICIAR",
                    en: "START"
                }} />
            </PButtom>


            <SHr h={30} />
            {(this.props?.dataJefe) ? <SText onPress={() => SNavigation.navigate("/boss")}>{"GO TO BOSS"}</SText> : null}

            <SHr h={30} />
        </SView>
    }
}
