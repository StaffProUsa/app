import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SImage, SText, STheme, SView } from 'servisofts-component';
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
        return <SView col={"xs-12"} row>
            <SView width={50} height={50}>
                <SImage src={SSocket.api.root + "staff_tipo/" + obj.key} />
            </SView>
            <SView flex>
                <SView row flex col={"xs-12"}>
                    <SText>{obj.tipo_staff}</SText>
                    <SView flex />
                    <SText>{obj.porcentaje + "%"}</SText>
                </SView>
                <SView row col={"xs-12"} border={"#001100"}>
                    <SView style={{
                        width: "100%",
                        height: 20,
                        borderRadius: 100,
                        backgroundColor: STheme.color.card
                    }} row>
                        <SView style={{
                            width: obj.porcentaje + "%",
                            // ya sladnaskdnk
                            height: 20,
                            backgroundColor: "#f0f"
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
                en: "Recruitment",
                es: "Reclutas"
            }} />
            {Object.values(this.state.data).map((obj) => {
                return this.renderObj(obj );
            })}
            {/* {this.renderObj({ descripcion: "Event Coordinator" })} */}
            {/* {this.renderObj({ descripcion: "Event Otro" })} */}
        </SView>
    }
}
