import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SHr, SInput, SNavigation, SPage, SText, STheme, SView, SNotification, SLanguage } from 'servisofts-component';
import { Container } from '../../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../../Model';



const Item = ({ data, onChange }) => {
    return <SView padding={10} row center>
        <SView width={20} height={20} >
            <SInput type='checkBox' defaultValue={!!data.staff_tipo_company} onChangeText={onChange} width={20} height={20} style={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: STheme.color.gray,
                overflow: 'hidden',
            }} />
        </SView>
        <SView width={4} />
        <SText>{data.descripcion}</SText>
    </SView>
}

export default class staff_tipo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key_company: SNavigation.getParam("pk")
        };
    }
    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
        SSocket.sendPromise({
            component: "staff_tipo",
            type: "getAll",
        }).then(e => {
            SSocket.sendPromise({
                component: "staff_tipo_company",
                type: "getAll",
                key_company: this.state.key_company
            }).then(b => {
                Object.values(b.data).map(a => {
                    const st = Object.values(e.data).find(x => x.key == a.key_staff_tipo);
                    if (st) {
                        st.staff_tipo_company = a;
                    }
                })
                this.setState({ data: e.data })
            }).catch(e => {

            })

        }).catch(e => {

        })
    }
    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }

    render() {
        let lenguaje = SLanguage.language;
        return <SPage title={"Staff Tipo"} disableScroll>
            <Container flex>
                <SHr height={40} />
                <FlatList data={Object.values(this.state.data ?? {})}
                    contentContainerStyle={{
                        flexDirection: "row",
                        width: "100%",
                        flexWrap: "wrap"
                    }}
                    renderItem={({ item }) => <Item data={item} onChange={(bol => {
                        if (bol) {
                            SSocket.sendPromise({
                                component: "staff_tipo_company",
                                type: "registro",
                                data: {
                                    key_company: this.state.key_company,
                                    key_staff_tipo: item.key,
                                },
                                key_usuario: Model.usuario.Action.getKey()
                            }).then(e => {
                                item.staff_tipo_company = e.data;
                                SNotification.send({
                                    title: (lenguaje == "es") ? "Éxito" : "Success",
                                    body: (lenguaje == "es") ? "Se guardaron los cambios" : "Changes saved",
                                    time: 5000,
                                    color: STheme.color.success
                                })
                            }).catch(e => {
                                SNotification.send({
                                    title: (lenguaje == "es") ? "Error" : "Error",
                                    body: e.error ?? (lenguaje == "es") ? "Error desconocido" : "Unknown error",
                                    time: 5000,
                                    color: STheme.color.danger
                                })

                            })
                        } else {
                            SSocket.sendPromise({
                                component: "staff_tipo_company",
                                type: "editar",
                                data: {
                                    key: item.staff_tipo_company.key,
                                    estado: 0,
                                },
                                key_usuario: Model.usuario.Action.getKey()
                            }).then(e => {
                                // item.staff_tipo_company = null;
                                SNotification.send({
                                    title: (lenguaje == "es") ? "Éxito" : "Success",
                                    body: (lenguaje == "es") ? "Se guardaron los cambios" : "Changes saved",
                                    time: 5000,
                                    color: STheme.color.success
                                })
                            }).catch(e => {
                                SNotification.send({
                                    title: (lenguaje == "es") ? "Error" : "Error",
                                    body: e.error ?? (lenguaje == "es") ? "Error desconocido" : "Unknown error",
                                    time: 5000,
                                    color: STheme.color.danger
                                })
                            })
                        }

                    })} />} />
            </Container>
        </SPage>
    }
}
