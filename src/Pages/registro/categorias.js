import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SHr, SNavigation, SPage, SPopup, SText, STheme, SView, SIcon, SList, SGradient, SList2, SImage, SNotification, SLanguage } from 'servisofts-component';
import Container from '../../Components/Container';

import Header from './components/Header';
import SSocket from 'servisofts-socket';
import { FlatList, StyleSheet } from 'react-native';
import Model from '../../Model';
import Inicio from '../Inicio';

class categorias extends Component {
    constructor(props) {
        super(props);
        this.state = {
            envio: 0,
            selectedItems: {}
        };
        this.params = SNavigation.getAllParams();
    }

    onChangeLanguage(language) {
        this.setState({ ...this.state })
    }

    componentDidMount() {
        this.requestData();
        SLanguage.addListener(this.onChangeLanguage.bind(this))
    }

    componentWillUnmount() {
        SLanguage.removeListener(this.onChangeLanguage)
    }


    icon = (name) => {
        return <SIcon
            name={name}
            fill={STheme.color.primary}
            width={17}
            height={20}
        />
    }

    requestData() {
        SSocket.sendPromise({
            component: "evento",
            type: "getInicioFiltros",
            key_usuario: Model.usuario.Action.getKey()
        }).then(e => {
            let listTypes = [];
            Object.values(e.data).map((company) => {
                listTypes = [...listTypes, ...company.staff_tipos]
            })
            Object.values(e.favoritos).map(a => {
                this.state.selectedItems[a.key_staff_tipo] = a
            })
            this.setState({ data: listTypes, favoritos: e.favoritos, refreshing: false })
            // console.log(e);
        }).catch(e => {
            console.error(e);
        })


    }

    toggleSelection = (key) => {
        this.setState(prevState => {
            const newSelectedItems = { ...prevState.selectedItems };

            if (newSelectedItems[key]) {
                // Si el elemento ya está seleccionado, eliminarlo del estado
                SSocket.sendPromise({
                    component: "staff_tipo_favorito",
                    type: "editar",
                    data: {
                        ...newSelectedItems[key],
                        estado: 0,
                    },
                    key_usuario: Model.usuario.Action.getKey(),

                }).then(e => {
                    if (Inicio.INSTANCE) Inicio.INSTANCE.onChangeFavorito();
                }).catch(e => {
                    // delete newSelectedItems[key];
                    SNotification.send({
                        title: "Error",
                        body: e.error ?? "Ocurrio error",
                    })
                })
                delete newSelectedItems[key];
            } else {
                SSocket.sendPromise({
                    component: "staff_tipo_favorito",
                    type: "registro",
                    data: {
                        key_staff_tipo: key,
                        key_usuario: Model.usuario.Action.getKey(),
                    },
                    key_usuario: Model.usuario.Action.getKey(),

                }).then(e => {
                    if (Inicio.INSTANCE) Inicio.INSTANCE.onChangeFavorito();
                    this.state.selectedItems[e.data.key_staff_tipo] = e.data;
                }).catch(e => {
                    delete newSelectedItems[key];
                    SNotification.send({
                        title: "Error",
                        body: e.error ?? "Ocurrio error",
                    })
                })
                // Si el elemento no está seleccionado, añadirlo al estado
                newSelectedItems[key] = true;
                // newSelectedItems = {...prevState.selectedItems, key}
            }

            return { selectedItems: newSelectedItems };
        });
    }

    render() {
        var defaultData = {
            ...this.params,
        };
        console.log(this.state.selectedItems)
        let lenguaje = SLanguage.language;
        let titleHeader = "¿En qué soy bueno?";
        if (lenguaje == "en") {
            titleHeader = "What am I good at?";
        }
        return (
            <SPage footer={<SView col={'xs-12'} disabled row center>
                <SView col={'xs-11'} row>
                    <SView col={'xs-6'} >
                        {/* <SView onPress={() => {
                            SNavigation.goBack()
                        }}
                            style={{
                                backgroundColor: STheme.color.secondary,
                                borderRadius: 10,
                            }} width={80} height={50} center>
                            <SText color={STheme.color.text} fontSize={16} language={{
                                en: "Back",
                                es: "Atrás",
                            }}></SText>
                        </SView> */}
                    </SView>
                    <SView col={'xs-6'} style={{ alignItems: "flex-end" }}>
                        <SView onPress={() => SNavigation.navigate("/inicio")}>
                            <SIcon name={'next2'} fill={STheme.color.text} style={{ width: 50, height: 50 }} />
                        </SView>
                    </SView>
                </SView>
                <SHr height={20} />
            </SView>}
            >
                <SView col={"xs-12"} center>
                    <SView col={"xs-11"} >
                        <SHr height={10} />
                        <SIcon name={"Logo"} fill={STheme.color.text} width={80} height={43} />
                        <SHr height={10} />
                    </SView>
                    <Header title={titleHeader} />
                    <SHr height={50} />
                    <Container>
                        <SView col={"xs-12"} style={{
                            flexDirection: 'row', // Coloca los elementos en una fila
                            flexWrap: 'wrap', // Permite que los elementos bajen a la siguiente fila
                            justifyContent: 'flex-start',
                        }} >
                            <SList2
                                scrollEnabled={false}
                                data={this.state.data}
                                horizontal
                                contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}
                                space={0}
                                order={[{ "key": "fecha_on", order: "desc", type: "date" }]}
                                render={(f) => {
                                    const isSelected = this.state.selectedItems[f.key]; // Verifica si el elemento está seleccionado
                                    return <SView row style={{
                                        marginTop: 8,
                                        marginRight: 8,
                                        borderRadius: 5,
                                        borderWidth: 1,
                                        borderColor: STheme.color.darkGray,
                                        overflow: "hidden",
                                        alignItems: "center",
                                    }} onPress={() => {
                                        //this.setState(this.state.envio == 0 ? { envio: 1 } : { envio: 0 });
                                        this.toggleSelection(f.key)
                                    }}>
                                        {/* <SGradient
                                                colors={['#040405', '#0C0C10']}
                                                start={{ x: 0, y: 1 }}
                                                end={{ x: 1, y: 1 }}
                                            /> */}
                                        <SView
                                            width={30}
                                            height={30}
                                            center
                                        >
                                            <SImage src={SSocket.api.root + "staff_tipo/" + f.key} />
                                        </SView>

                                        <SView width={4} />
                                        <SText fontSize={14} >{f.descripcion}</SText>
                                        <SView width={4} />
                                        <SView
                                            width={30}
                                            height={30}
                                            center
                                        >
                                            <SIcon
                                                name={isSelected ? 'IconCheckedOk' : 'IconChecked'}
                                                fill={isSelected ? STheme.color.success : STheme.color.lightGray}
                                                width={20}
                                                height={20}></SIcon>
                                        </SView>
                                        <SView width={4} />
                                    </SView>
                                }}
                            />
                        </SView>
                    </Container>
                </SView>
            </SPage>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centrar verticalmente
        alignItems: 'center', // Centrar horizontalmente
    },
    listContainer: {
        flexDirection: 'row', // Asegura que los elementos sean horizontales
    },
    nameContainer: {
        borderWidth: 1, // Borde alrededor del nombre
        borderColor: '#000', // Color del borde
        padding: 10, // Espacio alrededor del texto
        marginHorizontal: 5, // Espacio entre los nombres
        borderRadius: 5, // Bordes redondeados
    },
    nameText: {
        fontSize: 16, // Tamaño de la fuente
    },
});

const initStates = (state) => {
    return { state }
};
export default connect(initStates)(categorias);