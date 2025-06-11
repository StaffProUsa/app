import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SText, SView } from 'servisofts-component';
import * as SPDF from 'servisofts-rn-spdf'

const cols = [
    { key: "index", label: "#", width: 30, },
    { key: "fecha", label: "DATE", width: 55 },
    { key: "key_company", label: "COMPANY", width: 130 },
    { key: "key_cliente", label: "CLIENT", width: 90 },
    { key: "staff", label: "POSITION", width: 90 },
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
                    case 0:
                        dato = index;
                        break;
                    case 1:
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

                    case 5:
                        let horaFormateada = new Date(obj["inicio"]).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        });
                        dato = (obj["inicio"] != "") ? horaFormateada : " ";
                        break;
                    case 6:
                        let horaFormateadaFin = new Date(obj["fin"]).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        });
                        dato = (obj["fin"] != "") ? horaFormateadaFin : " ";
                        break;
                    case 7:
                        dato = obj["horas"].toFixed(2);
                        break;
                    case 8:
                        dato = obj["salario_hora"].toFixed(2);
                        break;

                    case 9:
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
                    alignItems: "center"
                }}>
                    <SPDF.Text style={{ fontWeight: "bold", fontSize: 18, font: "Roboto" }}>{"REPORTE ASISTENCIA"} - {data[0].usuario}</SPDF.Text>
                </SPDF.View>
                <SPDF.View style={{ width: "100%", height: 32 }}></SPDF.View>

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
                        <SPDF.Text style={{  fontSize: 12, color: "#000", font: "Roboto", textAlign: "right" }}>
                            {"Hours worked: "}
                        </SPDF.Text>
                        <SPDF.Text style={{fontWeight: "bold", fontSize: 12, color: "#000", font: "Roboto" }}>
                            {total.toFixed(2)} hrs
                        </SPDF.Text>
                    {/* </SPDF.View> */}

                    {/* <SPDF.View style={{ flexDirection: "row", justifyContent: "space-between" }}> */}
                        <SPDF.Text style={{  fontSize: 12, color: "#000", font: "Roboto" }}>
                            {"Total to be paid: "}
                        </SPDF.Text>
                        <SPDF.Text style={{ fontWeight: "bold",fontSize: 12, color: "#28a745", fontWeight: "bold", font: "Roboto" }}>
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
