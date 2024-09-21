import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SImage, SInput, SList, SNotification, SPage, SPopup, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../Model';
import { Container } from '../Components';

export default class clock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
    }

    componentDidMount() {
        SSocket.sendPromise({
            component: "asistencia",
            type: "getSinSalida",
            key_usuario: Model.usuario.Action.getKey()
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {
            console.log(e);
        })
    }
    handleClockOut(obj) {
        SPopup.open({
            key: "handleClock",
            content: <SView width={200} height={200} backgroundColor={STheme.color.background} withoutFeedback center>
                <SInput ref={ref => this.motivo = ref} type={"textArea"} placeholder={"Escribe el detalle"} />
                <SText onPress={() => {
                    SSocket.sendPromise({
                        component: "asistencia",
                        type: "salida",
                        key_usuario: Model.usuario.Action.getKey(),
                        key: obj.key,
                        descripcion: this.motivo.getValue()
                    }).then(e => {
                        SPopup.close("handleClock");
                        this.componentDidMount();
                        console.log(e);
                    }).catch(e => {
                        SNotification.send({
                            title: "Error",
                            body: "Algo paso vuelve a intentarlo.",
                            color: STheme.color.danger,
                            time: 5000,
                        })
                        console.log(e);
                    })
                }}>{"Subir"}</SText>
            </SView>
        })

    }

    renderItem(obj) {

        return <SView col={"xs-12"} card row center>
            <SView width={40} height={40}>
                <SImage src={SSocket.api.root + "usuario/" + obj.key_usuario} />
            </SView>
            <SText>{obj.key_usuario}</SText>
            <SView padding={4} card onPress={this.handleClockOut.bind(this, obj)}>
                <SText >{"CLOCKOUT"}</SText>
            </SView>
        </SView>
    }
    render() {
        return <SPage title={"Clock"}>
            <Container>
                <SList data={this.state.data} render={this.renderItem.bind(this)} />
            </Container>
        </SPage>
    }
}
