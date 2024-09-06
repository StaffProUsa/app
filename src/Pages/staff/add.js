import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SInput, SNavigation, SPage, SText, SView } from 'servisofts-component';
import { Container } from '../../Components';
import SSocket from 'servisofts-socket';

export default class add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key_evento: SNavigation.getParam("key_evento"),
        };
    }
    componentDidMount() {
        SSocket.sendPromise({
            component: "evento",
            type: "getByKey",
            key: this.state.key_evento,
        }).then(e => {
            this.setState({ data: e.data })
            console.log(e);
        }).catch(e => {
            console.error(e);
        })
    }
    _ref = {}
    render() {
        return <SPage titleLanguage={{ en: "Staff", es: "Staff" }}>
            <Container>
                <SView row col={"xs-12"} style={{
                    justifyContent: "space-between"
                }}>
                    <SInput
                        ref={r => this._ref["tipo"] = r}
                        label={"Tipo de staff"}
                        col={"xs-7"}
                        editable={false}
                        placeholder={"Seleccione su tipo de staff"}
                        onPress={() => {
                            if (!this.state?.data?.key_company) return;
                            SNavigation.navigate("/staff_tipo", {
                                key_company: this.state?.data?.key_company, onSelect: (e) => {
                                    this._ref["tipo"].setValue(e.descripcion)
                                }
                            })
                        }} />
                    <SInput label={"Descripcion"} placeholder={"Descripcion del staff"} type='textArea' />
                    <SInput col={"xs-7"} label={"Cantidad"} placeholder={"1"} />
                    <SInput col={"xs-5.5"} label={"Fecha Inicio"} placeholder={"yyyy-MM-dd"} />
                    <SInput col={"xs-5.5"} label={" "} type='hour' />
                    <SInput col={"xs-5.5"} label={"Fecha Fin"} placeholder={"yyyy-MM-dd"} />
                    <SInput col={"xs-5.5"} label={" "} type='hour' />
                </SView>
            </Container>

        </SPage>
    }
}
