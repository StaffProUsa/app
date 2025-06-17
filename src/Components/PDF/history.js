import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SNavBar, SNavigation, SText, SView } from 'servisofts-component';
import * as SPDF from 'servisofts-rn-spdf'

const cols = [
    // { key: "index", label: "#", width: 30, },
    { key: "fecha", label: "DATE", width: 70 },
    // { key: "key_company", label: "COMPANY", width: 130 },
    { key: "key_cliente", label: "CLIENT", width: 210 },
    { key: "staff", label: "POSITION", width: 120 },
    { key: "inicio", label: "TIME IN", width: 60 },
    { key: "fin", label: "TIME OUT", width: 60 },
    { key: "horas", label: "TTL HOURS", width: 65 },
    { key: "salario_hora", label: "SALARY", width: 65 },
    { key: "subtotal", label: "SUBTOTAL", width: 65 },
]

const HEIGHT = 16;
const BorderColor = "#CCCCCC"
const fontSize = 10;
export default class timeSheet {

    static renderHeader = () => {
        return <SPDF.View style={{
            width: "100%", flexDirection: "row",
            borderColor: BorderColor,
            borderWidth: 1,
            // borderBottomWidth: 1,

        }}>
            {cols.map((col, index) => {
                return <SPDF.View key={index} style={{
                    width: col.width, height: HEIGHT,
                    borderLeftWidth: index == 0 ? 0 : 1,
                    borderColor: BorderColor,
                    // borderWidth: 1,
                    // borderColor: BorderColor,
                    // borderRadius: 8,
                    alignItems: "center", justifyContent: "center",
                }}>
                    <SPDF.Text style={{
                        fontSize: fontSize,
                        font: "Roboto",
                        fontWeight: "bold",
                        height: HEIGHT + 3,
                    }}>{col.label}</SPDF.Text>
                </SPDF.View>
            })}
        </SPDF.View>
    }
    static renderItem = (index, obj) => {
        let contador = 0;
        return <SPDF.View style={{ width: "100%", flexDirection: "row", borderWidth: 1, borderColor: BorderColor }}>
            {cols.map((col, i) => {
                let dato = obj[col.key];
                contador++;
                switch (i) {
                    // case 0:
                    //     dato = index;
                    //     break;
                    case 0:
                        let fecha = new Date(dato);
                        // let fecha = new Date(dato);
                        let dia = String(fecha.getUTCDate()).padStart(2, '0');
                        let mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // los meses van de 0 a 11
                        let anio = fecha.getUTCFullYear();
                        dato = `${mes}-${dia}-${anio}`;
                        break;

                    // case 4:
                    //     dato = (obj["inicio"] != "") ? "YES" : "NO";
                    //     break;

                    case 3:
                        let horaFormateada = new Date(obj["inicio"]).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        });
                        dato = (obj["inicio"] != "") ? horaFormateada : " ";
                        break;
                    case 4:
                        let horaFormateadaFin = new Date(obj["fin"]).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        });
                        dato = (obj["fin"] != "") ? horaFormateadaFin : " ";
                        break;
                    case 5:
                        dato = obj["horas"].toFixed(2);
                        break;
                    case 6:
                        dato = obj["salario_hora"].toFixed(2);
                        break;

                    case 7:
                        dato = obj["subtotal"].toFixed(2);
                        break;

                    default:
                        dato = obj[col.key];
                        // dato = "";
                        break;
                }




                // let val = col.label;
                return <SPDF.View key={i} style={{
                    width: col.width, height: HEIGHT, alignItems: "center", justifyContent: "center",
                    borderLeftWidth: i == 0 ? 0 : 1,
                    borderColor: BorderColor,
                }}>
                    {/* <SPDF.Text style={{
                        fontSize: fontSize,
                        font: "Roboto",
                        height: HEIGHT + 3,
                    }}>{obj[col.key] ?? " "}</SPDF.Text> */}
                    <SPDF.Text style={{
                        fontSize: fontSize,
                        font: "Roboto",
                        height: HEIGHT + 3,
                    }}>{dato ?? " "}</SPDF.Text>
                </SPDF.View>

            })}
        </SPDF.View>
    }
    static handlePress = (data) => {
        if (!data) return null;
        if (data.length == 0) return null;
        const total = data.reduce((acc: number, e: any) => {
            return acc + (e.horas ?? 0);
        }, 0);
        console.log("total", total);
        const subtotal = data.reduce((acc: number, e: any) => {
            return acc + (e.subtotal ?? 0);
        }, 0);
        console.log("subtotal", subtotal);
        let state = SNavigation.getParam("state");
        if (!state) {
            state = "Total Events";
        } else if (state == "FINISHED") {
            state = "Unattended events";
        } else if (state == "COMPLETED") {
            state = "Completed events";
        }

        // let fecha_inicio = SNavigation.getParam("fecha_inicio");
        // let fecha_fin = SNavigation.getParam("fecha_fin");

        // fecha_inicio ? fecha_inicio = new SDate(fecha_inicio + "T00:00:00").toString("MM/dd/yyyy") : fecha_inicio = "--";
        // fecha_fin ? fecha_fin = new SDate(fecha_fin + "T23:59:59").toString("MM/dd/yyyy") : fecha_fin = "--";

         let fechaI = new Date(data[0]["fecha"]);
        let dia = String(fechaI.getUTCDate()).padStart(2, '0');
        let mes = String(fechaI.getUTCMonth() + 1).padStart(2, '0'); // los meses van de 0 a 11
        let anio = fechaI.getUTCFullYear();
        let fecha_fin = `${mes}-${dia}-${anio}`

        let acount = Object.keys(data).length;
        let fechaF = new Date(data[acount - 1]["fecha"]);
        let diaF = String(fechaF.getUTCDate()).padStart(2, '0');
        let mesF = String(fechaF.getUTCMonth() + 1).padStart(2, '0'); // los meses van de 0 a 11
        let anioF = fechaF.getUTCFullYear();
        let fecha_inicio = `${mesF}-${diaF}-${anioF}`

        let nombreCompany = null;
        //AGRUPO POR COMPANY, CUANDO HAY VARIOS NOMBRES DE COMPANY
        const agrupado = data.reduce((acc, item) => {
            if (!acc[item.key_company]) {
                acc[item.key_company] = [];
            }
            acc[item.key_company].push(item);
            return acc;
        }, {});

        nombreCompany = Object.keys(agrupado).join(', ');



        SPDF.create(<SPDF.Page style={{ width: 791, height: 612, margin: 20, padding: 20, }}
            header={<SPDF.View style={{
                width: "100%",
                // borderColor: BorderColor
            }}>
                {/* <SPDF.View style={{
                    position: "absolute",
                    width: 65,
                    height: 65,
                    right: 1,
                    borderWidth: 1,

                }}>
                </SPDF.View> */}
                <SPDF.View style={{ width: "100%", height: 32 }}></SPDF.View>
                <SPDF.View style={{
                    width: "100%",
                    alignItems: "justify"
                }}>
                    <SPDF.Text style={{ fontSize: 12, font: "Roboto" }}>
                        {`State: ${state}`}
                    </SPDF.Text>
                </SPDF.View>
                <SPDF.View style={{
                    width: "100%",
                    alignItems: "center"
                }}>
                    <SPDF.Text style={{ fontWeight: "bold", fontSize: 18, font: "Roboto" }}>{"ATTENDANCE REPORT"}</SPDF.Text>
                </SPDF.View>

                <SPDF.View style={{ width: "100%", height: 15 }}></SPDF.View>
                <SPDF.Text style={{ width: "100%", fontSize: 12, height: 20, fontWeight: "bold", font: "Roboto" }}>Company: {nombreCompany}</SPDF.Text>

                <SPDF.View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: 10, }}>
                    {/* Columna 1 */}
                    <SPDF.View style={{ width: "33%" }}>
                        <SPDF.Text style={{ fontSize: 10, height: 15, font: "Roboto" }}>Request date: {new SDate().toString("MM/dd/yyyy")}</SPDF.Text>
                        <SPDF.Text style={{ fontSize: 10, height: 15, font: "Roboto" }}>Name: {data[0].usuario}</SPDF.Text>
                        <SPDF.Text style={{ fontSize: 10, height: 15, font: "Roboto" }}>Phone: {data[0].__original?.usuario?.Telefono}</SPDF.Text>
                    </SPDF.View>

                    {/* Columna 2 */}
                    <SPDF.View style={{ width: "33%", alignItems: "justifyContent" }}>
                        <SPDF.Text style={{ fontSize: 10, height: 15, font: "Roboto" }}>Address: {data[0].__original?.usuario?.direccion}</SPDF.Text>
                        <SPDF.Text style={{ fontSize: 10, height: 15, font: "Roboto" }}>Email: {data[0].__original?.usuario?.Correo}</SPDF.Text>
                    </SPDF.View>

                    {/* Columna 3 */}
                    <SPDF.View style={{ width: "33%", alignItems: "flex-end" }}>

                        <SPDF.Text style={{ fontSize: 10, height: 15, font: "Roboto" }}>Date from: {fecha_inicio}</SPDF.Text>
                        <SPDF.Text style={{ fontSize: 10, height: 15, font: "Roboto" }}>Date to: {fecha_fin}</SPDF.Text>
                    </SPDF.View>
                </SPDF.View>
                <SPDF.View style={{ width: "100%", height: 20 }}></SPDF.View>
                {this.renderHeader()}
            </ SPDF.View>}

            footer={<SPDF.View style={{
                width: "100%",
                alignItems: "end"
            }}>


                <SPDF.View
                    style={{
                        borderWidth: 0,
                        borderColor: "#000",
                        borderRadius: 8,
                        padding: 10,
                        minWidth: 170,
                        backgroundColor: "#f5f5f5",
                        width: "100%",
                        alignItems: "end",

                    }}
                >
                    {/* <SPDF.View style={{  marginBottom: 5, }}> */}
                    <SPDF.Text style={{ fontSize: 12, color: "#000", font: "Roboto", textAlign: "right" }}>
                        {"Hours worked: "}
                    </SPDF.Text>
                    <SPDF.Text style={{ fontWeight: "bold", fontSize: 12, color: "#000", font: "Roboto" }}>
                        {total.toFixed(2)} hrs
                    </SPDF.Text>
                    {/* </SPDF.View> */}

                    {/* <SPDF.View style={{ flexDirection: "row", justifyContent: "space-between" }}> */}
                    <SPDF.Text style={{ fontSize: 12, color: "#000", font: "Roboto" }}>
                        {"Total to be paid: "}
                    </SPDF.Text>
                    <SPDF.Text style={{ fontWeight: "bold", fontSize: 12, color: "#28a745", fontWeight: "bold", font: "Roboto" }}>
                        $ {subtotal.toFixed(2)}
                    </SPDF.Text>
                    {/* </SPDF.View> */}
                    {/* </SPDF.View> */}
                </SPDF.View>
                <SPDF.View style={{ width: "100%", height: 10 }}></SPDF.View>
                <SPDF.Text style={{ fontSize: fontSize, }}>{"Page #${current_page}"}</SPDF.Text>
            </SPDF.View>
            }
        >

            {/* <SPDF.View style={{
                width: "100%",
                borderWidth: 1,
                borderColor: BorderColor
            }}> */}

            {data.map((item, index) => {
                console.log("item", item);
                return this.renderItem(index + 1, item)
            })}
            {/* </SPDF.View> */}
        </SPDF.Page >)
    }


}
