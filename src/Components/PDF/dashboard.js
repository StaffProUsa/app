import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SDate, SNavigation, SText, SView } from 'servisofts-component';
import * as SPDF from 'servisofts-rn-spdf'

const key_company = SNavigation.getParam("key_company")

const cols = [
    { key: "index", label: "#", width: 20, },
    { key: "fecha", label: "DATE", width: 55 },
    { key: "company", label: "COMPANY", width: 80 },
    { key: "cliente", label: "CLIENT", width: 130 },
    { key: "evento", label: "EVENT", width: (!key_company) ? 110 : 140 },
    { key: "staff", label: "POSITION", width: 85 },
    { key: "location", label: "LOCATION", width: 110 },
    { key: "staff_personal", label: "#N", width: 30 },
    { key: "state", label: "STATE", width: 45 },
    { key: "inicio", label: "TIME IN", width: 52 },
    { key: "fin", label: "TIME OUT", width: 52 },
    // { key: "staff_descripcion", label: "DESCRIPTION", width: 65 },

]
console.log("kkey_company", key_company);
const HEIGHT = 16;
const BorderColor = "#CCCCCC"
const fontSize = 9.7;
export default class dashboard {




    static renderHeader = () => {
        let key_company_0 = SNavigation.getParam("key_company")
        console.log("cols", cols);
        let colsFilter = cols;
        if (key_company_0) colsFilter = cols.filter(item => item.key !== "company");

        return <SPDF.View style={{
            width: "100%", flexDirection: "row",
            borderColor: BorderColor,
            borderWidth: 1,
            // borderBottomWidth: 1,

        }}>
            {colsFilter.map((col, index) => {
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

                    case 2:
                        let key_company_2 = SNavigation.getParam("key_company")
                        if (key_company_2) return;

                        dato = obj["company"];
                        break;

                    case 9:
                        let horaFormateada = new Date(obj["inicio"]).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        });
                        dato = (obj["inicio"] != "") ? horaFormateada : " ";
                        break;
                    case 10:
                        let horaFormateadaFin = new Date(obj["fin"]).toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        });
                        dato = (obj["fin"] != "") ? horaFormateadaFin : " ";
                        break;
                    // case 8:
                    //     dato = obj["horas"].toFixed(2);
                    //     break;

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

        let key_company_ = SNavigation.getParam("key_company")
        let key_cliente_ = SNavigation.getParam("key_cliente")
        let key_evento_ = SNavigation.getParam("key_evento")
        let contact = "";
        let address = "";
        let phone = "";
        let email = "";
        let titulo = "";
        let imageId = data[0].__original?.company?.key ?? "default.png"; // Default image if not found

        if (key_company_ && key_cliente_ && key_evento_) {//mostrar datos de cliente y evento
            titulo = data[0].company;
            contact = data[0].__original?.cliente?.contacto ?? "";
            address = data[0].__original?.cliente?.direccion ?? "";
            phone = data[0].__original?.cliente?.telefono ?? "";
            email = data[0].__original?.cliente?.email ?? "";
        } else if (key_company_ && key_cliente_) {//mostrar datos de cliente
            titulo = data[0].company;
            contact = data[0].__original?.cliente?.contacto ?? "";
            address = data[0].__original?.cliente?.direccion ?? "";
            phone = data[0].__original?.cliente?.telefono ?? "";
            email = data[0].__original?.cliente?.email ?? "";
        } else if (key_company_) {//mostrar solo datos de empresa
            titulo = data[0].company;
            contact = data[0].__original?.company?.contacto ?? "";
            address = data[0].__original?.company?.direccion ?? "";
            phone = data[0].__original?.company?.telefono ?? "";
            email = data[0].__original?.company?.email ?? "";
        } else {//no mostrar datos de cliente ni evento
            titulo = "ALL COMPANIES";
        }
        SPDF.create(<SPDF.Page style={{ width: 791, height: 612, margin: 20, padding: 20, }}
            // header={<SPDF.View style={{
            //     width: "100%",
            // }}>

            //     <SPDF.View style={{ width: "100%", height: 32 }}></SPDF.View>

            //     <SPDF.View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: 10, }}>
            //         {/* Columna 1 */}
            //         <SPDF.View style={{ width: "33%" }}>
            //             <SPDF.Text style={{ fontSize: 10, height: 28, fontWeight: "bold", fontSize: 15, font: "Roboto" }}>Company: {titulo}</SPDF.Text>
            //             <SPDF.Text style={{ fontSize: 10, height: 15, font: "Roboto" }}>Request date: {new SDate().toString("MM/dd/yyyy")}</SPDF.Text>
            //         </SPDF.View>

            //         {/* Columna 2 */}
            //         <SPDF.View style={{ width: "33%", alignItems: "justifyContent" }}>

            //             <SPDF.Text style={{ fontSize: 10, height: 15, font: "Roboto" }}>Date from: {fecha_inicio_}</SPDF.Text>
            //         </SPDF.View>

            //         {/* Columna 3 */}
            //         <SPDF.View style={{ width: "33%", alignItems: "flex-end" }}>
            //             <SPDF.Text style={{ fontSize: 10, height: 15, font: "Roboto" }}>Date to: {fecha_fin_}</SPDF.Text>
            //         </SPDF.View>
            //     </SPDF.View>
            //     <SPDF.View style={{ width: "100%", height: 15 }}></SPDF.View>

            //     {this.renderHeader()}
            // </ SPDF.View>
            // }

            footer={<SPDF.View style={{
                width: "100%",
                alignItems: "end"
            }}>
                <SPDF.Text style={{ fontSize: fontSize, }}>{"Page #${current_page}"}</SPDF.Text>
            </SPDF.View>
            }
        >
            {/* HEADER */}
            <SPDF.View style={{
                width: "100%",
                // borderColor: BorderColor
            }}>

                <SPDF.View style={{ width: "100%", height: 32 }}></SPDF.View>

                <SPDF.View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", marginTop: 10, }}>
                    {/* Columna 1 */}
                    <SPDF.View style={{ width: "33%" }}>
                        <SPDF.Text style={{ fontSize: 10, height: 28, fontWeight: "bold", fontSize: 15, font: "Roboto" }}>Company: {titulo}</SPDF.Text>
                        <SPDF.Text style={{ fontSize: 10, height: 15, font: "Roboto" }}>Request date: {new SDate().toString("MM/dd/yyyy")}</SPDF.Text>
                    </SPDF.View>

                    {/* Columna 2 */}
                    <SPDF.View style={{ width: "33%", alignItems: "justifyContent" }}>

                        <SPDF.Text style={{ fontSize: 10, height: 15, font: "Roboto" }}>Date from: {fecha_inicio_}</SPDF.Text>
                    </SPDF.View>

                    {/* Columna 3 */}
                    <SPDF.View style={{ width: "33%", alignItems: "flex-end" }}>
                        <SPDF.Text style={{ fontSize: 10, height: 15, font: "Roboto" }}>Date to: {fecha_fin_}</SPDF.Text>
                    </SPDF.View>
                </SPDF.View>
                <SPDF.View style={{ width: "100%", height: 15 }}></SPDF.View>

                {this.renderHeader()}
            </ SPDF.View>
            {/* FIN HEADER */}

            {data.map((item, index) => {
                console.log("item", item);
                return this.renderItem(index + 1, item)
            })}
        </SPDF.Page >)
    }


}
