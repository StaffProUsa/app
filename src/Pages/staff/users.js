import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SImage, SList, SNavigation, SPage, SText, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import { Container } from '../../Components';

export default class users extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.pk = SNavigation.getParam("pk");
    }

    componentDidMount() {
        SSocket.sendPromise({
            component: "staff",
            type: "getByKeyDetalle",
            key: this.pk,
            key_usuario: Model.usuario.Action.getKey(),
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {
            console.error(e);
        })

    }
    item(obj) {
        return <SView col={"xs-12"} card padding={8}>
            <SView row>
                <SView width={30} height={30}>
                    <SImage  src={SSocket.api.root + "usuario/" + obj.key_usuario} />
                </SView>
                <SText flex>{obj.key_usuario}</SText>
            </SView>
        </SView>
    }
    render() {
        return <SPage titleLanguage={{ en: "", es: "" }}>
            <Container>
                <SText>{this.state?.data?.evento?.descripcion}</SText>
                <SText>{this.state?.data?.evento?.observacion}</SText>
                <SText>{this.state?.data?.staff_tipo?.descripcion}</SText>
                <SText>{this.state?.data?.descripcion}</SText>
                <SHr />
                <SList data={this.state?.data?.staff_usuario ?? []}
                    render={this.item.bind(this)}
                />
            </Container>
        </SPage>
    }
}
