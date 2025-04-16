import React from "react";
import { SDate, SHr, SIcon, SImage, SLoad, SMapView, SNavigation, SPage, SText, STheme, SView } from "servisofts-component";
import { Container } from "../Components";
import SSocket from "servisofts-socket";
import { component } from "../Services/Usuario/Components/datoCabecera";
import Mapa from "./Evento/Components/Mapa";
import MarcarPorCodigoEvento from "../Components/Asistencia/MarcarPorCodigoEvento";
import CardEventoSteps from "../Components/Evento/CardEventoSteps";

export default class cd extends React.Component {

    key_staff_usuario = SNavigation.getParam("key_staff_usuario")
    state = {

    }

    componentDidMount() {
        console.log("CD", "entro al componentDidMount")
        SSocket.sendPromise({
            component: "staff_usuario",
            type: "getEventoPerfil",
            key: this.key_staff_usuario,

        }).then(e => {
            this.setState({ data: e.data })
        })
    }


    render() {

        const fontz = 16


        console.log("PINTO DATA", this.state.data)
        return <SPage >
            <SHr h={24} />
            <Container loading={!this?.state?.data}>

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

            </Container>
            <SHr h={16} />
            <SView style={{
                backgroundColor: STheme.color.secondary,
                height: 55,
            }}>
                <Container flex center>
                    <SText bold color={STheme.color.white} style={{
                        fontSize: fontz * 1.5,

                    }}
                        language={{
                            es: "Bienvenido a un nuevo evento",
                            en: "Welcome to a new event",

                        }}
                    />
                </Container>
            </SView>
            <SHr h={30} />
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
                        <CardEventoSteps data={{
                            staff_usuario: this.state?.data
                        }}/>
                        
                        <SView flex />
                        <ItemImage src={SSocket.api.root + "company/" + this.state.data?.company.key} label={this.state.data?.company.descripcion} />
                        <ItemImage src={SSocket.api.root + "cliente/" + this.state.data?.cliente.key} label={this.state.data?.cliente.descripcion} />
                        <ItemImage src={SSocket.api.root + "staff_tipo/" + this.state.data?.staff_tipo.key} label={this.state.data?.staff_tipo.descripcion} />
                    </SView>
                    <SHr h={16} />

                    <SHr />
                    {/* <SText fontSize={fontz} color={STheme.color.lightGray} >{
                        new SDate(this.state?.data?.evento?.fecha, "yyyy-MM-dd").toString("dd de MONTH del yyyy")
                        + " desde las "}
                        <SText fontSize={fontz}>{new SDate(this.state?.data?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                        {" hasta las "}
                        <SText fontSize={fontz}>{new SDate(this.state?.data?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                    </SText> */}
                    <SText fontSize={fontz} color={STheme.color.lightGray} >{this.state?.data?.evento?.observacion}</SText>

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

                    </SView>
                    {/* <SHr color={STheme.color.card} h={1} /> */}
                </SView>
                <SHr h={30} />
                <SView row col="xs-12" style={{
                    borderBottomWidth: 1,
                    borderColor: STheme.color.card,
                    paddingBottom: 4
                }}>
                    <SText fontSize={fontz * 1.2} col={"xs-12"} bold language={{
                        es: "Requerimientos",
                        en: "Requirements",
                    }}></SText>
                </SView>
                <SHr />
                <SHr />
                <SView row col="xs-12" >
                    <SText fontSize={fontz} col={"xs-6"} language={{
                        es: "Nivel de ingles",
                        en: "Level of english",
                    }}></SText>
                    <SText fontSize={fontz} col={"xs-6"}  >{this.state?.data?.staff?.nivel_ingles}</SText>
                </SView>
                <SHr h={20} />
                <SView row col="xs-12">
                    <SText fontSize={fontz} col={"xs-6"} language={{
                        es: "Dirección",
                        en: "Address",

                    }}></SText>
                    <SText fontSize={fontz * .95} col={"xs-6"}  >{this.state?.data?.cliente.direccion}</SText>
                </SView>
                <SHr h={40} />

                {/* <SHr h={15} />
                <SView row col="xs-12">
                    <SView col="xs-6" style={{


                    }}>
                        <SText >Evento:</SText>
                        <SHr h={16} />
                        <SText>*Ubicacion:</SText>
                        <SHr h={16} />
                        <SText>*Fecha: </SText>
                        <SHr h={16} />
                        <SText>*Hora de inicio:</SText>
                        <SHr h={16} />
                        <SText>*Hora fin:</SText>
                    </SView>
                    <SView col="xs-6" >
                        <SText>Otro</SText>
                        <SHr h={16} />
                        <SText>Parque Arenal</SText>
                        <SHr h={16} />
                        <SText>10/04/2025</SText>
                        <SHr h={16} />
                        <SText>{new SDate(this.state?.data?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                        <SHr h={16} />
                        <SText>{new SDate(this.state?.data?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                    </SView>
                </SView> */}
                {/* <SHr h={50} /> */}
                <MarcarPorCodigoEvento
                    key_evento={this.state?.data?.evento?.key}
                    // dataJefe={this.state?.dataJefe}
                />
                <SHr color={STheme.color.card} h={1} />
                <SHr h={15} />
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

                {/* <SView row col={"xs-12"}>
                    <SView col={"xs-6"}>
                        <SText center border borderRadius={8} style={{
                            fontSize: 20,
                            width: "90%",
                            margin: 5,
                            padding: 2,
                            borderColor: STheme.color.white,
                            backgroundColor: STheme.color.darkGray,

                        }} onPress={Function} numberOfLines={1}> NO, GRACIAS</SText>
                    </SView>

                    <SView col={"xs-6"}>

                        <SText center border borderRadius={8} style={{
                            fontSize: 20,
                            width: "90%",
                            margin: 5,
                            padding: 2,
                            borderColor: STheme.color.white,
                            backgroundColor: STheme.color.secondary,
                        }} onPress={Function} numberOfLines={1}>ACEPTAR</SText>
                    </SView>


                </SView> */}


            </Container>
            <SHr h={30} />
            {/* <SText center color={STheme.color.danger} style={{
                fontSize: fontz
            }} language={{
                es: "ESTA MAL EL BOTON DEL CODIGO DE STAFF, PENDIENTE RICKY",
                en: "THE STAFF CODE BUTTON IS WRONG, PENDING RICKY",

            }}></SText> */}


            {/* <SHr h={100} /> */}

        </SPage >
    }
}






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