import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SInput, SNavigation, SPage, SText, STheme, SView, SNotification, SLanguage, SHr, SIcon, SBuscador,SImage } from 'servisofts-component';
import { Container } from '../../Components';
import SSocket from 'servisofts-socket';
import Model from '../../Model';
import MDL from '../../MDL';
import PButtom from '../../Components/PButtom';


const ItemImage = ({ src, label, onRemove }) => {
    return (
        <SView
            col={"xs-5"}
            style={{
                padding: 6,
                marginBottom: 8,
                height: 40,
                borderWidth: 1,
                borderColor: STheme.color.gray,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center", 
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
    const isChecked = !!data.staff_tipo_favorito;

    return (
        <SView padding={10} row center
        style={{height:isChecked?"auto":35,
            overflow: "hidden",
        
        }}>
            <SView width={20} height={20}>
            <SInput
                    type="checkBox"
                    defaultValue={!!data.staff_tipo_favorito}
                    onChangeText={(value) => {
                        onChange(value); 
                    }}
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
    <SView col={"xs-12"} style={{
        padding: 16,
        borderRadius: 12,
        backgroundColor: STheme.color.card,
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2
    }}>
        <SView row style={{ alignItems: "center", gap: 8 }}>
            <SText fontSize={14} color={STheme.color.text}>
                {SLanguage.select({ en: "Salary:", es: "Sueldo:" })}
            </SText>
            <SInput 
                values={data.staff_tipo_favorito.sueldo} 
                type="money" 
                onChangeText={(value) => {
                    data.staff_tipo_favorito.sueldo = value;
                }}
                style={{
                    flex: 1,
                    height: 40,
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    justifyContent: "center"
                }}
            />
        
        <SView style={{ marginTop: 10 }}>
            <PButtom
                style={{
                    height: 43.5,
                    padding: 10,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    justifyContent: "center",
                    backgroundColor: STheme.color.secondary,
                }}
                props={{ type: "danger" }}
                onPress={() => {
                    // Acción del botón
                }}
            >
                {SLanguage.select({ es: "Guardar", en: "Save" })}
            </PButtom>
            </SView>
        </SView>
    </SView>
)}


    <SHr height={0} />
    {data.staff_tipo_favorito && (
    <SView
        col={"xs-12"}
        style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor: STheme.color.card,
            marginTop: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 2,
        }}
    >
        <SView row style={{ alignItems: "center", justifyContent: "space-between" }}>
            <SText style={{marginBottom:8}} fontSize={14} color={STheme.color.text}>
                {SLanguage.select({ en: "Blocked for:", es: "Bloqueado para:" })}
            </SText>

        </SView>

     
        <SView
            col={"xs-14"}
            row
            style={{
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "flex-start",
            }}
        >
            {[1, 2, 3, 4, 5].map((i) => (
                <ItemImage
                    key={i}
                    src={`${SSocket.api.root}cliente/a86e1cce-2a1e-4e9e-95ed-78c123d9d0d9`}
                    label={`Cliente ${i}`}
                />
            ))}
        </SView>
        <SHr height={10} />
        <PButtom
                style={{
                    height: 40,
                    padding: 10,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    justifyContent: "center",
                    backgroundColor: STheme.color.secondary,
                }}
                props={{ type: "danger" }}
                onPress={() => {
                    // Acción del botón
                }}
            >
                {SLanguage.select({ es: "Agregar bloqueo", en: "Add block" })}
            </PButtom>
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
        width: "80%",
        flexWrap: "wrap",
        padding: 5, 
        marginLeft:50,
    }}
    renderItem={({ item }) => {
        const isEmpty=!item.descripcion;
        console.log("item", item)
    return(
        <SView
            col={"xs-16 sm-12 md-12"} 
            style={{
                padding: 10,
                height:isEmpty?0:"auto",
            }}
        >
            <SView
                style={{
                    backgroundColor: STheme.color.card, 
                    borderRadius: 8, 
                    padding: 15, 
                    elevation: 3, 
                    shadowColor: "#000", 
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    height: isEmpty? 50 : "auto", 

                }}
            >
                <Item
                    data={item}
                    onChange={(bol) => {
                        this.setState((prevState) => {
                            const updatedData = { ...prevState.data };
                            updatedData[item.key].staff_tipo_favorito = bol ? true : false;
                            return { data: updatedData };
                        });
                    
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
}
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
