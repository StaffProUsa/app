import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SButtom, SHr, SIcon, SImage, SList2, SNavigation, SPage, SText, STheme, SView , SLanguage} from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import { Container } from '../Components';
import Degradado from '../Components/Degradado';

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
        return <SPage titleLanguage={{ es: "Invitaciones", en: "Invitations" }} >
            <Container>
                <SView col={"xs-12"} >
                    <SText fontSize={20} bold language={{
                        es: "Invitaciones pendientes",
                        en: "Pending invitations"
                    }}/>
                </SView>
                <SHr height={25} />
                <SList2 data={this.state.data} render={(obj, key) => {
                    return <SView col={"xs-12"} row padding={15} style={{
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: STheme.color.darkGray,
                        overflow: "hidden",
                    }} onPress={() => {
                        SNavigation.navigate("/invitationDetail", { key: obj?.staff_usuario?.key });
                    }}>
                        <Degradado />
                        <SView col={"xs-2"} row center>
                            <SView style={{
                                // position: "absolute",
                                width: 40,
                                height: 40,
                                borderRadius: 100,
                                borderWidth: 1,
                                borderColor: STheme.color.darkGray,
                                overflow: "hidden",
                                // top: 0,
                                // left: 0,
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
                        <SHr height={10} />
                        <SView col={"xs-2"} row center>
                            <SIcon name={"eventi"} width={15} fill={STheme.color.text} />
                        </SView>
                        <SView col={"xs-10"}  >
                            <SText fontSize={16}>{obj?.evento?.descripcion}</SText>
                        </SView>
                        <SHr height={5} />
                        <SView col={"xs-2"} row center>
                            <SIcon name={"worki"} width={16} fill={STheme.color.text} />
                        </SView>
                        <SView col={"xs-10"}  >
                            <SText>{obj?.staff_tipo?.descripcion}</SText>
                        </SView>

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
