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
    state = {
        data: {

            "cliente": {
                "descripcion": "Calistenia",
                "estado": 1,
                "key_company": "b8118596-9980-4a27-aa4e-a48384095350",
                "contacto": "Jose Miguel",
                "key_usuario": "1e2ef5fd-4fb5-40ff-84df-30f34a2b162e",
                "nivel_ingles": null,
                "fecha_on": "2025-03-07T02:39:11.993",
                "latitude": -17.767878304597797,
                "direccion": "Calle Padre Ceferino Mussani, La Santa Cruz, Municipio Santa Cruz de la Sierra, Provincia Andrés Ibáñez, Santa Cruz, Bolivia",
                "index": null,
                "papeles": false,
                "telefono": "+1 (787) 986-7867",
                "key": "a86e1cce-2a1e-4e9e-95ed-78c123d9d0d9",
                "observacion": "En este espacio, podrás encontrar todos los requerimientos que el cliente ha solicitado para el proyecto. \n📝 Es importante que revises cada detalle cuidadosamente, ya que aquí se plasman todas las necesidades y expectativas que debemos cumplir para garantizar un resultado óptimo. 🎯\nRecuerda que cualquier modificación o actualización será comunicada a través de este mismo apartado, para que siempre estemos alineados con lo que el cliente espera. \n🛠️👉 Por favor, mantén este espacio siempre actualizado y asegúrate de verificar los requerimientos antes de iniciar cualquier tarea.\n¡Gracias por tu colaboración! 😊                          ",
                "longitude": -63.18432695108003
            },
            "evento": {
                "descripcion": "Ice cream bar ",
                "fecha": "2025-04-17T00:00:00",
                "estado": 1,
                "key_company": "b8118596-9980-4a27-aa4e-a48384095350",
                "key_usuario": "99bbf5bf-cb7e-424b-a65e-5ec9c73c1121",
                "fecha_on": "2025-04-17T13:13:04.718",
                "estado_venta": 0,
                "key_cliente": "a86e1cce-2a1e-4e9e-95ed-78c123d9d0d9",
                "key": "d3f4018d-6f19-4b07-9aec-86b4ed4ad160",
                "observacion": "event on 4/24 for Earth Day/Bring your Child to Work Day and are expecting upwards of 200 guests (+ children!)"
            },
            "staff": {
                "descripcion": "event on 4/24 for Earth Day/Bring your Child to Work Day and are expecting upwards of 200 guests (+ children!)",
                "estado": 1,
                "key_usuario": "99bbf5bf-cb7e-424b-a65e-5ec9c73c1121",
                "nivel_ingles": "BASIC",
                "key_staff_tipo": "0302e259-477b-4873-af37-35d9dfe0a2c3",
                "fecha_on": "2025-04-17T13:13:35.178",

                "fecha_inicio": "2025-04-18T10:00:00-04:00",
                "fecha_fin": "2025-04-18T20:00:00-04:00",

                "cantidad": 1,
                "key_evento": "d3f4018d-6f19-4b07-9aec-86b4ed4ad160",
                "key": "bae00f8e-d4ae-40ee-9e6d-5309bed75934",
                "observacion": null
            },
            "company": {
                "descripcion": "Servisofts",
                "estado": 1,
                "contacto": "",
                "key_usuario": "798994df-71c1-4850-b45d-6fc2642e6fb3",
                "fecha_on": "2024-11-11T23:55:06.306",
                "latitude": null,
                "direccion": "",
                "telefono": "+1 ",
                "key": "b8118596-9980-4a27-aa4e-a48384095350",
                "observacion": "Empresa de desarrollo",
                "email": "",
                "longitude": null
            },
            "staff_tipo": {
                "descripcion": "Admin",
                "estado": 1,
                "key_usuario": "8d086bcf-df5e-4f5d-b5fa-fe45b0b2b87d",
                "color": null,
                "fecha_on": "2024-10-29T23:34:39.000009",
                "key": "0302e259-477b-4873-af37-35d9dfe0a2c3",
                "observacion": null
            },
            "_type": "boss"

        }
    }
    render() {


        return <SPage>
            <SHr h={16} />
            <Container>

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
                <MensajeEstado data={this.state.data} />
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

                    <CuadradoInfo height={50} label={"Personas en el evento"}
                        onPress={() => SNavigation.navigate("/boss")}
                        color={STheme.color.lightGray}
                    />


                </SView><SHr height={16} />
                <SView row col={"xs-12"} >
                    <CuadradoInfo label={"Numero de personas sin clock in"}
                        onPress={() => SNavigation.navigate("/boss")}
                        color={STheme.color.danger}
                    />
                    <SView style={{
                        width: 16
                    }} />
                    <CuadradoInfo label={"Numero de personas trabajando"} color={STheme.color.warning}
                        onPress={() => SNavigation.navigate("/boss")} />
                    <SView style={{
                        width: 16
                    }} />
                    <CuadradoInfo label={"Numero de personas que trabajaron"} color={STheme.color.success}
                        onPress={() => SNavigation.navigate("/boss")} />
                </SView>
                <SHr h={12} />
                {/* <SText onPress={() => SNavigation.navigate("/boss")}>{"GO TO BOSS"}</SText> */}
                <MarcarPorCodigoEvento
                    dataJefe={"this.state.data"}
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

const CuadradoInfo = ({ onPress, height, color, label }) => {
    return <SView onPress={onPress} style={{

        flex: 1,
        height: height ?? 90,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: color,
        overflow: 'hidden',
        backgroundColor: color + "55",

    }} center>
        <SText center fontSize={22} bold>{"10"}</SText>
        <SText center>{label}</SText>

    </SView>
}
const MensajeEstado = ({ data }) => {
    const fecha_inicio = new SDate(data.staff.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD");
    const fecha_fin = new SDate(data.staff.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD");
    const curdate = new SDate();

    if (curdate.getTime() < fecha_inicio.getTime()) {
        return <SText>Estado futuro</SText>
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
