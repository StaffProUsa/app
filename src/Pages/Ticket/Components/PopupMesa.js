import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { SButtom, SHr, SImage, SList, SList2, SNavigation, SPopup, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';
import { Container } from '../../../Components';

export default class PopupMesa extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        SSocket.sendPromise({
            component: "mesa_compra",
            type: "getByKeyMesa",
            key_mesa: this.props.key_mesa,
        }).then(e => {

            let keys = [...new Set(Object.values(e.data).map(a => a.key_usuario).filter(key => key !== null))];
            SSocket.sendPromise({
                version: "2.0",
                service: "usuario",
                component: "usuario",
                type: "getAllKeys",
                keys: keys,
            }).then(e2 => {
                Object.values(e.data).map(a => {
                    a.usuario = e2?.data[a.key_usuario]?.usuario ?? {}
                })
                this.setState({ data: e.data })
            }).catch(e2 => {
                SPopup.alert(e2.error)
            })

            this.setState({ data: e.data })
            console.log(e);
        }).catch(e => {
            console.error(e);
        })
    }
    render() {
        return <SView col={"xs-12"} style={{
            backgroundColor: STheme.color.background,
            height: Dimensions.get("window").height * 0.8,
            maxHeight: "100%",
        }} withoutFeedback>
            <Container>
                <SHr />
                <SText color={STheme.color.warning}>SOLO TIENES ACCESO A ESTA VENTANA SI ERES ADMINISTRADOR</SText>
                <SHr />
                <SList buscador data={this.state.data} render={(a) => {
                    return <SView col={"xs-12"} card row center>
                        <SView width={50} height={50}>
                            <SImage src={Model.usuario._get_image_download_path(SSocket.api, a.key_usuario)} />
                        </SView>
                        <SView flex onPress={() => {
                            SNavigation.navigate("/usuario/profile", { pk: a.key_usuario })
                            SPopup.close("mesa_compra")
                        }}>
                            <SText>{a?.usuario?.Nombres} {a?.usuario?.Apellidos}</SText>
                            <SText fontSize={14} color={STheme.color.lightGray}>{a?.usuario?.Telefono}</SText>
                        </SView>
                        <SView >
                            <SButtom type='danger' onPress={() => {
                                if (this.props.reasignar) this.props.reasignar(a)

                            }}>REASIGNAR</SButtom>
                        </SView>
                    </SView>
                }} />
            </Container>
        </SView>
    }
}
