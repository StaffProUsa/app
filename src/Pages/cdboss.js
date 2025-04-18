//import liraries
import React, { Component } from 'react';

import { View, Text, StyleSheet } from 'react-native';
import { SDate, SHr, SIcon, SImage, SNavigation, SPage, SText, STheme, SView } from 'servisofts-component';
import { Container } from '../Components';
import SSocket from 'servisofts-socket';
import evento from '../Services/Casagrandeadmin/Components/evento';
import CardEventoSteps from '../Components/Evento/CardEventoSteps';
import MarcarPorCodigoEvento from '../Components/Asistencia/MarcarPorCodigoEvento';
import Mapa from "./Evento/Components/Mapa";
const fontz = 16

// create a component
class cdboss extends Component {
    key_staff = SNavigation.getParam("key_staff");
    key_boss = SNavigation.getParam("key_boss");
    state = {
        data: null,
    }
    componentDidMount() {
        console.log("asdadas 1")
        SSocket.sendPromise({
            component: "staff",
            type: "getPerfilBoss",
            key_staff: this.key_staff,
            key_boss: this.key_boss,
        }).then(res => {
            console.log("asdadas con otro 2")
            this.setState({
                data: res.data
            })
            // this.state.data = res.data
            // this.forceUpdate();
        }).catch(err => {

        })
        console.log("asdadas con otro 3")
    }
    render() {


        return <SPage>
            <SHr h={16} />
            <Container loading={!this.state.data} >

                <SView style={{
                    width: "100%",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center"
                }} >
                    <SView flex>
                        <SText style={{
                            flex: 1,
                            fontSize: fontz * 1.4,
                            textAlign: "left"

                        }}>{this.state?.data?.evento?.descripcion}</SText>
                        <SHr />
                        <SView row col={"xs-12"} style={{
                        }}>
                            <SText fontSize={fontz} color={STheme.color.lightGray} language={{
                                en: new SDate(this.state?.data?.evento?.fecha, "yyyy-MM-dd").toString("MONTH dd, yyyy"),
                                es: new SDate(this.state?.data?.evento?.fecha, "yyyy-MM-dd").toString("dd de MONTH del yyyy")
                            }} />
                            <SText fontSize={fontz} color={STheme.color.lightGray} language={{
                                es: " desde las ",
                                en: " from ",

                            }} />
                            <SText fontSize={fontz} color={STheme.color.text} language={{
                                en: new SDate(this.state?.data?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH"),
                                es: new SDate(this.state?.data?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")
                            }} />
                            <SText fontSize={fontz} color={STheme.color.lightGray} language={{
                                es: " hasta las ",
                                en: " to ",
                            }} />
                            <SText fontSize={fontz} color={STheme.color.text} language={{
                                en: new SDate(this.state?.data?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH"),
                                es: new SDate(this.state?.data?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")
                            }} />
                        </SView>
                    </SView>
                    <SView style={{
                        width: 80,
                        height: 80,
                        borderRadius: 100,
                        overflow: 'hidden',
                        backgroundColor: STheme.color.card
                    }} >
                        <SImage style={{
                            resizeMode: "cover",
                        }} src={SSocket.api.root + "cliente/" + this.state?.data?.cliente?.key} />
                    </SView>
                </SView>
                <SHr h={24} />
            </Container >
            <SView style={{
                backgroundColor: STheme.color.secondary,
                height: 55,
            }} center>
                <Container loading={!this.state.data} >
                    <MensajeEstado data={this.state.data} />
                </Container>
            </SView>

            <SHr height={30} />

            <Container loading={!this?.state?.data}>
                <SView col="xs-12">
                    <SView row col="xs-12" style={{
                        borderBottomWidth: 1,
                        borderColor: STheme.color.card,
                        paddingBottom: 4
                    }}>
                        <SText bold fontSize={fontz * 1.2} language={
                            {
                                es: "Detalles del evento",
                                en: "Event details",

                            }
                        } />


                        <SView flex />
                        <ItemImage src={SSocket.api.root + "company/" + this.state.data?.company.key} label={this.state.data?.company.descripcion} />
                        <ItemImage src={SSocket.api.root + "cliente/" + this.state.data?.cliente.key} label={this.state.data?.cliente.descripcion} />
                        <ItemImage src={SSocket.api.root + "staff_tipo/" + this.state.data?.staff_tipo.key} label={this.state.data?.staff_tipo.descripcion} />
                    </SView>
                </SView>

                <SHr h={30} />
                <SText col={"xs-12"} fontSize={fontz} color={STheme.color.lightGray} >{this.state?.data?.evento?.observacion}</SText>
                <SHr h={16} />
                <SView row center col={"xs-12"} style={{
                }}>
                    {/* Aqui es la segunda FOTO */}
                    <SView width={80} height={80} card style={{
                        overflow: "hidden"
                    }}>
                        <SImage style={{
                            resizeMode: "cover",
                        }} src={SSocket.api.root + "staff_tipo/" + this.state?.data?.staff_tipo?.key} />
                    </SView>
                    <SView flex style={{
                        paddingLeft: 8,
                    }} >
                        <SText fontSize={fontz * 1.18} numberOfLines={1}>{this.state?.data?.staff_tipo?.descripcion}</SText>
                        <SText fontSize={fontz * 0.89} color={STheme.color.lightGray} >{this.state?.data?.staff?.descripcion}</SText>
                    </SView>
                    <SHr h={20} />
                    <SView row col="xs-12" >
                        <SText width={120} fontSize={fontz} language={{
                            es: "Nivel de ingles:",
                            en: "Level of english:",
                        }}></SText>
                        <SText flex fontSize={fontz}  >{this.state?.data?.staff?.nivel_ingles}</SText>
                    </SView>
                    <SHr h={20} />
                    <SView row col="xs-12">
                        <SText width={120} fontSize={fontz} language={{
                            es: "Dirección:",
                            en: "Address:",

                        }}></SText>
                        <SText flex fontSize={fontz * .95}  >{this.state?.data?.cliente.direccion}</SText>
                    </SView>
                    <SHr h={20} />
                    <SView row col="xs-12">
                        <SText width={120} fontSize={fontz} language={{
                            es: "Requerimientos del cliente:",
                            en: "Customer requirements:",

                        }}></SText>
                        <SText flex fontSize={fontz * .95}  >{this.state?.data?.cliente.observacion}</SText>
                    </SView>

                    <SHr h={30} />
                    <SText col={"xs-12"} fontSize={fontz * 1.5} bold language={{
                        es: "Datos del staff",
                        en: "Staff data",
                    }}></SText>

                </SView>

                <SView row col="xs-12" style={{
                    borderBottomWidth: 1,
                    borderColor: STheme.color.card,
                    paddingBottom: 4
                }}>

                </SView>

                <SHr h={20} />
                <SView row col="xs-12">

                    <CuadradoInfo number={this.state?.data?.cantidad_total ?? 0} height={50} label={"Personas en el evento"}
                        onPress={() => SNavigation.navigate("/boss")}
                        color={STheme.color.lightGray}
                    />


                </SView><SHr height={16} />
                <SView row col={"xs-12"} >
                    <CuadradoInfo label={"Numero de personas sin clock in"}
                        number={this.state?.data?.not_clockin ?? 0}
                        onPress={() => SNavigation.navigate("/boss")}
                        color={STheme.color.danger}
                    />
                    <SView style={{
                        width: 16
                    }} />
                    <CuadradoInfo label={"Numero de personas trabajando"} color={STheme.color.warning}
                        number={this.state?.data?.cantidad_en_curso ?? 0}
                        onPress={() => SNavigation.navigate("/boss")} />
                    <SView style={{
                        width: 16
                    }} />
                    <CuadradoInfo label={"Numero de personas que trabajaron"} color={STheme.color.success}
                        number={this.state?.data?.cantidad_clockout ?? 0}
                        onPress={() => SNavigation.navigate("/boss")} />
                </SView>
                <SHr h={12} />
                {/* <SText onPress={() => SNavigation.navigate("/boss")}>{"GO TO BOSS"}</SText> */}
                <MarcarPorCodigoEvento
                    dataJefe={true}
                    key_evento={this.state?.data?.evento?.key}
                    onChange={() => {
                        this.componentDidMount();
                    }} />

                <SHr color={STheme.color.card} h={1} />
                <SHr h={20} />
                <SView center row col={"xs-12"}>
                    <SIcon name="iubicacion" fill={STheme.color.text} width={15} height={18} />
                    <SView width={5} />


                    <SText bold style={{
                        fontSize: fontz,
                    }} language={{
                        es: "Ubicación",
                        en: "Location",
                    }}></SText>
                </SView>

                <SHr h={30} />
                <Mapa height={400} data={this.state.data} />


            </Container>



        </SPage >
    }
}

// define your styles

const ItemImage = ({ src, label }) => {
    return <SView row style={{ padding: 2, paddingRight: 16, justifyContent: "center", alignItems: "center" }}>
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
        <SText fontSize={12} bold color={STheme.color.lightGray}>{label}</SText>
    </SView>

}

const CuadradoInfo = ({ onPress, height, color, label, number }) => {
    return <SView onPress={onPress} style={{

        flex: 1,
        height: height ?? 90,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: color,
        overflow: 'hidden',
        backgroundColor: color + "55",

    }} center>
        <SText center fontSize={22} bold>{number}</SText>
        <SText center>{label}</SText>

    </SView>
}
const MensajeEstado = ({ data }) => {
    const fecha_inicio = new SDate(data.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD");
    const fecha_fin = new SDate(data.staff.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD");
    const curdate = new SDate();

    if (curdate.getTime() < fecha_inicio.getTime()) {
    const since = fecha_inicio.timeSince(fecha_fin)
        return <SText>{"Faltan "+ since }</SText>
    }
    if (curdate.getTime() > fecha_fin.getTime()) {
        return <SText>Estado pasado</SText>
    }
    if (curdate.getTime() > fecha_inicio.getTime() && curdate.getTime() < fecha_fin.getTime()) {
        return <SText>Estado presente</SText>
    }
    return <SText>Estado actual</SText>
}
//make this component available to the app
export default cdboss;
