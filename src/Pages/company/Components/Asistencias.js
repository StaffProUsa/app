import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SImage, SText, STheme, SUtil, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
const getColorFromPercentage = (percentage) => {
    // Asegurarse de que el valor esté entre 0 y 100
    percentage = Math.max(0, Math.min(percentage, 100));

    let r, g;

    if (percentage < 50) {
        // De 0 a 50, rojo (255, 0, 0) a amarillo (255, 255, 0)
        r = 255;
        g = Math.floor((percentage / 50) * 255);
    } else {
        // De 50 a 100, amarillo (255, 255, 0) a verde (0, 255, 0)
        r = Math.floor(255 - ((percentage - 50) / 50) * 255);
        g = 255;
    }

    // El color siempre tiene el componente azul en 0
    return `rgb(${r}, ${g}, 0)`;
}
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
                    <SView flex height style={{
                        justifyContent: "center"
                    }}>
                        <SText>{obj.tipo_staff}</SText>
                        <SText fontSize={12} color={STheme.color.gray}>{obj.staff}</SText>
                    </SView>
                    <SView width={16} />
                    <SView style={{ justifyContent: "center" }}>
                        <SText style={{ textAlign: "right" }} fontSize={12}>{obj.asistencias} / {obj.actual}</SText>
                        <SText style={{ textAlign: "right" }} color={STheme.color.lightGray} fontSize={12}>{obj.porcentaje + "%"}</SText>
                    </SView>
                </SView>
                <SView col={"xs-12"} style={{
                    height: 4,
                    borderRadius: 100,
                    backgroundColor: STheme.color.card,
                    overflow: 'hidden',
                }} >
                    <SView
                        width={(parseFloat(obj.porcentaje ?? 0))+"%"}
                        style={{
                            // width:(obj.porcentaje ?? 0) + "%",
                            height: "100%",
                            // backgroundColor: obj.color ?? STheme.colorFromText(obj.key_tipo_staff)
                            backgroundColor: getColorFromPercentage(parseFloat(obj.porcentaje ?? 0))
                            // backgroundColor: "#f0f"
                        }} />
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
