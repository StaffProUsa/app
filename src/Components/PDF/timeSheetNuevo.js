import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SNavigation, SText, SView } from 'servisofts-component';
import * as SPDF from 'servisofts-rn-spdf'
import { DinamicTable } from 'servisofts-table';

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



const truncateText = (text, maxWidth) => {
    if (!text || typeof text !== 'string') return text || " ";

    // Aproximadamente 1.2 caracteres por unidad de width para fontSize 10
    const maxChars = Math.floor(maxWidth / (fontSize * 0.50));

    if (text.length <= maxChars) {
        return text;
    }

    return text.substring(0, maxChars - 3) + "...";
};


export default class timeSheetNuevo {




    static renderHeader = (_cols) => {



        return <SPDF.View style={{
            width: "100%", flexDirection: "row",
            borderColor: BorderColor,
            borderWidth: 1,
            // borderBottomWidth: 1,

        }}>
            {_cols.map((col, index) => {
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
                    }}>{truncateText(col.label, col.width)}</SPDF.Text>
                </SPDF.View>
            })}
        </SPDF.View>
    }
    static renderItem = (index, obj, headers) => {
        console.log("obj", obj);
        return <SPDF.View style={{ width: "100%", flexDirection: "row", borderWidth: 1, borderColor: BorderColor }}>
            {headers.map((col, i) => {
                let dato = obj[col.key];

                // Formatear datos según el tipo de columna
                switch (col.key) {
                    case "index":
                        dato = index;
                        break;
                    case "fecha":
                        if (dato) {
                            let fecha = new Date(dato);
                            let dia = String(fecha.getUTCDate()).padStart(2, '0');
                            let mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // los meses van de 0 a 11
                            let anio = fecha.getUTCFullYear();
                            dato = `${mes}-${dia}-${anio}`;
                        }
                        break;
                    case "in":
                        if (obj["in"] && obj["in"] != "") {
                            let horaFormateadaIn = new Date(obj["in"]).toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            });
                            dato = horaFormateadaIn;
                        } else {
                            dato = " ";
                        }
                        break;
                    case "inicio":
                        if (obj["inicio"] && obj["inicio"] != "") {
                            let horaFormateada = new Date(obj["inicio"]).toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            });
                            dato = horaFormateada;
                        } else {
                            dato = " ";
                        }
                        break;
                    case "fin":
                        if (obj["fin"] && obj["fin"] != "") {
                            let horaFormateadaFin = new Date(obj["fin"]).toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            });
                            dato = horaFormateadaFin;
                        } else {
                            dato = " ";
                        }
                        break;
                    case "horas":
                        if (obj["horas"] !== undefined && obj["horas"] !== null) {
                            dato = obj["horas"].toFixed(2);
                        }
                        break;
                    default:
                        dato = obj[col.key];
                        break;
                }
                console.log(`col.key: ${col.key}, dato: ${dato}`);

                // Remove emoji characters from dato
                if (typeof dato === 'string') {
                    dato = dato.replace(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g, '');
                }

                // Truncar texto si supera el ancho de la columna

                const textoTruncado = truncateText(String(dato), col.width);

                return <SPDF.View key={i} style={{
                    width: col.width, height: HEIGHT, alignItems: "center", justifyContent: "center",
                    borderLeftWidth: i == 0 ? 0 : 1,
                    borderColor: BorderColor,
                }}>
                    <SPDF.Text style={{
                        // width: col.width,
                        fontSize: fontSize - 1,
                        font: "Roboto",
                        height: HEIGHT + 3,
                    }}>{textoTruncado}</SPDF.Text>
                </SPDF.View>

            })}
        </SPDF.View>
    }


    static handlePress = (data, fecha_inicio, fecha_fin, dinamicTable: DinamicTable<any>) => {


        console.log("headers", dinamicTable.cols, dinamicTable.colData)

        const headers = dinamicTable.cols.map((col) => {
            const data = dinamicTable.colData[col.key];
            const colf = {
                key: col.key,
                ...col.props,
                ...data
            }
            return colf;
        }).filter(col => !col.hidden);

        const maxwidth = 711;
        const totalWidth = headers.reduce((acc, col) => acc + col.width, 0);
        console.log("totalWidth", totalWidth, "maxwidth", maxwidth);
        if (totalWidth > maxwidth) {
            const scale = maxwidth / totalWidth;
            headers.forEach(col => {
                col.width = Math.round((col.width) * scale);
            });
        }

        // return;


        // return;
        // return;
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

                {this.renderHeader(headers)}
            </ SPDF.View>
            {/* FIN HEADER */}
            {data.map((item, index) => {
                console.log("item", item);
                return this.renderItem(index + 1, item, headers)
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
