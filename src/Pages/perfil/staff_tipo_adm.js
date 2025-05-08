import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SInput, SNavigation, SPage, SText, STheme, SView, SNotification, SLanguage, SHr, SIcon, SBuscador,SImage } from 'servisofts-component';
import { Container } from '../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import MDL from '../../MDL';


const ItemImage = ({ src, label, onRemove }) => {
    return (
        <SView
            col={"xs-6"}
            style={{
                padding: 6,
                marginBottom: 8,
                height: 40,
                borderWidth: 1,
                borderColor: STheme.color.gray,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center", // centra vertical
            }}
        >
            <SView
                width={20}
                height={20}
                style={{
                    borderRadius: 100,
                    backgroundColor: STheme.color.card,
                    overflow: "hidden",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <SImage
                    src={src}
                    style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: "cover",
                    }}
                />
            </SView>
            <SView width={4} />
            <SText fontSize={12} color={STheme.color.text}>
                {label}
            </SText>
            {!!onRemove && (
                <SView onPress={onRemove} style={{ marginLeft: 6 }}>
                    <SIcon name="Close" width={10} height={10} fill={STheme.color.danger} />
                </SView>
            )}
        </SView>
    );
};

const Item = ({ data, onChange }) => {
    if (!data.descripcion) return null;

    return (
        <SView padding={10} row center>
            <SView width={20} height={20}>
                <SInput
                    type="checkBox"
                    defaultValue={!!data.staff_tipo_favorito}
                    onChangeText={onChange}
                    width={20}
                    height={20}
                    style={{
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: STheme.color.gray,
                        overflow: "hidden",
                    }}
                />
            </SView>
            
            <SView width={4} />
            <SText
                onPress={() => {
                    SNavigation.navigate("/perfil/staff_tipo_detail", {
                        key: data.key,
                        key_usuario: SNavigation.getParam("key_usuario"),
                    });
                }}
                fontSize={16}
            >
                {data.descripcion}
            </SText>

            {data.staff_tipo_favorito && (
                <SView col={"xs-12"} row style={{ marginTop: 10 }}>
                    <SText col={"xs-6"} fontSize={14} color={STheme.color.text}>
                        {SLanguage.select({ en: "Salary:", es: "Sueldo:" })} {data.sueldo}
                    </SText>
                    <SInput col={"xs-5"} />

                    <SHr height={20} />
                
                    <SText col={"xs-12"} fontSize={14} color={STheme.color.text}>
                        {SLanguage.select({ en: "Blocked for:", es: "Bloqueado para:" })}
                    </SText>

                    <SView col={"xs-12"} row style={{ marginTop: 8, alignItems: "center" }}>
                        <SView width={30} height={30} onPress={() => { }}>
                            <SIcon name="Add" />
                        </SView>
                        
                    </SView>
                    
                    <SView
                        col={"xs-12"}
                        row
                        style={{
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                         
                            padding: 8,
                            borderRadius: 8,
                        }}
                    >
                    <ItemImage src={SSocket.api.root + "cliente/" + "a86e1cce-2a1e-4e9e-95ed-78c123d9d0d9"} label={"Cliente 1"} />
                    <ItemImage src={SSocket.api.root + "cliente/" + "a86e1cce-2a1e-4e9e-95ed-78c123d9d0d9"} label={"Cliente 2"} />
                    <ItemImage src={SSocket.api.root + "cliente/" + "a86e1cce-2a1e-4e9e-95ed-78c123d9d0d9"} label={"Cliente 3"} />
                    <ItemImage src={SSocket.api.root + "cliente/" + "a86e1cce-2a1e-4e9e-95ed-78c123d9d0d9"} label={"Cliente 4"} />
                    <ItemImage src={SSocket.api.root + "cliente/" + "a86e1cce-2a1e-4e9e-95ed-78c123d9d0d9"} label={"Cliente 5"} />
                    </SView>
                </SView>
            )}
        </SView>
    );
};

export default class staff_tipo_adm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key_usuario: SNavigation.getParam("key_usuario", Model.usuario.Action.getKey()),

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
        MDL.validaciones.componentDidMount();
        SLanguage.removeListener(this.onChangeLanguage)
    }

    render() {
        let lenguaje = SLanguage.language;
        const datafilter = SBuscador.filter({ data: this.state.data ?? {}, txt: this.state.filter })
        return <SPage title={"Staff Tipo"} disableScroll>
            <SHr height={40} />

            <Container flex>
                <SText col={"sm-12"} justify fontSize={18} bold>{(lenguaje == "es") ? "Seleccione las habilidades del staff:" : "Select the staff's skills:"}</SText>
                <SHr height={20} />
                <SBuscador onChange={(e) => {
                    this.setState({ filter: e })
                }} />
<FlatList
    data={Object.values(datafilter ?? {}).sort((a, b) =>
        (a?.descripcion ?? "").toUpperCase() > (b?.descripcion ?? "").toUpperCase() ? 1 : -1
    )}
    contentContainerStyle={{
        flexDirection: "column",
        width: "100%",
        flexWrap: "wrap",
        padding: 10, // Espaciado general
    }}
    renderItem={({ item }) => (
        <SView
            col={"xs-16 sm-12 md-12"} // Ajusta el tamaño de las tarjetas según el tamaño de la pantalla
            style={{
                padding: 10,
            }}
            onPress={() => {
                this.setState({ selectedItem: item,showModal:true });
            }}
        >
            <SView
                style={{
                    backgroundColor: STheme.color.card, // Color de fondo de la tarjeta
                    borderRadius: 8, // Bordes redondeados
                    padding: 15, // Espaciado interno
                    elevation: 3, // Sombra para Android
                    shadowColor: "#000", // Sombra para iOS
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                }}
            >
                <Item
                    data={item}
                    onChange={(bol) => {
                        if (bol) {
                            SSocket.sendPromise({
                                component: "staff_tipo_favorito",
                                type: "registro",
                                data: {
                                    key_usuario: this.state.key_usuario,
                                    key_staff_tipo: item.key,
                                },
                                key_usuario: Model.usuario.Action.getKey(),
                            })
                                .then((e) => {
                                    item.staff_tipo_favorito = e.data;
                                    SNotification.send({
                                        title: lenguaje === "es" ? "Éxito" : "Success",
                                        body: lenguaje === "es" ? "Se guardaron los cambios" : "Changes saved",
                                        time: 5000,
                                        color: STheme.color.success,
                                    });
                                })
                                .catch((e) => {
                                    SNotification.send({
                                        title: lenguaje === "es" ? "Error" : "Error",
                                        body: e.error ?? (lenguaje === "es" ? "Error desconocido" : "Unknown error"),
                                        time: 5000,
                                        color: STheme.color.danger,
                                    });
                                });
                        } else {
                            SSocket.sendPromise({
                                component: "staff_tipo_favorito",
                                type: "editar",
                                data: {
                                    key: item.staff_tipo_favorito.key,
                                    estado: 0,
                                },
                                key_usuario: Model.usuario.Action.getKey(),
                            })
                                .then((e) => {
                                    delete item.staff_tipo_favorito;
                                    SNotification.send({
                                        title: lenguaje === "es" ? "Éxito" : "Success",
                                        body: lenguaje === "es" ? "Se guardaron los cambios" : "Changes saved",
                                        time: 5000,
                                        color: STheme.color.success,
                                    });
                                })
                                .catch((e) => {
                                    SNotification.send({
                                        title: lenguaje === "es" ? "Error" : "Error",
                                        body: e.error ?? (lenguaje === "es" ? "Error desconocido" : "Unknown error"),
                                        time: 5000,
                                        color: STheme.color.danger,
                                    });
                                });
                        }
                    }}
                />
            </SView>
        </SView>
    )}
/>

                <SView style={{
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
                </SView>
            </Container>
        </SPage>
    }
}
