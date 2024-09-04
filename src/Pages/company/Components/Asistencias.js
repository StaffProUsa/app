import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SImage, SText, STheme, SUtil, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';

export default class Asistencias extends Component {
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
            type: "getEstadoAsistencias",
            key_evento: this.props.key_evento
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {

        })
    }
    renderObj(obj) {
        return <SView col={"xs-12"} row style={{ paddingTop: 8 }}>
            <SView width={50} height={50} card>
                <SImage src={SSocket.api.root + "staff_tipo/" + obj.key_tipo_staff} />
            </SView>
            <SView width={8} />
            <SView flex>
                <SView row flex col={"xs-12"}>
                    <SView height style={{
                        justifyContent:"center"
                    }}>
                        <SText>{obj.tipo_staff}</SText>
                    </SView>
                    <SView width={16} />
                    <SView flex />
                    <SView style={{ justifyContent: "center" }}>
                        <SText style={{ textAlign: "right" }} fontSize={12}>{obj.asistencias} / {obj.actual}</SText>
                        <SText style={{ textAlign: "right" }} color={STheme.color.lightGray} fontSize={12}>{obj.porcentaje + "%"}</SText>
                    </SView>
                </SView>
                <SView row col={"xs-12"} >
                    <SView style={{
                        width: "100%",
                        height: 14,
                        borderRadius: 100,
                        backgroundColor: STheme.color.card,
                        overflow: 'hidden',
                    }} row>
                        <SView style={{
                            width: obj.porcentaje + "%",
                            height: "100%",
                            backgroundColor: obj.color ?? STheme.colorFromText(obj.key_tipo_staff)
                        }} />
                    </SView>
                </SView>
            </SView>
        </SView>
    }
    render() {
        if (!this.props.key_evento) return null;
        return <SView col={"xs-12"}>
            <SText fontSize={18} language={{
                en: "Attendance",
                es: "Asistencias"
            }} />
            <SHr h={16} />
            {Object.values(this.state.data).map((obj) => {
                return this.renderObj(obj);
            })}
        </SView>
    }
}
