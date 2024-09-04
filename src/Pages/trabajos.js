import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import { SImage, SList2, SPage, SText, STheme, SView, SLanguage, SHr, SIcon, SDate } from 'servisofts-component';
import { Container } from '../Components';
import Degradado from '../Components/Degradado';

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
        return <SPage>
            <Container>
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
                        <SView col={"xs-2"} row center>
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
                        <SView col={"xs-10"} >
                            <SText fontSize={16}>{obj?.company?.descripcion}</SText>
                            <SText fontSize={14} color={STheme.color.gray} language={{
                                es: "Empresa",
                                en: "Company"
                            }} />
                        </SView>
                        {/* <SText>{obj?.company?.descripcion}</SText> */}
                        <SHr height={10} />
                        <SView col={"xs-2"} row center>
                            <SIcon name={"eventi"} width={15} />
                        </SView>
                        <SView col={"xs-10"}  >
                            <SText fontSize={16}>{obj?.evento?.descripcion}</SText>
                        </SView>
                        <SHr height={5} />
                        <SView col={"xs-2"} row center>
                            <SIcon name={"worki"} width={16} />
                        </SView>
                        <SView col={"xs-10"}  >
                            <SText>{obj?.staff_tipo?.descripcion}</SText>
                        </SView>
                        <SHr height={5} />
                        <SView col={"xs-2"} row center>
                            <SIcon name={"dating"} width={16} />
                        </SView>
                        <SView col={"xs-10"}  >
                            <SText>{new SDate(obj?.evento?.fecha).toString("yyyy-MM-dd")}</SText>
                        </SView>
                        {/* <SText>{obj?.evento?.descripcion}</SText><SHr /> */}
                        {/* <SText>{obj?.staff_tipo?.descripcion}</SText><SHr /> */}
                        <SHr height={10} />
                        {/* <SView col={"xs-6"} row center> */}
                        <SView col={"xs-2"} row center>
                            <SIcon name={"timeIni"} width={16} />
                        </SView>
                        <SView col={"xs-4"}  >
                            <SText>{new SDate(obj?.staff?.fecha_inicio).toString("hh:mm:ss")}</SText>
                        </SView>
                        {/* </SView> */}
                        {/* <SView col={"xs-6"} row center> */}
                        <SView col={"xs-2"} row center>
                            <SIcon name={"timeFinish"} width={16} />
                        </SView>
                        <SView col={"xs-4"}  >
                            <SText>{new SDate(obj?.staff?.fecha_fin).toString("hh:mm:ss")}</SText>
                        </SView>
                        <SHr height={10} />
                        {/* </SView> */}
                        {/* <SText>{obj?.staff?.fecha_inicio}</SText><SHr /> */}
                        {/* <SText>{obj?.staff?.fecha_fin}</SText><SHr /> */}
                        {(obj?.staff_usuario?.key_usuario_atiende) ? <SView col={"xs-12"} row center>
                            <SView col={"xs-2"} row center>
                                {/* <SIcon name={"staff"} width={16} /> */}
                                <SView width={40} height={40} style={{borderRadius:5, overflow:"hidden"}} >
                                    <SImage src={SSocket.api.root + "usuario/" + obj?.staff_usuario?.key_usuario_atiende} width={40} height={40} style={{ resizeMode: 'cover', overflow:"hidden" }} />
                                </SView>
                            </SView>
                            <SView col={"xs-10"}  >
                                {/* <SText>{obj?.staff_usuario?.key_usuario_atiende}</SText> */}
                                <SText>{userCoordinador?.Nombres} {userCoordinador?.Apellidos}</SText>
                            </SView>
                        </SView> : null}
                        {/* <SText>{obj?.staff_usuario?.key_usuario_atiende}</SText><SHr /> */}
                        <SText>{obj?.asistencia_staff_usuario ? obj?.asistencia_staff_usuario.length : 0}</SText>
                    </SView>
                }} />
                <SHr height={25} />
            </Container>
        </SPage >
    }
}
