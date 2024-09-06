import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SImage, SNavigation, SText, STheme, SUtil, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';

export default class Reclutas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
    }

    componentDidMount() {
        if (!this.props.key_evento) return;
        SSocket.sendPromise({
            component: "evento",
            type: "getEstadoReclutas",
            key_evento: this.props.key_evento
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {

        })
    }
    renderObj(obj) {
        return <SView col={"xs-12"} row style={{ paddingTop: 8 }} onPress={() => {
            console.log(obj);
            SNavigation.navigate("/staff/profile", { pk: obj.key })
        }}>
            <SView width={50} height={50} card>
                <SImage src={SSocket.api.root + "staff_tipo/" + obj.key_tipo_staff} />
            </SView>
            <SView width={8} />
            <SView flex>
                <SView row flex col={"xs-12"}>
                    <SView height style={{
                        justifyContent: "center"
                    }}>
                        <SText>{obj.tipo_staff}</SText>
                    </SView>
                    <SView width={16} />
                    <SView flex />
                    <SView style={{ justifyContent: "center" }}>
                        <SText style={{ textAlign: "right" }} fontSize={12}>{obj.actual} / {obj.cantidad ?? 0}</SText>
                        <SText style={{ textAlign: "right" }} color={STheme.color.lightGray} fontSize={12}>{(obj.porcentaje ?? 0) + "%"}</SText>
                    </SView>
                </SView>
                <SView col={"xs-12"} style={{
                    height: 14,
                    borderRadius: 100,
                    backgroundColor: STheme.color.card,
                    overflow: 'hidden',
                }} >
                    <SView
                        width={(obj.porcentaje??0)+"%"}
                        style={{
                            height: "100%",
                            backgroundColor: obj.color ?? STheme.colorFromText(obj.key_tipo_staff)
                        }} />
                </SView>
            </SView>
        </SView>
    }

    render() {
        if (!this.props.key_evento) return null;
        return <SView col={"xs-12"}>
            <SText fontSize={18} language={{
                en: "Recruitment",
                es: "Reclutas"
            }} />
            <SHr h={16} />
            {Object.values(this.state.data).map((obj) => {
                return this.renderObj(obj);
            })}
        </SView>
    }
}
