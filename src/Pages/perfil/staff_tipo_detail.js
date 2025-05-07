import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SInput, SNavigation, SPage, SText, STheme, SView, SNotification, SLanguage, SHr, SIcon, SBuscador, SImage } from 'servisofts-component';
import { Container } from '../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import MDL from '../../MDL';
import PButtom from '../../Components/PButtom';



const Item = ({ data, onChange }) => {
    if (!data.descripcion) return null;
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
        <SText onPress={() => {
            SNavigation.navigate("/perfil/staff_tipo_detail", { key: data.key })
        }} fontSize={16}>{data.descripcion}</SText>
    </SView>
}

const ItemImage = ({ src, label }) => {
    return <SView row style={{ padding: 8, marginRight: 8, marginBottom: 8, justifyContent: "center", alignItems: "center" }} card>
        <SView style={{
            width: 18,
            height: 18,
            borderRadius: 100,
            backgroundColor: STheme.color.card,
            overflow: "hidden",
        }}>
            <SImage src={src} style={{
                resizeMode: "cover",
            }} />
        </SView>
        <SView width={4} />
        <SText fontSize={12} bold color={STheme.color.text}>{label}</SText>
        <SView width={15} />
        <SView row onPress={() => {

        }}>
            <SIcon name={"Delete"} fill={STheme.color.text} style={{ width: 25, height: 25 }} />
        </SView>
    </SView>
}

export default class staff_tipo_adm_detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // key_usuario: SNavigation.getParam("key_usuario", Model.usuario.Action.getKey())
        };
        this.key = SNavigation.getParam("key", null);
        this.key_usuario = SNavigation.getParam("key_usuario")
        if (!this.key) SNavigation.goBack();
    }
    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }
    componentDidMount() {
        SLanguage.addListener(this.onChangeLanguage.bind(this))
        SSocket.sendPromise({
            component: "staff_tipo",
            type: "getByKey",
            key: this.key
        }).then(e => {
            this.setState({ data: e.data })
            SSocket.sendPromise({
                component: "staff_tipo_favorito",
                type: "getAll",
                key_usuario: this.key_usuario
            }).then(b => {
                // console.log(b)
                // Object.values(b.data).map(a => {
                //     const st = e.data.find(x => x.key == a.key_staff_tipo);
                //     if (st) {
                //         st.staff_tipo_favorito = a;
                //     }
                // })
                const result = Object.values(b.data).find(item => item.key_staff_tipo === this.key);
                console.log("RESULT", result)
                this.setState({ dataTipoFav: result })
            }).catch(e => {
                console.log(e)
            })

        }).catch(e => {
            console.log(e)
        })
    }
    componentWillUnmount() {
        MDL.validaciones.componentDidMount();
        SLanguage.removeListener(this.onChangeLanguage)
    }

    render() {
        let lenguaje = SLanguage.language;
        // const datafilter = SBuscador.filter({ data: this.state.data ?? {}, txt: this.state.filter })
        console.log(this.state.data)
        console.log("FAV", this.state.dataTipoFav)
        console.log(!!this.state.dataTipoFav?.key_staff_tipo)
        let check = false;
        if (!this.state.dataTipoFav) {
            check = true;
        };
        // let es_favorito = false;
        // es_favorito = (this.state.dataTipoFav?.key) ? true : false;
        // console.log("HAY FAV", es_favorito)
        return <SPage title={"Staff Tipo"} >
            <SHr height={40} />
            <Container >
                <SText col={"sm-12"} justify fontSize={18} bold>{(lenguaje == "es") ? "Detalles de habilidad:" : "Skill details:"}</SText>
                <SHr height={20} />
                <SView col={"xs-12"} row style={{ borderRadius: 8, backgroundColor: STheme.color.card }} padding={10}>
                    <SText col={"xs-6"} fontSize={16} bold>{this.state.data?.descripcion}</SText>
                    <SView col={"xs-6"} row >
                        <SView width={20} height={20} >
                            <SInput type='checkBox' defaultValue={check} onChangeText={(bol => {
                                // if (bol) {
                                //     SSocket.sendPromise({
                                //         component: "staff_tipo_favorito",
                                //         type: "registro",
                                //         data: {
                                //             key_usuario: this.state.key_usuario,
                                //             key_staff_tipo: item.key,
                                //         },
                                //         key_usuario: Model.usuario.Action.getKey()
                                //     }).then(e => {
                                //         item.staff_tipo_favorito = e.data;
                                //         SNotification.send({
                                //             title: (lenguaje == "es") ? "Éxito" : "Success",
                                //             body: (lenguaje == "es") ? "Se guardaron los cambios" : "Changes saved",
                                //             time: 5000,
                                //             color: STheme.color.success
                                //         })
                                //     }).catch(e => {
                                //         SNotification.send({
                                //             title: (lenguaje == "es") ? "Error" : "Error",
                                //             body: e.error ?? (lenguaje == "es") ? "Error desconocido" : "Unknown error",
                                //             time: 5000,
                                //             color: STheme.color.danger
                                //         })

                                //     })
                                // } else {
                                //     SSocket.sendPromise({
                                //         component: "staff_tipo_favorito",
                                //         type: "editar",
                                //         data: {
                                //             key: item.staff_tipo_favorito.key,
                                //             estado: 0,
                                //         },
                                //         key_usuario: Model.usuario.Action.getKey()
                                //     }).then(e => {

                                //         delete item.staff_tipo_favorito
                                //         // item.staff_tipo_favorito = null;
                                //         SNotification.send({
                                //             title: (lenguaje == "es") ? "Éxito" : "Success",
                                //             body: (lenguaje == "es") ? "Se guardaron los cambios" : "Changes saved",
                                //             time: 5000,
                                //             color: STheme.color.success
                                //         })
                                //     }).catch(e => {
                                //         SNotification.send({
                                //             title: (lenguaje == "es") ? "Error" : "Error",
                                //             body: e.error ?? (lenguaje == "es") ? "Error desconocido" : "Unknown error",
                                //             time: 5000,
                                //             color: STheme.color.danger
                                //         })

                                //     })
                                // }

                            })}
                                width={20} height={20} style={{
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: STheme.color.gray,
                                    overflow: 'hidden',
                                }} />
                        </SView>
                    </SView>
                    <SHr width={20} />
                    <SText col={"xs-6"} fontSize={16} bold>Sueldo</SText>
                    <SInput col={"xs-4"} defaultValue={this.state.data?.sueldo} onChangeText={(text) => {
                        this.state.data.sueldo = text;
                        this.setState({ ...this.state })
                    }} fontSize={16} />
                    <SHr width={30} />
                    <SView col={"xs-12"}  center>
                        <PButtom
                            rojo
                            small
                            props={
                                {
                                    // type: "outline"
                                }
                            }
                            onPress={() => {
                                this.form.submit();
                            }}>
                            {SLanguage.select({
                                es: "GUARDAR",
                                en: "SAVE"
                            })}
                        </PButtom>
                    </SView>

                </SView>
                <SHr height={20} />
                <SView col={"xs-12"} row style={{ borderRadius: 8, backgroundColor: STheme.color.card }} padding={10}>
                    <SText col={"xs-6"} fontSize={16} bold>Bloqueos</SText>
                    <SView col={"xs-6"} flex style={{ alignItems: "flex-end" }}>
                        <SView width={30} height={30} onPress={() => {
                           
                        }}>
                            <SIcon name='Add' />
                        </SView>
                    </SView>
                    <SHr width={30} />
                    <ItemImage src={SSocket.api.root + "cliente/" + "a86e1cce-2a1e-4e9e-95ed-78c123d9d0d9"} label={"Cliente 1"} />
                    <ItemImage src={SSocket.api.root + "cliente/" + "a86e1cce-2a1e-4e9e-95ed-78c123d9d0d9"} label={"Cliente 2"} />
                    <ItemImage src={SSocket.api.root + "cliente/" + "a86e1cce-2a1e-4e9e-95ed-78c123d9d0d9"} label={"Cliente 3"} />
                    <ItemImage src={SSocket.api.root + "cliente/" + "a86e1cce-2a1e-4e9e-95ed-78c123d9d0d9"} label={"Cliente 4"} />
                    <ItemImage src={SSocket.api.root + "cliente/" + "a86e1cce-2a1e-4e9e-95ed-78c123d9d0d9"} label={"Cliente 5"} />
                </SView>
                {/* <SHr height={20} />
                <SBuscador onChange={(e) => {
                    this.setState({ filter: e })
                }} /> */}
                {/* <FlatList data={Object.values(datafilter ?? {}).sort((a, b) => (a?.descripcion ?? "").toUpperCase() > (b?.descripcion ?? "").toUpperCase() ? 1 : -1)}
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

                                delete item.staff_tipo_favorito
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

                    })} />} /> */}

                {/* <SView style={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    height: 50
                }} onPress={() => {

                    let select = Object.values(datafilter).filter(e => e.staff_tipo_favorito).length;
                    if (select <= 0) {
                        SNotification.send({
                            title: "Error",
                            body: SLanguage.select({
                                en: "Please select at least one staff type",
                                es: "Por favor selecciona al menos un tipo de staff"
                            }),
                            // body: "Please select at least one staff type", 
                            color: STheme.color.danger,
                        })
                        return;
                    }
                    SNavigation.goBack()
                }}>
                    <SIcon name={'next2'} fill={STheme.color.text} style={{ width: 50, height: 50 }} />
                </SView> */}
            </Container>
        </SPage>
    }
}
