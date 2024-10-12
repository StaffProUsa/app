import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SNavigation, SText, STheme, SView } from 'servisofts-component';
import SSocket from 'servisofts-socket';
import Model from '../Model';

export default class MisCompanys extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
    }

    componentDidMount() {
        SSocket.sendPromise({
            component: "company",
            type: "getAll",
            key_usuario: Model.usuario.Action.getKey(),
            ver_mias: true,
        }).then(e => {
            this.setState({ data: e.data })
        }).catch(e => {
            console.error(e);
        })

        // SSocket.addEventListener("onMessage", this.handleSocketMessage.bind(this))
    }
    // componentWillUnmount() {
    //     SSocket.removeEventListener("onMessage", this.handleSocketMessage.bind(this));
    // }
    // handleSocketMessage(obj) {
    //     if (obj.component == "staff_tipo_favorito" && obj.type == "editar") {
    //         this.componentDidMount();
    //     }
    //     if (obj.component == "staff_tipo_favorito" && obj.type == "registro") {
    //         this.componentDidMount();
    //     }
    // }
    renderItem(obj) {
        return <SView row >
            <SView card padding={4}>
                <SText>{obj.descripcion}</SText>
            </SView>
            <SView width={8} />
        </SView>
    }
    render() {
        return <SView row col={"xs-12"} border={"#ff0"} padding={8}>
            {Object.values(this.state.data).map(o => this.renderItem(o))}
        </SView>
    }
}
