import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SImage, SText, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';

export default class Reclutas extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        // SSocket.sendPromise({
        //     component: "evento",
        //     type: "getAll",
        //     key_company: this.key_company
        // }).then(e => {
        //     this.setState({ data: e.data })
        // }).catch(e => {

        // })
    }
    renderObj(obj) {
        return <SView col={"xs-12"} row height={40} backgroundColor='#f0f'>
            <SView width={40} height={40}>
                <SImage src={SSocket.api.root + "staff_tipo/" + obj.key} />
            </SView>
            <SView flex>
                <SView row flex>
                    <SText>{obj.descripcion}</SText>
                    <SView flex/>
                    <SText>{"45%"}</SText>
                </SView>
                <SView row flex>
                    <SText>{"BARRA"}</SText>
                </SView>
            </SView>
        </SView>
    }
    render() {
        return <SView col={"xs-12"}>
            <SText fontSize={18} language={{
                en: "Recruitment",
                es: "Reclutas"
            }} />
            {this.renderObj({ descripcion: "Event Coordinator" })}
            {this.renderObj({ descripcion: "Event Otro" })}
        </SView>
    }
}
