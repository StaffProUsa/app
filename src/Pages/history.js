import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import { SImage, SList2, SPage, SText, STheme, SView, SLanguage, SHr, SIcon, SDate } from 'servisofts-component';
import { Container } from '../Components';
import Degradado from '../Components/Degradado';
import PBarraFooter from '../Components/PBarraFooter';

export default class history extends Component {
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

    getPerfil() {
        var usuario = Model.usuario.Action.getUsuarioLog();
        // if (!usuario) {
        //   SNavigation.navigate('login');
        //   return <SView />;
        // }
        return (
            <SView
                center
                onPress={() => {
                    SNavigation.navigate('/perfil/editar');
                }}>
                <SView
                    style={{
                        width: 140,
                        height: 140,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <SView
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: STheme.color.card,
                            borderRadius: 100,
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
                <SHr />
                <SView>
                    <SView center>
                        <SText
                            style={{
                                // flex: 5,
                                fontSize: 18,
                                // fontWeight: "bold",
                                color: STheme.color.text
                            }}>
                            {usuario['Nombres'] + ' ' + usuario['Apellidos']}{' '}
                        </SText>
                    </SView>
                    <SView center>
                        <SText
                            style={{
                                fontSize: 14
                                // color: "#bbb"
                            }}
                            color={STheme.color.gray}>
                            {usuario['Correo'] ?? '--'}{' '}
                        </SText>
                    </SView>
                </SView>
            </SView>
        );
    }
    getList() {
        return <SList2 data={this.state.data} order={[{ key: "staff/fecha_inicio", order: "desc" }]} render={(obj) => {
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
                    <SText fontSize={14} color={STheme.color.gray} language={{
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
                        <SText fontSize={14} color={STheme.color.gray} language={{
                            es: "Coordinador",
                            en: "Coordinator"
                        }} />
                    </SView>
                </SView> : null}
                <SHr height={10} />
                <SView col={"xs-2"} row center>
                    <SIcon name={"eventi"} fill={STheme.color.gray} width={15} />
                </SView>
                <SView col={"xs-10"}  >
                    <SText fontSize={16}>{obj?.evento?.descripcion}</SText>
                </SView>
                <SHr height={5} />
                <SView col={"xs-2"} row center>
                    <SIcon name={"worki"} fill={STheme.color.gray} width={16} />
                </SView>
                <SView col={"xs-10"}  >
                    <SText>{obj?.staff_tipo?.descripcion}</SText>
                </SView>
                <SHr height={5} />
                <SView col={"xs-2"} row center>
                    <SIcon name={"dating"} fill={STheme.color.gray} width={16} />
                </SView>
                <SView col={"xs-10"}  >
                    <SText>{new SDate(obj?.evento?.fecha).toString("yyyy-MM-dd")}</SText>
                </SView>
                <SHr height={10} />
                <SView col={"xs-2"} row center>
                    <SIcon name={"timeIni"} fill={STheme.color.gray} width={16} />
                </SView>
                <SView col={"xs-4"}  >
                    <SText>{new SDate(obj?.staff?.fecha_inicio).toString("hh:mm:ss")}</SText>
                </SView>
                <SView col={"xs-2"} row center>
                    <SIcon name={"timeFinish"} fill={STheme.color.gray} width={16} />
                </SView>
                <SView col={"xs-4"}  >
                    <SText>{new SDate(obj?.staff?.fecha_fin).toString("hh:mm:ss")}</SText>
                </SView>
                <SHr height={5} />
                <SView col={"xs-2"} row center>
                    <SIcon name={"asistencia2"} fill={STheme.color.gray} width={16} />
                </SView>
                <SView col={"xs-10"}  >
                    <SText>{obj?.asistencia_staff_usuario ? obj?.asistencia_staff_usuario.length : 0}</SText>
                </SView>
            </SView>
        }} />
    }

    render() {
        return <SPage titleLanguage={{ es: "Mi historial", en: "My history" }} preventBack footer={<PBarraFooter url={'/history'} />}>
            <Container>
                {this.getPerfil()}
                <SHr height={25} />
                {this.getList()}
                <SHr height={90} />
            </Container>
        </SPage >
    }
}