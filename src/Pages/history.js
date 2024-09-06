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
            type: "getMisTrabajos",
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
                <SView col={"xs-2"} row center>
                    <SView style={{
                        width: 40,
                        height: 40,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: STheme.color.darkGray,
                        overflow: "hidden",
                    }}>
                        <SImage src={SSocket.api.root + "staff_tipo/" + obj?.staff_tipo?.key} style={{
                            resizeMode: "cover",
                        }} />
                    </SView>
                </SView>
                <SView col={"xs-10"} >
                    <SText fontSize={14}>{obj?.descripcion}</SText>
                    <SText fontSize={12} color={STheme.color.gray}>{obj?.staff_tipo?.descripcion}</SText>
                </SView>
                <SHr height={15} />
                <SView col={"xs-2"} row center>
                    <SIcon name={"dating"} fill={STheme.color.gray} width={12} />
                </SView>
                <SView col={"xs-10"}  >
                    <SText fontSize={12}>{new SDate(obj?.fecha).toString("yyyy-MM-dd")}</SText>
                </SView>
            </SView>
        }} />
    }

    getResumen() {
        return <>
            <SView col={"xs-12"} row>
                <SView col={"xs-6"}  row style={{paddingRight:5}}>
                    <SView col={"xs-12"} row style={{
                        borderWidth: 1,
                        borderColor: STheme.color.darkGray,
                        borderRadius: 16,
                        overflow: "hidden",
                    }}>
                        <Degradado />
                        <SView col={"xs-12"} padding={10}>
                            <SText fontSize={18} color={STheme.color.text}>
                                Total events
                            </SText>
                        </SView>

                        <SView col={"xs-8"} center padding={10}>
                            <SText fontSize={30} center>
                                15
                            </SText>
                        </SView>
                        <SView col={"xs-4"} center style={{
                            backgroundColor: "#C09C0C",
                            borderBottomLeftRadius: 50,
                            borderTopLeftRadius: 50,
                        }}>
                            <SIcon name={"hisEvent"} fill={STheme.color.white} width={30} />
                        </SView>
                    </SView>
                </SView>
                <SView col={"xs-6"}  row style={{paddingLeft:5}}>
                    <SView col={"xs-12"} row style={{
                        borderWidth: 1,
                        borderColor: STheme.color.darkGray,
                        borderRadius: 16,
                        overflow: "hidden",
                    }}>
                        <Degradado />
                        <SView col={"xs-12"} padding={10}>
                            <SText fontSize={18} color={STheme.color.text}>
                                Completed
                            </SText>
                        </SView>

                        <SView col={"xs-8"} center padding={10}>
                            <SText fontSize={30} center>
                                12
                            </SText>
                        </SView>
                        <SView col={"xs-4"} center style={{
                            backgroundColor: "#33BE5B",
                            borderBottomLeftRadius: 50,
                            borderTopLeftRadius: 50,
                        }}>
                            <SIcon name={"hisCompleted"} fill={STheme.color.white} width={30} />
                        </SView>
                    </SView>
                </SView>
            </SView>
        </>
    }

    render() {
        return <SPage titleLanguage={{ es: "Mi historial", en: "My history" }} preventBack footer={<PBarraFooter url={'/history'} />}>
            <Container>
                {this.getPerfil()}
                <SHr height={25} />
                {this.getResumen()}
                <SHr height={25} />
                {this.getList()}
                <SHr height={90} />
            </Container>
        </SPage >
    }
}
