import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SHr, SIcon, SImage, SNavigation, SText, STheme, SUtil, SView, SLanguage, SDate } from 'servisofts-component';
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

export default class Reclutas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
    }

    componentDidMount() {
        // if (!this.props.key_evento) return;
        // SSocket.sendPromise({
        //     component: "evento",
        //     type: "getEstadoReclutas",
        //     key_evento: this.props.key_evento
        // }).then(e => {
        //     this.setState({ data: e.data })
        // }).catch(e => {

        // })
    }
    renderObj(obj) {

        return <SView col={"xs-12"} row style={{ paddingTop: 8 }} onPress={() => {
            console.log(obj);
            // SNavigation.navigate("/staff/add", { key_evento: obj.key_evento, pk: obj.key, })
            SNavigation.navigate("/staff/users", { key_evento: obj.key_evento, pk: obj.key, })
            // SNavigation.navigate("/staff/profile", { pk: obj.key })
        }}>
            <SView width={50} height={50} card>
                <SImage src={SSocket.api.root + "staff_tipo/" + obj.key_tipo_staff} />
            </SView>
            <SView width={8} />
            <SView flex>
                <SView row flex col={"xs-12"}>
                    <SView flex height style={{
                        justifyContent: "center",
                    }}>
                        <SView row>
                            <SText bold fontSize={15}>{obj.tipo_staff} </SText>
                            <SView width={16} />
                            <SText fontSize={13} language={{
                                en: "Start " + new SDate(obj.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH"),
                                es: "Inicio " + new SDate(obj.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")
                            }} />

                            {(obj.fecha_fin != null) ? <SText fontSize={13} language={{
                                en: " | End " + new SDate(obj.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH"),
                                es: " | Fin " + new SDate(obj.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")
                            }} /> : null}


                        </SView>
                        <SText fontSize={14} color={STheme.color.gray}>{obj.staff}</SText>
                        <SHr />
                    </SView>
                    <SView width={16} />
                    <SView style={{ justifyContent: "center" }}>
                        <SText style={{ textAlign: "right" }} fontSize={12}>{obj.actual} / {obj.cantidad ?? 0}</SText>
                        <SText style={{ textAlign: "right" }} color={STheme.color.gray} fontSize={12}>{(obj.porcentaje ?? 0) + "%"}</SText>
                    </SView>
                </SView>
                <SView col={"xs-12"} style={{
                    height: 4,
                    borderRadius: 100,
                    backgroundColor: STheme.color.card,
                    overflow: 'hidden',
                }} >
                    <SView
                        width={(obj.porcentaje ?? 0) + "%"}
                        style={{
                            height: "100%",
                            // backgroundColor: obj.color ?? STheme.colorFromText(obj.key_tipo_staff)
                            backgroundColor: getColorFromPercentage(obj.porcentaje ?? 0)
                        }} />
                </SView>
            </SView>
            {(this.props.past) ? null : <SView center padding={5} onPress={() => {
                SNavigation.navigate("/staff/add", { key_evento: obj.key_evento, pk: obj.key, })
            }}>
                <SIcon name={"Edit"} width={30} height={30} />
            </SView>
            }

        </SView>
    }

    render() {
        if (!this.props.data) return null;
        const arr = Object.values(this.props.data) ?? [];
        return <SView col={"xs-12"}>
            {arr.length <= 0 ? <SView center col={"xs-12"} height={200}>
                <SText color={STheme.color.gray} language={{
                    es: "NO TIENES RECLUTAS",
                    en: "YOUR BOOKING LIST IS EMPTY"
                }} />
                <SText color={STheme.color.gray} fontSize={12} language={{
                    es: "Presiona en el botón + para agregar puestos.",
                    en: "Press the + button to add positions."
                }} />
            </SView> :
                arr.map((obj) => {
                    return this.renderObj(obj);
                })}
        </SView>
    }
}
