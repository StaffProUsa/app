import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SNavigation, SText, SView } from 'servisofts-component';
import * as SPDF from 'servisofts-rn-spdf'

const cols = [
    { key: "index", label: "#", width: 30, },
    { key: "fecha", label: "DATE", width: 65 },
    { key: "usuario", label: "NAME", width: 170 },
    { key: "key_cliente", label: "LOCATION", width: 90 },
    // { key: "employee_number", label: "EMPLOYEE N°", width: 170 },
    { key: "arrived", label: "ARRIVED", width: 70 },
    { key: "staff", label: "POSITION", width: 100 },
    { key: "inicio", label: "TIME IN", width: 60 },
    { key: "fin", label: "TIME OUT", width: 60 },
    { key: "horas", label: "TTL HOURS", width: 65 },

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

                    case 4:
                        dato = (obj["inicio"] != "") ? "YES" : "NO";
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
                // if (i == 0) {
                //     return <SPDF.View key={i} style={{
                //         width: col.width, height: HEIGHT, alignItems: "center", justifyContent: "center",
                //         borderLeftWidth: i == 0 ? 0 : 1,
                //         borderColor: BorderColor,
                //     }}>
                //         <SPDF.Text style={{
                //             fontSize: fontSize,
                //             font: "Roboto",
                //             height: HEIGHT + 3,
                //         }}>{index ?? " "}</SPDF.Text>
                //     </SPDF.View>
                // }
                // if (i == 1) {
                //     let fecha = new Date(dato);

                //     let dia = String(fecha.getUTCDate()).padStart(2, '0');
                //     let mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // los meses van de 0 a 11
                //     let anio = fecha.getUTCFullYear();
                //     let fechaFormateada = `${dia}-${mes}-${anio}`;
                //     return <SPDF.View key={i} style={{
                //         width: col.width, height: HEIGHT, alignItems: "center", justifyContent: "center",
                //         borderLeftWidth: i == 0 ? 0 : 1,
                //         borderColor: BorderColor,
                //     }}>
                //         <SPDF.Text style={{
                //             fontSize: fontSize,
                //             font: "Roboto",
                //             height: HEIGHT + 3,
                //         }}>{fechaFormateada ?? " "}</SPDF.Text>
                //     </SPDF.View>
                // }else if (i == 0) {
                //     return <SPDF.View key={i} style={{
                //         width: col.width, height: HEIGHT, alignItems: "center", justifyContent: "center",
                //         borderLeftWidth: i == 0 ? 0 : 1,
                //         borderColor: BorderColor,
                //     }}>
                //         <SPDF.Text style={{
                //             fontSize: fontSize,
                //             font: "Roboto",
                //             height: HEIGHT + 3,
                //         }}>{index ?? " "}</SPDF.Text>
                //     </SPDF.View>
                // }



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
        let key_company_ = SNavigation.getParam("key_company")
        let key_cliente_ = SNavigation.getParam("key_cliente")
        let key_evento_ = SNavigation.getParam("key_evento")
        let titulo = data[0].key_company + " (" + data[0].key_evento + ")";
        if (key_company_ && key_cliente_ && key_evento_) {
            titulo = data[0].key_company + " (" + data[0].key_cliente + " / " + data[0].key_evento + ")";
        } else if (key_company_ && key_cliente_) {
            titulo = data[0].key_company + " (" + data[0].key_cliente + ")";
        } else {
            titulo = data[0].key_company;
        }
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
                    <SPDF.Text style={{ fontWeight: "bold", fontSize: 18, font: "Roboto" }}>{titulo}</SPDF.Text>
                </SPDF.View>
                <SPDF.View style={{ width: "100%", height: 32 }}></SPDF.View>

                {this.renderHeader()}
            </ SPDF.View>}

            footer={<SPDF.View style={{
                width: "100%",
                alignItems: "end"
            }}>
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
