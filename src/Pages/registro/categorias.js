import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SForm, SHr, SNavigation, SPage, SPopup, SText, STheme, SView, SIcon, SList, SGradient } from 'servisofts-component';
import { AccentBar } from '../../Components';
import Container from '../../Components/Container';
import Model from '../../Model';
// import SectionApis from '../login/components/SectionApis';
import BtnSend from './components/BtnSend';
import Header from './components/Header';
import CryptoJS from 'crypto-js';
import PButtom from '../../Components/PButtom';
import SSocket from 'servisofts-socket';
import { FlatList, StyleSheet } from 'react-native';

class categorias extends Component {
    constructor(props) {
        super(props);
        this.state = {
            envio: 0,
            selectedItems: {}
        };
        this.params = SNavigation.getAllParams();
    }

    componentDidMount() {
        this.requestData();
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
            component: "staff_tipo",
            type: "getAll",
        }).then(e => {
            // if (e.data.length <= 0) {
            //   this.state.endData = true;
            // }
            // this.state.dataTipo = [...this.state.dataTipo, ...e.data]
            this.setState({ data: Object.values(e.data), refreshing: false })
        }).catch(e => {
            // this.setState({ refreshing: false })
        })

    }

    toggleSelection = (key) => {
        this.setState(prevState => {
            const newSelectedItems = { ...prevState.selectedItems };

            if (newSelectedItems[key]) {
                // Si el elemento ya está seleccionado, eliminarlo del estado
                delete newSelectedItems[key];
            } else {
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
        return (
            <SPage footer={<SView col={'xs-12'} row center>
                <SView col={'xs-11'} row>
                    <SView col={'xs-6'} >
                        <SView onPress={() => {
                            SNavigation.goBack()
                        }}
                            style={{
                                backgroundColor: STheme.color.secondary,
                                borderRadius: 10,
                            }} width={80} height={50} center>
                            <SText color={STheme.color.text} fontSize={16}>Atrás</SText>
                        </SView>
                    </SView>
                    <SView col={'xs-6'} style={{ alignItems: "flex-end" }}>
                        <SView onPress={() => SNavigation.navigate("/registro/foto")}>
                            <SIcon name={'next2'} style={{ width: 50, height: 50 }} />
                        </SView>
                    </SView>
                </SView>
                <SHr height={20} />
            </SView>}
            >
                <SView col={"xs-12"} center>
                    <SView col={"xs-11"} >
                        <SIcon name={"Logo"} fill={STheme.color.primary} width={80} height={43} />
                        <SHr height={10} />
                    </SView>
                    <Header title="Positions to apply for" />

                    <SHr height={50} />
                    <Container>

                        <SView col={"xs-12"} style={{
                            flexDirection: 'row', // Coloca los elementos en una fila
                            flexWrap: 'wrap', // Permite que los elementos bajen a la siguiente fila
                            justifyContent: 'flex-start',
                        }} >
                            <SList
                                data={this.state.data}
                                contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}
                                order={[{ "key": "fecha_on", order: "desc", type: "date" }]}
                                render={(f) => {
                                    const isSelected = this.state.selectedItems[f.key]; // Verifica si el elemento está seleccionado
                                    return <SView padding={5}>
                                        <SView row style={{
                                            padding: 5,
                                            borderRadius: 5,
                                            borderWidth: 1,
                                            borderColor: STheme.color.darkGray,
                                            overflow: "hidden"
                                        }}
                                        >
                                            <SGradient
                                                colors={['#040405', '#0C0C10']}
                                                start={{ x: 0, y: 1 }}
                                                end={{ x: 1, y: 1 }}
                                            />
                                            <SView
                                                col={'xs-1'}
                                                onPress={() => {
                                                    //this.setState(this.state.envio == 0 ? { envio: 1 } : { envio: 0 });
                                                    this.toggleSelection(f.key)
                                                }}>
                                                <SIcon
                                                    name={isSelected ? 'IconCheckedOk' : 'IconChecked'}
                                                    fill={STheme.color.text}
                                                    width={20}
                                                    height={20}></SIcon>
                                            </SView>
                                            <SView width={15} />
                                            <SText center fontSize={14} >{f.descripcion}</SText>
                                        </SView>
                                    </SView>
                                }}
                            />

                        </SView>

                        <SHr height={30} />



                        {/* <PButtom onPress={() => this.form.submit()}>{"Registrar"}</PButtom> */}

                        <SHr height={30} />
                        {/* <SectionApis /> */}
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