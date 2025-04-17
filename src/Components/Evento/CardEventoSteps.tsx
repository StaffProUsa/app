import React, { Component } from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { SDate, SIcon, SLanguage, SText, STheme, SView } from 'servisofts-component';
import { ObjectStaffUsuario } from '../../MDL/Evento/type';


export default class CardEventoSteps extends Component<{ data: ObjectStaffUsuario, colorPrimary?: any, colorSecondary?: any }> {


    colors = {

        primary: this.props.colorPrimary ?? "#fff",
        secondary: this.props.colorSecondary ?? "#E84148",
        card: STheme.color.lightGray,
    }



    renderBall(props: {
        label: { en: string, es: string },
        status?: "complete" | "select" | "pending",
        position: "start" | "center" | "end"
    }) {
        let containerChild: any = null;
        let containerStyle: TextStyle = {
            width: 6,
            height: 6,
            justifyContent: "flex-end"
        }
        let textStyle: TextStyle = {
            fontWeight: "bold",
            fontSize: 8,
            color: this.colors.primary,
            width: 100,
            position: "absolute",
            maxWidth: 70,
            top: 24,
        }
        switch (props.status) {
            case "complete":
                containerStyle.width = 18;
                containerStyle.height = 18;
                containerStyle.backgroundColor = this.colors.secondary;
                textStyle.color = this.colors.secondary;

                containerChild = <SIcon name={'Bien' as any} width={18} height={18} fill={this.colors.primary} />
                break;
            case "select":
                containerStyle.width = 18;
                containerStyle.height = 18;
                textStyle.color = this.colors.secondary;
                containerStyle.backgroundColor = "transparent";
                containerStyle.borderWidth = 1;
                containerStyle.borderColor = this.colors.secondary;
                containerChild = <SView style={{
                    width: 6,
                    height: 6,
                    borderRadius: 100,
                    backgroundColor: this.colors.card
                }} />
                break
            default:
                textStyle.color = this.colors.card;
                containerStyle.backgroundColor = this.colors.card;
                break;
        }

        switch (props.position) {
            case "start":
                containerStyle.alignItems = "flex-start";
                textStyle.textAlign = "left";
                break;
            case "center":
                containerStyle.alignItems = "center";
                textStyle.textAlign = "center";
                break
            case "end":
                containerStyle.alignItems = "flex-end";
                textStyle.textAlign = "right";
                break
        }


        return <SView style={{
            width: containerStyle.width,
            alignItems: containerStyle.alignItems,
            justifyContent: "center",
            height: 20
        }} >
            <SView style={{
                ...containerStyle,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 100,
                backgroundColor: containerStyle.backgroundColor
            }} >
                {containerChild}
            </SView>
            <SText clean style={textStyle} language={props.label} />
        </SView>
    }
    renderLine(props: { status?: "complete" | "select" | "pending" }) {

        const containerStyle: ViewStyle = {
            flex: 1,
            height: 1,
            backgroundColor: this.colors.primary,
            // marginRight: 8,
            // marginLeft: 8,
        }

        switch (props.status) {
            case "complete":
                containerStyle.height = 3;
                containerStyle.backgroundColor = this.colors.secondary;
                break;
            case "select":
                containerStyle.height = 3;
                containerStyle.backgroundColor = this.colors.secondary;
                break
            default:
                containerStyle.backgroundColor = this.colors.card;
                break;
        }

        return <SView style={containerStyle} />
    }

    render() {

        let step = ""

        const { data } = this.props;
        let ns = 1;

        if (!!data?.staff_usuario?.fecha_aprobacion_invitacion) {
            ns = 2
            console.log(data)
            const fi = new SDate(data?.staff?.fecha_inicio, "yyyy-MM-ddThh:mm:ssTZD");
            console.log("fi", fi);
            if (fi.getTime() < new SDate().getTime()) {
                ns = 3;
            }
            if (data.staff_usuario.fecha_ingreso) {
                ns = 4;
            }
            if (data.staff_usuario.fecha_salida) {
                ns = 5;
            }
        }



        return <SView col={"xs-12"} center>
            <SView col={"xs-12"} row center height={20}>
                {this.renderBall({
                    label: { en: "Accepted", es: "Aceptado" },
                    position: "start",
                    status: ns == 1 ? "select" : "complete",

                })}
                {this.renderLine({ status: ns == 2 ? "select" : ns > 2 ? "complete" : "pending" })}
                {this.renderBall({
                    label: { en: "Event Start", es: "Inicio Evento" },
                    position: "center",
                    status: ns == 2 ? "select" : ns > 2 ? "complete" : "pending",
                })}
                {this.renderLine({ status: ns == 3 ? "select" : ns > 3 ? "complete" : "pending" })}
                {this.renderBall({
                    label: { en: "Clock-in", es: "Ingreso" },
                    position: "center",
                    status: ns == 3 ? "select" : ns > 3 ? "complete" : "pending",
                })}
                {this.renderLine({ status: ns == 4 ? "select" : ns > 4 ? "complete" : "pending" })}
                {this.renderBall({
                    label: { en: "Clock-out", es: "Salida" },
                    position: "end",
                    status: ns == 4 ? "select" : ns > 4 ? "complete" : "pending",
                })}

                {/* <View style={[this.styles.line, this.styles.lineSelect]} />
                <SView style={[this.styles.ball, { alignItems: 'center' }]} >
                    <Text style={[this.styles.text, { textAlign: "center", fontWeight: "bold" }]}>{"Inicio Evento"}</Text>
                </SView>
                <View style={this.styles.line} />
                <SView style={[this.styles.ball, { alignItems: 'center' }]} >
                    <Text style={[this.styles.text, { textAlign: "center" }]}>{"Ingreso"}</Text>
                </SView>
                <View style={this.styles.line} />
                <SView style={[this.styles.ball, { alignItems: "flex-end" }]} >
                    <Text style={[this.styles.text, { textAlign: "right" }]}>{"Salida"}</Text>
                </SView> */}
            </SView>
        </SView>
    }
}
