import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SHr, SIcon, SImage, SList2, SNavigation, SPage, SText, STheme, SView, SLanguage, SDate } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import { Container } from '../Components';
import Degradado from '../Components/Degradado';
import CardEvento from '../Components/Evento/CardEvento';

export default class invitations extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        SSocket.sendPromise({
            component: "staff_usuario",
            type: "getInvitacionesPendientes",
            key_usuario: Model.usuario.Action.getKey()
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {
            console.error(e);
        })
    }
    render() {
        return <SPage  >
            <Container>
                <SHr h={16}/>
                <SView col={"xs-12"} >
                    <SText fontSize={20} bold language={{
                        es: "Invitaciones pendientes",
                        en: "Pending invitations"
                    }} />
                </SView>
                <SHr height={25} />
                <SList2 data={this.state.data} render={(obj, key) => {
                    // const fecha = new SDate(obj.evento.fecha, "yyyy-MM-ddThh:mm:ss").toString("yyyy-MM-dd")
                    // const hora_inicio = new SDate(obj.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("hh:mm")
                    // const hora_fin = new SDate(obj.staff.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("hh:mm")
                    return <CardEvento data={obj} onPress={() => {
                        SNavigation.navigate("/invitationDetail", { key: obj?.staff_usuario?.key });
                    }} />
                    return <SView col={"xs-12"} row padding={15} style={{
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: STheme.color.lightGray,
                        overflow: "hidden",
                    }} onPress={() => {
                        SNavigation.navigate("/invitationDetail", { key: obj?.staff_usuario?.key });
                    }}>
                        <Degradado />
                        <SView col={"xs-4 sm-2"} row center>
                            <SView style={{
                                // position: "absolute",
                                width: 40,
                                height: 40,
                                borderRadius: 100,
                                borderWidth: 1,
                                borderColor: STheme.color.lightGray,
                                overflow: "hidden",
                                // top: 0,
                                // left: 0,
                            }}>
                                <SImage src={SSocket.api.root + "company/" + obj?.company?.key} style={{
                                    resizeMode: "cover",
                                }} />
                            </SView>
                        </SView>
                        <SView col={"xs-8 sm-4"} style={{ marginBottom: 10 }}>
                            <SText fontSize={16} bold>{obj?.company?.descripcion}</SText>
                            <SText fontSize={14} color={STheme.color.gray} language={{
                                es: "Empresa",
                                en: "Company"
                            }} />
                        </SView>
                        <SView col={"xs-4 sm-2"} row center>
                            <SView style={{
                                // position: "absolute",
                                width: 40,
                                height: 40,
                                borderRadius: 100,
                                borderWidth: 1,
                                borderColor: STheme.color.lightGray,
                                overflow: "hidden",
                                // top: 0,
                                // left: 0,
                            }} center>
                                <SImage enablePreview src={SSocket.api.root + 'staff_tipo/' + obj?.staff_tipo?.key} width={40} height={40} style={{ resizeMode: 'cover', borderRadius: 10, zIndex: 9 }} />
                                <SImage src={require('../Assets/images/noImage.jpg')} width={40} height={40} style={{ resizeMode: 'cover', borderRadius: 10, position: "absolute", }} />
                            </SView>
                        </SView>
                        <SView col={"xs-8 sm-4"}  >
                            <SText fontSize={14} language={{
                                es: "Requiere: ",
                                en: "Requires: "
                            }} />
                            <SText fontSize={16} bold >{obj?.staff_tipo?.descripcion}</SText>
                        </SView>
                        <SHr height={10} />
                        <SView col={"xs-4 sm-2"} row center>
                            <SText fontSize={16} language={{
                                es: "Evento: ",
                                en: "Event: "
                            }} />
                        </SView>
                        <SView col={"xs-8 sm-4"}  >
                            <SText fontSize={16} bold>{obj?.evento?.descripcion}</SText>
                        </SView>
                        <SView col={"xs-4 sm-2"} row center>
                            <SText fontSize={16} language={{
                                es: "Fecha: ",
                                en: "Date: "
                            }} />
                        </SView>
                        <SView col={"xs-8 sm-4"}  >
                            <SText fontSize={16} bold >{new SDate(obj?.evento?.fecha, "yyyy-MM-ddThh:mm:ss").toString("MONTH dd, yyyy")}</SText>
                        </SView>
                        <SHr height={10} />
                        <SView col={"xs-4 sm-2"} row center>
                            <SText fontSize={16} language={{
                                es: "Inicio: ",
                                en: "Clock-in: "
                            }} />
                        </SView>
                        <SView col={"xs-8 sm-4"}  >
                            <SText fontSize={16} bold>{hora_inicio}</SText>
                        </SView>
                        <SView col={"xs-4 sm-2"} row center>
                            <SText fontSize={16} language={{
                                es: "Salida: ",
                                en: "Clock-out: "
                            }} />
                        </SView>
                        <SView col={"xs-8 sm-4"}  >
                            <SText fontSize={16} bold >{hora_fin}</SText>
                        </SView>

                        {/* <SView col={"xs-10"}  >
                            <SText>{fecha}</SText>
                            <SText>{hora_inicio}</SText>
                            <SText>{hora_fin}</SText>
                        </SView> */}

                        {/* <SButtom onPress={() => {
                            SSocket.sendPromise({
                                component: "staff_usuario",
                                type: "aceptarInvitacion",
                                key_usuario: Model.usuario.Action.getKey(),
                                key_staff_usuario: obj.staff_usuario.key
                            }).then(e => {
                                console.log(e);
                            }).catch(e => {
                                console.error(e);
                            })
                        }}>ACEPTAR</SButtom> */}
                    </SView>
                }} />
            </Container>
        </SPage>
    }
}
