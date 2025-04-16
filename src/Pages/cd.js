import React from "react";
import { SDate, SHr, SImage, SLoad, SMapView, SNavigation, SPage, SText, STheme, SView } from "servisofts-component";
import { Container } from "../Components";
import SSocket from "servisofts-socket";
import { component } from "../Services/Usuario/Components/datoCabecera";
import Mapa from "./Evento/Components/Mapa";
import MarcarPorCodigoEvento from "../Components/Asistencia/MarcarPorCodigoEvento";

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


        return <SPage >
            <SHr h={24} />
            <Container loading={!this?.state?.data}>
                <SView style={{
                    width: "100%",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center"
                }} >
                    <SText style={{
                        flex: 1,
                        fontSize: 18,
                        textAlign: "left"

                    }}>{this.state?.data?.evento?.descripcion}</SText>
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
                    <SText style={{
                        fontSize: 25,

                    }
                    }> Bienvenido a un nuevo evento</SText>
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
                        <SText col={"xs-12"} bold>{"Detalle del evento"}</SText>
                    </SView>
                    <SHr h={16} />
                    <SText fontSize={14} color={STheme.color.lightGray} >{this.state?.data?.evento?.observacion}</SText>
                    <SText fontSize={14} color={STheme.color.lightGray} >{
                        new SDate(this.state?.data?.evento?.fecha, "yyyy-MM-dd").toString("dd de MONTH del yyyy")
                        + " desde las "}
                        <SText fontSize={14}>{new SDate(this.state?.data?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                        {" hasta las "}
                        <SText fontSize={14}>{new SDate(this.state?.data?.staff?.fecha_fin, "yyyy-MM-ddThh:mm:ssTZD").toString("HH")}</SText>
                    </SText>
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
                            <SText numberOfLines={1}>{this.state?.data?.staff_tipo?.descripcion}</SText>
                            <SText fontSize={14} color={STheme.color.lightGray} >{this.state?.data?.staff?.descripcion}</SText>
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
                    <SText col={"xs-12"} bold>{"Requerimientos"}</SText>
                </SView>
                <SHr />
                <SHr />
                <SView row col="xs-12" >
                    <SText col={"xs-6"} >Nivel de ingles:</SText>
                    <SText col={"xs-6"} bold >{this.state?.data?.staff?.nivel_ingles}</SText>
                </SView>
                {/* <SView row col="xs-12">
                    <SText col={"xs-6"}>*Autorizacion para trabajar en USA:</SText>
                    <SText col={"xs-6"}>{this.state?.data?.staff?.nivel_ingles}</SText>
                </SView> */}
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
                <MarcarPorCodigoEvento key_evento={this.key} dataJefe={this.state?.dataJefe} dataTrabajo={this.state?.dataTrabajo} />
                <SHr h={16}/>
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
            <SHr h={30}/>
            <SText center color={STheme.color.danger} style={{
                fontSize: 30,
            }}>ESTA MAL PENDIENTE RICKY</SText>


            <SHr h={100} />

        </SPage >
    }
}