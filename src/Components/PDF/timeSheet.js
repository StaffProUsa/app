import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SNavigation, SText, SView } from 'servisofts-component';
import * as SPDF from 'servisofts-rn-spdf'

const cols = [
    { key: "index", label: "#", width: 25, },
    { key: "fecha", label: "DATE", width: 65 },
    { key: "usuario", label: "NAME", width: 160 },
    { key: "location", label: "LOCATION", width: 150 },
    // { key: "employee_number", label: "EMPLOYEE N°", width: 170 },
    // { key: "arrived", label: "ARRIVED", width: 70 },
    { key: "staff", label: "POSITION", width: 80 },
    { key: "in", label: "TIME IN", width: 60 },
    { key: "inicio", label: "CLOCK IN", width: 60 },
    { key: "fin", label: "CLOCK OUT", width: 60 },
    { key: "horas", label: "HOURS", width: 55 },

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
        console.log("obj", obj);
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
                        let dia = String(fecha.getUTCDate()).padStart(2, '0');
                        let mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // los meses van de 0 a 11
                        let anio = fecha.getUTCFullYear();
                        dato = `${mes}-${dia}-${anio}`;
                        break;

                    // case 4:
                    //     dato = (obj["inicio"] != "") ? "YES" : "NO";
                    //     break;
                    case 5:
                        let horaFormateadaIn = new Date(obj["in"]).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        });
                        dato = (obj["in"] != "") ? horaFormateadaIn : " ";
                        break;

                    case 6:
                        let horaFormateada = new Date(obj["inicio"]).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        });
                        dato = (obj["inicio"] != "") ? horaFormateada : " ";
                        break;
                    case 7:
                        let horaFormateadaFin = new Date(obj["fin"]).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        });
                        dato = (obj["fin"] != "") ? horaFormateadaFin : " ";
                        break;
                    case 8:
                        dato = obj["horas"].toFixed(2);
                        break;

                    default:
                        dato = obj[col.key];
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


    static handlePress = (data, fecha_inicio, fecha_fin) => {


        // let fecha_inicio_ = fecha_inicio ? new SDate(fecha_inicio + "T00:00:00").toString("MM/dd/yyyy") : "---";
        // let fecha_fin_ = fecha_fin ? new SDate(fecha_fin + "T23:59:59").toString("MM/dd/yyyy") : "---";

        let fechaI = new Date(data[0]["fecha"]);
        let dia = String(fechaI.getUTCDate()).padStart(2, '0');
        let mes = String(fechaI.getUTCMonth() + 1).padStart(2, '0'); // los meses van de 0 a 11
        let anio = fechaI.getUTCFullYear();
        let fecha_fin_ = `${mes}-${dia}-${anio}`

        let acount = Object.keys(data).length;
        let fechaF = new Date(data[acount - 1]["fecha"]);
        let diaF = String(fechaF.getUTCDate()).padStart(2, '0');
        let mesF = String(fechaF.getUTCMonth() + 1).padStart(2, '0'); // los meses van de 0 a 11
        let anioF = fechaF.getUTCFullYear();
        let fecha_inicio_ = `${mesF}-${diaF}-${anioF}`


        //CALCULAR TOTAL DE HORAS
        const total = data.reduce((acc: number, e: any) => {
            return acc + (e.horas ?? 0);
        }, 0);


        let nombreCliente = null;

        let key_company_ = SNavigation.getParam("key_company")
        let key_cliente_ = SNavigation.getParam("key_cliente")
        let key_evento_ = SNavigation.getParam("key_evento")
        let titulo = data[0]?.key_company + " (" + data[0]?.key_evento + ")";
        if (key_company_ && key_cliente_ && key_evento_) {
            titulo = data[0]?.key_company + " (" + data[0]?.key_cliente + " / " + data[0]?.key_evento + ")";
        } else if (key_company_ && key_cliente_) {
            titulo = data[0]?.key_company + " (" + data[0]?.key_cliente + ")";
        } else {
            titulo = data[0]?.key_company;
            //AGRUPO POR CLIENTE, CUANDO HAY VARIOS NOMBRES DE CLIENTES
            const agrupado = data.reduce((acc, item) => {
                if (!acc[item.key_cliente]) {
                    acc[item.key_cliente] = [];
                }
                acc[item.key_cliente].push(item);
                return acc;
            }, {});

            nombreCliente = Object.keys(agrupado).join(', ');
        }
        SPDF.create(<SPDF.Page style={{ width: 791, height: 612, margin: 20, padding: 20, }}

            // header={<SPDF.View style={{
            //     width: "100%",
            // }}>
            //     <SPDF.View style={{ width: "100%", height: 32 }}></SPDF.View>
            //     <SPDF.View style={{
            //         width: "100%",
            //         alignItems: "center"
            //     }}>
            //         <SPDF.Text style={{ fontWeight: "bold", fontSize: 18, font: "Roboto" }}>{titulo}</SPDF.Text>
            //     </SPDF.View>
            //     {nombreCliente && <SPDF.View style={{
            //         width: "100%",
            //         alignItems: "justify"
            //     }}>
            //         <SPDF.View style={{ width: "100%", height: 15 }}></SPDF.View>
            //         <SPDF.Text style={{ width: "100%", fontSize: 12, font: "Roboto" }}>Client: {nombreCliente}</SPDF.Text>
            //     </SPDF.View>
            //     }
            //     <SPDF.View style={{ width: "100%", height: 15 }}></SPDF.View>
            //     <SPDF.View style={{
            //         width: "100%",
            //         alignItems: "justify",
            //         flexDirection: "row"
            //     }}>

            //         <SPDF.Text style={{ fontSize: 12, font: "Roboto" }}>
            //             {`Date from: ${fecha_inicio_}`}
            //         </SPDF.Text>
            //         <SPDF.View style={{ width: 100 }}></SPDF.View>
            //         <SPDF.Text style={{ fontSize: 12, font: "Roboto" }}>
            //             {`Date to: ${fecha_fin_}`}
            //         </SPDF.Text>
            //     </SPDF.View>
            //     <SPDF.View style={{ width: "100%", height: 32 }}></SPDF.View>

            //     {this.renderHeader()}
            // </ SPDF.View>}

            footer={<SPDF.View style={{
                width: "100%",
                alignItems: "end"
            }}>
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

            {/* HEADER */}
            <SPDF.View style={{
                width: "100%",
                // borderColor: BorderColor
            }}>
                <SPDF.View style={{ width: "100%", height: 32 }}></SPDF.View>
                <SPDF.View style={{
                    width: "100%",
                    alignItems: "center"
                }}>
                    <SPDF.Text style={{ fontWeight: "bold", fontSize: 18, font: "Roboto" }}>{titulo}</SPDF.Text>
                </SPDF.View>
                {nombreCliente && <SPDF.View style={{
                    width: "100%",
                    alignItems: "justify"
                }}>
                    <SPDF.View style={{ width: "100%", height: 15 }}></SPDF.View>
                    <SPDF.Text style={{ width: "100%", fontSize: 12, font: "Roboto" }}>Client: {nombreCliente}</SPDF.Text>
                </SPDF.View>
                }
                <SPDF.View style={{ width: "100%", height: 15 }}></SPDF.View>
                <SPDF.View style={{
                    width: "100%",
                    alignItems: "justify",
                    flexDirection: "row"
                }}>
                    <SPDF.Text style={{ fontSize: 12, font: "Roboto" }}>
                        {`Date from: ${fecha_inicio_}`}
                    </SPDF.Text>
                    <SPDF.View style={{ width: 100 }}></SPDF.View>
                    <SPDF.Text style={{ fontSize: 12, font: "Roboto" }}>
                        {`Date to: ${fecha_fin_}`}
                    </SPDF.Text>
                </SPDF.View>
                <SPDF.View style={{ width: "100%", height: 32 }}></SPDF.View>

                {this.renderHeader()}
            </ SPDF.View>
            {/* FIN HEADER */}
            {data.map((item, index) => {
                console.log("item", item);
                return this.renderItem(index + 1, item)
            })}
            {/* FOOTER */}
            <SPDF.View style={{ width: "100%", height: 15 }}></SPDF.View>
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
                <SPDF.Text style={{ fontSize: 12, color: "#000", font: "Roboto", textAlign: "right" }}>
                    {"Total Hours: "}
                </SPDF.Text>
                <SPDF.Text style={{ fontWeight: "bold", fontSize: 12, color: "#000", font: "Roboto" }}>
                    {total.toFixed(2)} hrs
                </SPDF.Text>
            </SPDF.View>
            <SPDF.View style={{ width: "100%", height: 10 }}></SPDF.View>
            {/* FIN FOOTER */}
        </SPDF.Page >)
    }


}
