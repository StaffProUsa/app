import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SText, SView } from 'servisofts-component';
import * as SPDF from 'servisofts-rn-spdf'

const cols = [
    { key: "index", label: "#", width: 30, },
    { key: "fecha", label: "DATE", width: 65 },
    { key: "name", label: "NAME", width: 170 },
    { key: "arrived", label: "ARRIVED", width: 70 },
    { key: "postion", label: "POSITION", width: 100 },
    { key: "time_in", label: "TIME IN", width: 60 },
    { key: "time_out", label: "TIME OUT", width: 60 },
    { key: "tt_hours", label: "TTL HOURS", width: 65 },
    { key: "location", label: "LOCATION", width: 90 },
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


        return <SPDF.View style={{ width: "100%", flexDirection: "row", borderWidth: 1, borderColor: BorderColor }}>
            {cols.map((col, i) => {
                let dato = obj[col.key];
                if (i == 1) {
                    let fecha = new Date(dato);

                    let dia = String(fecha.getUTCDate()).padStart(2, '0');
                    let mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // los meses van de 0 a 11
                    let anio = fecha.getUTCFullYear();
                    let fechaFormateada = `${dia}-${mes}-${anio}`;
                    return <SPDF.View key={i} style={{
                        width: col.width, height: HEIGHT, alignItems: "center", justifyContent: "center",
                        borderLeftWidth: i == 0 ? 0 : 1,
                        borderColor: BorderColor,
                    }}>
                        <SPDF.Text style={{
                            fontSize: fontSize,
                            font: "Roboto",
                            height: HEIGHT + 3,
                        }}>{fechaFormateada ?? " "}</SPDF.Text>
                    </SPDF.View>
                } else {


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
                }
            })}
        </SPDF.View>
    }
    static handlePress = (data) => {
        SPDF.create(<SPDF.Page style={{ width: 791, height: 612, margin: 20, padding: 20, }}
            header={<SPDF.View style={{
                width: "100%",
                // borderColor: BorderColor
            }}>
                <SPDF.View style={{
                    position: "absolute",
                    width: 65,
                    height: 65,
                    right: 1,
                    borderWidth: 1,

                }}>
                </SPDF.View>
                <SPDF.View style={{ width: "100%", height: 32 }}></SPDF.View>
                <SPDF.View style={{
                    width: "100%",
                    alignItems: "center"
                }}>
                    <SPDF.Text style={{ fontWeight: "bold", fontSize: 18, font: "Roboto" }}>{"RH STAFFING SIGN SHEET (Eurest Catering)"}</SPDF.Text>
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
                return this.renderItem(index + 1, item)
            })}
            {/* </SPDF.View> */}
        </SPDF.Page >)
    }


}
