import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import { SImage, SList2, SPage, SText, STheme, SView, SLanguage, SHr, SIcon, SDate, SNavigation } from 'servisofts-component';
import { Container } from '../Components';
import Degradado from '../Components/Degradado';
import PBarraFooter from '../Components/PBarraFooter';

export default class trabajos extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
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
    render() {
        return <SPage titleLanguage={{ es: "Trabajos", en: "Jobs" }}  footer={<PBarraFooter url={'/trabajos'} />}>
            <Container>
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
                        }} row center onPress={()=>{
                            SNavigation.navigate("/history")
                        }}>
                            <SIcon name={"history"} fill={STheme.color.white} width={20} />
                            <SView width={10} />
                            <SText fontSize={12} color={STheme.color.text} language={{
                                es: "VER HISTORIAL",
                                en: "SEE HISTORY"
                            }} />
                        </SView>
                    </SView>
                </SView>
                <SHr height={10} />
                <SList2 data={this.state.data} order={[{ key: "staff/fecha_inicio", order: "desc" }]} render={(obj) => {
                    let userCoordinador = Model.usuario.Action.getByKey(obj?.staff_usuario?.key_usuario_atiende)
                    console.log("userCoordinador", userCoordinador)
                    return <SView col={"xs-12"} row padding={15} style={{
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
                        <SView col={"xs-12 sm-0.5"} height={10} />
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
                        <SView col={"xs-2"} row center>
                            <SIcon name={"eventi"} fill={STheme.color.gray} width={12} />
                        </SView>
                        <SView col={"xs-10"}  >
                            <SText fontSize={12}>{obj?.evento?.descripcion}</SText>
                        </SView>
                        {/* <SHr height={5} /> */}
                        <SView col={"xs-2"} row center>
                            <SIcon name={"worki"} fill={STheme.color.gray} width={12} />
                        </SView>
                        <SView col={"xs-10"}  >
                            <SText fontSize={12}>{obj?.staff_tipo?.descripcion}</SText>
                        </SView>
                        {/* <SHr height={5} /> */}
                        <SView col={"xs-2"} row center>
                            <SIcon name={"dating"} fill={STheme.color.gray} width={12} />
                        </SView>
                        <SView col={"xs-10"}  >
                            <SText fontSize={12}>{new SDate(obj?.evento?.fecha).toString("MM-dd-yyyy")}</SText>
                        </SView>
                        {/* <SHr height={5} /> */}
                        <SView col={"xs-2"} row center>
                            <SIcon name={"timeIni"} fill={STheme.color.gray} height={12} />
                        </SView>
                        <SView col={"xs-4"}  >
                            <SText fontSize={12}>{new SDate(obj?.staff?.fecha_inicio).toString("hh:mm:ss")}</SText>
                        </SView>
                        <SView col={"xs-2"} row center>
                            <SIcon name={"timeFinish"} fill={STheme.color.gray} width={12} />
                        </SView>
                        <SView col={"xs-4"}  >
                            <SText fontSize={12}>{new SDate(obj?.staff?.fecha_fin).toString("hh:mm:ss")}</SText>
                        </SView>
                        {/* <SHr height={5} /> */}
                        <SView col={"xs-2"} row center>
                            <SIcon name={"asistencia2"} fill={STheme.color.gray} height={12} />
                        </SView>
                        <SView col={"xs-10"}  >
                            <SText fontSize={12}>{obj?.asistencia_staff_usuario ? obj?.asistencia_staff_usuario.length : 0}</SText>
                        </SView>
                    </SView>
                }} />
                <SHr height={90} />
            </Container>
        </SPage >
    }
}
