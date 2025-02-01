import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SInput, SNavigation, SPage, SText, STheme, SView, SNotification, SLanguage, SHr, SIcon, SBuscador } from 'servisofts-component';
import { Container } from '../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../Model';



const Item = ({ data, onChange }) => {
    return <SView padding={10} row center>
        <SView width={20} height={20} >
            <SInput type='checkBox' defaultValue={!!data.staff_tipo_favorito} onChangeText={onChange} width={20} height={20} style={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: STheme.color.gray,
                overflow: 'hidden',
            }} />
        </SView>
        <SView width={4} />
        <SText fontSize={16}>{data.descripcion}</SText>
    </SView>
}

export default class staff_tipo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key_usuario: SNavigation.getParam("key_usuario", Model.usuario.Action.getKey())
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
                component: "staff_tipo_favorito",
                type: "getAll",
                key_usuario: this.state.key_usuario
            }).then(b => {
                Object.values(b.data).map(a => {
                    const st = Object.values(e.data).find(x => x.key == a.key_staff_tipo);
                    if (st) {
                        st.staff_tipo_favorito = a;
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
        const datafilter = SBuscador.filter({ data: this.state.data ?? {}, txt: this.state.filter })
        return <SPage title={"Staff Tipo"} disableScroll>
            <SHr height={40} />
            <Container flex>
                <SText col={"sm-12"} justify fontSize={18} bold>{(lenguaje == "es") ? "Selecciona tus habilidades o tipos de staff favoritos:" : "Select your favorite skills or staff types:"}</SText>
                <SHr height={20} />
                <SBuscador onChange={(e) => {
                    this.setState({ filter: e })
                }} />
                <FlatList data={Object.values(datafilter).sort((a, b) => a.descripcion.toUpperCase() > b.descripcion.toUpperCase() ? 1 : -1)}
                    contentContainerStyle={{
                        flexDirection: "row",
                        width: "100%",
                        flexWrap: "wrap"
                    }}
                    renderItem={({ item }) => <Item data={item} onChange={(bol => {
                        if (bol) {
                            SSocket.sendPromise({
                                component: "staff_tipo_favorito",
                                type: "registro",
                                data: {
                                    key_usuario: this.state.key_usuario,
                                    key_staff_tipo: item.key,
                                },
                                key_usuario: Model.usuario.Action.getKey()
                            }).then(e => {
                                item.staff_tipo_favorito = e.data;
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
                                component: "staff_tipo_favorito",
                                type: "editar",
                                data: {
                                    key: item.staff_tipo_favorito.key,
                                    estado: 0,
                                },
                                key_usuario: Model.usuario.Action.getKey()
                            }).then(e => {
                                // item.staff_tipo_favorito = null;
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

                <SView style={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    height: 50
                }} onPress={() => {
                    SNavigation.goBack()
                }}>
                    <SIcon name={'next2'} fill={STheme.color.text} style={{ width: 50, height: 50 }} />
                </SView>
            </Container>
        </SPage>
    }
}
